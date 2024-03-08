# Spring Boot 02 - 快速接入Database的選擇: Spring Data JPA

## 快速下戴模版
使用Spring initializr，可以很容易就建立一個以Spring boot starter為底的java project。大家可以使用[Spring 官網](https://start.spring.io/)又或是[vscode plugin](https://code.visualstudio.com/docs/java/java-spring-boot) 快速地建立一個maven或gradle project。筆者較為熟悉maven，就以maven起一個範例。

在使用Spring initializr有幾件事必需要指定的:
- Spring boot version: 3.x.y 或以上
- Language: java
- Group Id: 請選擇有意思的域名，如果你用github，可以選 io.github.yourusername
- artifactId: 這個範例的名字，例如commandline
- Packaging type: 本次使用jar，日後若開發web 應用，可以使用war
- Java version: 17或以上
- Dependency: Spring Data JPA, Spring Boot DevTools

這次不像過去順利，因為這裏欠缺了Database連線資料，為了方便測試，我們先在pom.xml加入

```xml
<dependencies>
	<dependency>
		<groupId>com.h2database</groupId>
		<artifactId>h2</artifactId>
		<scope>runtime</scope>
	</dependency>
</dependencies>
```

h2與spring的整合很好。即使用什麼都不設定，直接運行```mvn spring-boot:run```，都可以成功執行了。但如果可以，在application.properties加入資料庫設定，會方便日後移植到其他常用的資料庫品版牌。
```
# src/main/resources/application.properties
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.url=jdbc:h2:mem:testdb;
spring.datasource.usename=random
spring.datasource.password=random
```

然後我們就可以做靠Spring Data JPA去生資料庫的表 (table)。Spring Data JPA預設使用的是Hibernate。假設，我們有一個表叫APPLE。我們就可以開一個class Apple和一個interface AppleRepo去接它。
```java
// src/main/java/io/github/macauyeah/spring/tutorial/springbootdatabasic/Apple.java
@Entity
public class Apple {
    @Id
    String uuid;
    Double weight;
	// getter setter
}

// src/main/java/io/github/macauyeah/spring/tutorial/springbootdatabasic/AppleRepo.java
public interface AppleRepo extends JpaRepository<Apple, String>{
    // no content here
}
```

注意，因為不同需要，AppleRepo可能繼承不同的XXXRepository，它們大部份都是用來觸發寫入資料庫的指令。而這個也晚除了直接存取Hibnerate EntityManager的需要。

亦因為我們現在用的是h2Database，其實資料表並不存在。我們需要在執行Spring Boot時，同步先建立表，所以在application.properties 加入自動建表的設定。
```
# src/main/resources/application.properties
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=update
```

然後在Spring Boot Context的環境下，可以隨時執行寫入的操作。

```java
	@Autowired
	private AppleRepo appleRepo;

	public void saveApple() {
		Apple apple = new Apple();
		apple.setUuid(UUID.randomUUID().toString());
		apple.setWeight(100.0);
		appleRepo.save(apple);
	}
```

## Source Code
[spring boot data basic](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-data-basic)

因為h2Database只是用作測試用，所以spring-boot執行完，資料庫就會被刪除。而上述原始碼當中，還附上了一些dump sql的方法，至少可以讓大家驗證己儲存的結果。
