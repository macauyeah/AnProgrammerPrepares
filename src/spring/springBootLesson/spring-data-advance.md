query a very long id list
[spring-boot-tutorial/spring-boot-data-advance](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-data-advance)

從Parent 到Child


# Spring Data 關聯型態 一對多 多對一 
筆者身邊，首次接觸 ORM 的關聯型態，都會覺得很難。筆者也是，但在好好地理順它的設計時，就會覺得其實很簡單。

這節，我們先以Code First的角度，先體驗一下

例如一個Parent，有好幾個Class
```java
public class Parent{
    @OneToMany(mappedBy="parent")
    List<Child> children = new ArrayList<>();
}
```

```java
public class Child {
    @ManyToOne
    Parent parent;
}
```

json serialize, relation 通常要會單向。有需要換向serialize應該要起DTO

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