# Spring Boot 07 - Spring Boot Web 加入限制
我們在實作伺服器的Web API時，有時候會假設某些值必需要存在。但作為伺服器，其實並不保證你的客戶端會好好地填入所有參數。不想每次在寫 API 時，都自己檢查一遍每個參數是否有空值，就試用一下 validation-api 吧

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

然後就可以在必要的欄位加入標記 (@Annotation) ，例如我們定義 FirstLevel 中某些欄位不能為空 (@NotNull, @NotEmpty)。 FirstLevel 中的 secondLevel 則層遞去做檢查 (@Valid)。

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

定義好後，在每個接觸到 First Level, Second Level 參數的地方，都加入 @Valid 字眼。

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

我們直接經 unit test 測試
```java
    @Test
    void testMultiLevelValidation() throws Exception {
        // secondLevel can be all null
        String request = """
                {"nonNullString":"did you get it?"}
                    """;
        RequestBuilder requestBuilder = MockMvcRequestBuilders.post("/api/postSomething")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret.nonNullString")
                        .value("did you get it?"))
                .andDo(MockMvcResultHandlers.print());
        // if secondLevel is existed, secondLevel.nonNullString cannot be null or blank
        request = """
                {
                    "nonNullString":"did you get it?",
                    "secondLevel":{}
                }
                """;
        requestBuilder = MockMvcRequestBuilders.post("/api/postSomething")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is4xxClientError())
                .andDo(MockMvcResultHandlers.print());

        request = """
                {
                    "nonNullString":"did you get it?",
                    "secondLevel":{
                        "nonNullString":"got it"
                    }
                }
                """;
        requestBuilder = MockMvcRequestBuilders.post("/api/postSomething")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret.nonNullString")
                        .value("did you get it?"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret.secondLevel.nonNullString")
                        .value("got it"))
                .andDo(MockMvcResultHandlers.print());
    }
```

## 補充
在 pom.xml 加入 validation-api，就可以 mvn compile，但要真的正在動態中加入自己檢查，就要開啟 spring-boot-starter-validation 。

## Source Code
[spring boot web api validate](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-web-api-validate)