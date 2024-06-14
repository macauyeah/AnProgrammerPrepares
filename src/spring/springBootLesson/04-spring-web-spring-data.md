# spring boot web with spring data
本節，我們將為之前的http服務，加入認證機制，只有在資料庫現存的用戶可以登入及訪問我們的json api。

## 下戴模版
慣例，我們用Spring Initializr (Maven) 下載模版，Dependency主要選擇
- Spring Web
- Spring Boot DevTools
- Spring Security

## Controller
跟上節一樣，我們起一個Controller，為簡化測試，我們只做http GET api。
```java
//src/main/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/controller/HomeController.java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HomeController {
    @GetMapping("/someRecord/{uuid}")
    public Map<String, String> readSomeRecord(@PathVariable String uuid) {
        return Map.of("ret", "your uuid:" + uuid);
    }
}
```

準備我們的test case，但這次我們預期它應該要出現登入失敗的結果。
```java
//src/test/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/controller/HomeControllerTest.java
@SpringBootTest
@AutoConfigureMockMvc
public class HomeControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testNoLogin() throws Exception {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/someRecord/1234")
                .contentType(MediaType.APPLICATION_JSON);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is4xxClientError())
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret").doesNotExist())
                .andDo(MockMvcResultHandlers.print());
    }
}
```
在我們執行上述的測試，test case 成功過了。我們的基本設定跟上一節其實沒有多大改動，為何現在http api會回傳狀態 401？

那是因為我們在依賴中加了，Spring Security，它配合了Spring Web，就會自動為所有api加入權限檢測。我們的測試中，沒有任何用戶登入，當然會出現 http 401。為了讓我們可以好好管理誰可以使用api，我們就來設定一定Security。

我們加一個WebSecurityConfig.java，暫時指定所有的訪問路徑都必需有USER權限，並且用 http basic的方式登入。
```java
//src/main/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/config/WebSecurityConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorizeHttpRequests -> {
            authorizeHttpRequests.requestMatchers("/**").hasRole("USER");
            // 所有的訪問路徑都必需有USER權限
        });
        http.httpBasic(Customizer.withDefaults());
        // 使用http basic作為登入認證的方式
        return http.build();
    }
}
```

上述例子，只是擋了沒有權限的人，我們還需要讓有登入身份的用戶可以成得取限User權限。

我們繼續修改，WebSecurityConfig，加入只在記憶體有效的InMemoryUser
```java
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.provisioning.InMemoryUserDetailsManager;

public class WebSecurityConfig {
    //..
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
        // 我們的密碼不應該明文儲，比較保險，我們使用BCrypt演算法，為密碼做單向加密。
    }
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withUsername("admin")
                .password(passwordEncoder().encode("pass"))
                .roles("USER").build();
        // 我們在記憶中體，加入一個測試用的User，它的名字為admin，密碼為pass，權限為User
        return new InMemoryUserDetailsManager(user);
    }

    
```

add in memory user, role, userdetails

and modify test case, with user password only; (by set header, dont use mock user, because it will ignore UserDetailsService)

and we never run the real server;

curl http://localhost:8080/api/someRecord/1234

curl -u "admin:pass" http://localhost:8080/api/someRecord/1234

# read user from database

add maven dependency
- Spring Data JPA (no, because only do in memory auth)
- h2 database

public class UserServiceImpl implements UserDetailsService, load user by repo; should ignore save statement because it should exists in database;