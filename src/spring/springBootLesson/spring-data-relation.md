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
public class Parent{
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



上述如果兩個class的CRUD分開操作，那麼請不要使用Cascade。即是獨立repo save。

但假設你只能存取Parent Repo，你在加入CascadeType.All
```java
@OneToMany(mappedBy="parent", cascade = CascadeType.All)
```

但CascadeType.All並不代表斷開parent和child的關係時，child會消失。它只是變成child.parent = null。那怕你在資料庫層面，設定not null限制。也是不會令child消失。只會出現runtime exception。

若需要在斷開關係後，刪了所有沒有關聯的child，就需要加入orphanRemoval = true
```java
@OneToMany(mappedBy="parent", orphanRemoval = true)
@OneToMany(mappedBy="parent", cascade = CascadeType.All, orphanRemoval = true)
```

大家看其他例子，可能會覺得orphanRemoval = true 和 CascadeType.All 總是一起出現，但它們其實是分別操作的。單獨使用orphanRemoval = true，有時候是為了不會不小心省生副作用。例如Parent 要經更新，但Child資訊不全，那就不要使用CascadeType.All。

注意，CascadeType不是資料庫的Cascade操作，沒有 Create , Update 之分。它指的是Entity被管理的狀態。可以分為
- ALL （簡易包括下列所有狀態）
- PERSIST （將要存入資料庫，可能是create update）
- MERGE （轉為被管理狀態)
- REMOVE （將要從資料庫刪除）
- REFRESH（將要從資料庫重新讀取）
- DETACH （轉為不受管理狀態）