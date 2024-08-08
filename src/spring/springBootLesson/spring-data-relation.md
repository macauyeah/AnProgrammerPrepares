query a very long id list
[spring-boot-tutorial/spring-boot-data-advance](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-data-advance)

從Parent 到Child


# Spring Data 關聯型態 一對多 多對一

筆者身邊的朋友，首次接觸 ORM 的關聯型態時都會覺得很難，筆者自己也是。但在好好地理順它的設計時，就會覺得其實很簡單。

## 雙向存取

這節，我們先以Code First的角度，先體驗一下程式部份的設計意向。

例如一個Parent，有好幾個Child

```java
@Entity
public class Parent {
    // ... Parent Primay Key
    @OneToMany(mappedBy="parent")
    List<Child> children = new ArrayList<>();
    // TODO add remove
}

@Entity
public class Child {
    // ... Child Primay Key
    @ManyToOne
    Parent parent;
}

```

上述的寫法很簡潔，ORM會為你自動加入join column，處理關聯的載入。在讀取Parent時，它的所有Children就可以直接在Java層面讀取，在讀取Child時，它的Parent也隨時取得。也就是，開發人員只要經SQL準備其中一方的資料，另一方並不需要手動準備，它就可以自動按需載入。

## RESTFul API 坑-雙向存取

Spring Data在Java層面的雙向存取，已經做到很方便。但經常坑到我們的是Spring Data與RESTFul API的混合應用。當我們嘗試經API回傳我們的Parent Json時，API會很聰明地把關聯的Children也變成Json回傳。但他也會把child中的parent不斷重複變成json，變成無限輪迴。

坊間有兩種不同的解決方案，可以防止無限輪迴。

- 讓Json可以認得已經序列化的元素。@JsonIdentityInfo
- 讓Json只可以單向序列化(serialization)。@JsonManagedReference, @JsonBackReference, @JsonIgnore

筆者兩個方向都試過，但首個方法並不通用，至少它不能算是一般常見的無腦Json結構。它需要伺服器、客戶端都懂這如何經IdentityInfo認得重複出現的元素。

而單向序列化，是筆者現時的通用解。在設計RESTFul READ API時，筆者就會決定到底是Parent自動回傳Child，還是Child自動回傳Parent。決策的考慮因素，主要在於是否可以簡化Client的API調用次數。通常從Parent出發，自動回傳Child，可以節省API調用。但如果是選項性的結果(List of Value)，就倒過來。有時候，遇著API需要雙向設計，就只好自己設計DTO資料傳輸對象 (Data transfer object, DTO)。

例如Parent API，就原封不動回傳原本的元素

```java
@Entity
public class Parent {
    // ... Parent Primay Key
    @OneToMany(mappedBy="parent")
    List<Child> children = new ArrayList<>();
}

@Entity
public class Child {
    // ... Child Primay Key
    @ManyToOne
    @JsonIgnore
    Parent parent;
}

```

Child API，就反過來引用。

```java
public class ParentDTO {
    // ... Parent Other fields except children
}

public class ChildDTO {
    ParentDTO parent;
    // ... Child Other fields
}

```

這種DTO，看起來很麻煩。但其實Spring有提供一個簡便的複制DTO功能，它可以把自動複制兩個class中有同一名稱、同一型別的欄位到另一個class上，不需要逐個欄位明文寫出來。

```java
BeanUtils.copy(child, childDTO);
BeanUtils.copy(parent, parentDTO);
childDTO.setParent(parentDTO)
// 因為child、childDTO中的parent欄位型別不同，BeanUtils.copy會自動忽略，其他欄位就會自動複制。
```

註: 其實古早的網頁系統設計，DTO的概念一直存取。只是現在RESTFul API的流行，很多框架已經提向便捷的Json轉換。若然平時只需Json單向存取，筆者還是省略DTO的建立。

## Presist and Casecade
前述講了一些最基本的關聯概念，但當要正式儲存或刪除，就有些考慮完整性問題。平常我們在處理資料庫的關聯表格時，也需要面Foreign Key的正確性問題。同樣地，Spring Data也有這方面的考量，但它有提份一個很方便的CascadeType選項，可以簡化一些流程。

假設你只能存取Parent Repo，那你需要在Parent中，加入CascadeType.All。當repo.save(parent)時，它就會順多把所有child的也一併進行Save，你也不需要有Child Repo的存在。
```java
@OneToMany(mappedBy="parent", cascade = CascadeType.All)
List<Child> children = new ArrayList<>();
```

但在複雜的狀況下，例如你不想在更新parent的情況下，不小心弄到child，特別是經過public web下的API操作，你對web client的資料正確性有存疑，就不要使用CascadeType了。這也是筆者認為在大多數情況下，我們都會把Parent和Child的CRUD分開操作，然後根據需要使用各自的repo save。

如果你一定要用CascadeType.ALL (CascadeType.REMOVE)，就要再留意刪除的問題。為什麼？因為刪除 parent，其實指的是某個parent不再存在，但不代表child也要一起刪除，child的parent連結可以變為null，也有重新連結其他parent的可能。

如果大家確定需要共同刪除，就可以用CascadeType.ALL 或 CascadeType.REMOVE。

還有一個新的選擇，orphanRemoval = true，也有類似效果。
```java
@OneToMany(mappedBy="parent", cascade = CascadeType.REMOVE)
List<Child> children = new ArrayList<>();
// or
@OneToMany(mappedBy="parent", orphanRemoval = true)
List<Child> children = new ArrayList<>();
// or
@OneToMany(mappedBy="parent", cascade = CascadeType.REMOVE, orphanRemoval = true)
List<Child> children = new ArrayList<>();
```
筆者測試過，混著用也是可以的。若大家看過其他教程，可能會覺得orphanRemoval = true 和 CascadeType 總是一起出現，但它們其實是分別操作的。單獨使用orphanRemoval = true，有時候則是為了不會出現無主的child，但這不代表parent和child的想要同步更新。

# JPA Entity 的生命週期
Spring Data跟傳統的資料庫Selete，Create，Update，Delete SQL 語句有所不同。也就是這個不同，它的CascadeType比資料庫的Cascade Update和Cascade Delete更強大。

Spring Data 預設其實是使用 jakarta.persistence.EntityManager，每個Entity主要分為四個狀態
- Transient / New - 不在EntityManager的掌控中
- Managed - 在EntityManager的掌控中，將會在下次flush時，變成sql create或update statement
- Detached - 脫離EntityManager的掌控，不受flush影響
- Removed - 在EntityManager的掌控中，將會在下次flush時，變成sql delete statement

在Spring Data / Jpa 以前，我們若要直接操作Hibernate，經常見到persist, remove的寫法

```java
entityManager.persist(entity);
entityManager.remove(entity);

entityManager.detach(entity);
entityManager.merge(entity);
```

其實persist就是把處於Transient、Removed的entity，改為Managed。而remove就是把Managed改為Removed。detach，merge也類似，就是Managed，Detached之間互換。

EntityManager最強大的是，它可以讓程序員不需要再為Managed狀態下的entity操心，它會自動判別下次flush，應該create還是update，如果完全沒有改動的，連update也不會執行。

(註，flush和commit也有不同，flush就是從java寫到資料庫中，在資料庫commit前，還可以使用rollback放棄。)

而Spring Data，則是進一步簡化，它把persist改為save，remove改為delete，然後自動選擇flush的時機。

## CascadeType
在解釋完Entity 的生命週期後，終於可以回到CascadeType了。這裏的CascadeType不是資料庫的Cascade操作，其實它是指EntityManager的狀態操作是否有傳遞關係。亦即是，persist(parent)時，要不要連同child也一起操作?

我們查看 CasecadeType 的原始碼，就可以發現可以被傳遞的操作共有以下這些
- PERSIST
- MERGE
- REMOVE
- REFRESH
- DETACH
- ALL (以上全部)

這裏的 CasecadeType.PERSIST ，跟資料庫的 Cascade Update 是不一樣的。資料庫裏的 Cascade Update，是指當 Parent 的 Primary Key 有變，對應child的 Foreign Key也一起變。但因為 JPA Entity 的機制， Parent 的 Primary Key 不可以改變，理論上不會發生類似資料庫的 Cascade Update，頂多有 Cascade Delete。 CasecadeType.PERSIST 就像之前述的生命週期解說一樣， 把 parent和 child 一起拉到受管理的狀態。


註: CascadeType.REMOVE有點尷尬，似乎有更特別的使用規範。筆者測試過，在某些情況下，CascadeType.REMOVE無法處理ForeignKey問題，又或者是，刪除的順序不對。詳見 [spring boot data deletion](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/deletion)


# Reference
- [entity-lifecycle-model](https://thorben-janssen.com/entity-lifecycle-model/)
- [spring boot data deletion](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/deletion)