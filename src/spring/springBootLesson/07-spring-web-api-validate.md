# Spring Boot 07 - Spring Boot Web 加入限制
我們在實作伺服器的Web API時，有時候會假設某些值必需要存在。但作為伺服器，其實並不保證你的客戶端會好好地填入所有參數


## 在pom.xml中加入依賴

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
    <groupId>jakarta.validation</groupId>
    <artifactId>jakarta.validation-api</artifactId>
    <version>3.1.0</version>
</dependency>
```

加入 validation-api，就可以compile，但要真的正在動態中加入自己檢查，就要開啟validation
```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class FirstLevel {
    @NotNull
    @NotEmpty
    private String nonNullString;
    @Valid
    private SecondLevel secondLevel;
}
```

```java
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
public class SecondLevel {
    @NotNull
    @NotEmpty
    private String nonNullString;
}
```

```java
@RestController
public class RequestController {
    @PostMapping("/api/postSomething")
    public Map<String, Object> postMethodName(
            @RequestBody @Valid FirstLevel entity) {
        return Map.of("ret", entity, "date", new Date());
    }
}
```

## Source Code
[spring boot web api validate](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-web-api-validate)