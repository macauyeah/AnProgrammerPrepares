# Spring Boot 05 - 為 http json api 加入登入要求
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

然後加入新的測試，直接模擬Role。結果是通過的。
```java
//src/test/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/controller/HomeControllerTest.java
    @Test
    void testLoginWithRoles() throws Exception {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/someRecord/1234")
                .contentType(MediaType.APPLICATION_JSON).with(
                        SecurityMockMvcRequestPostProcessors.user("someone")
                                .roles("USER", "ADMIN"));
                                // 沒有使用密碼，只使用Role
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret").value("your uuid:1234"))
                .andDo(MockMvcResultHandlers.print());
    }
```

再來一個測試，改用密碼登入，分別輸入錯的和正確的密碼。
```java
    @Test
    void testLoginWithWrongPasswordAndNoRole() throws Exception {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/someRecord/1234")
                .header("Authorization", "Basic randompass")
                // 輸入錯的密碼，應該回傳http 401 Unauthorized
                .contentType(MediaType.APPLICATION_JSON);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is4xxClientError())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    void testLoginWithPassword() throws Exception {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/someRecord/1234")
                .header("Authorization", "Basic YWRtaW46cGFzcw==")
                // http basic 就是把 admin:pass 轉成base64
                .contentType(MediaType.APPLICATION_JSON);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret").value("your uuid:1234"))
                .andDo(MockMvcResultHandlers.print());

    }
```

最後，當然是正確的密碼才能通過。若果大家還是半信半疑，我們可以跑起真的正服務（IDE RUN或mvn spring-boot:run），然後用curl去試。

```bash
curl http://localhost:8080/api/someRecord/1234
// failed with 401
curl -u "admin:pass" http://localhost:8080/api/someRecord/1234
// successed
```
## 使用SQL Database讀取用戶登入資訊
一般而言，我們不可能把所有用戶登資訊打在InMemoryUser中，通常背後有一個資料庫儲存所有的用戶資訊，我們在登入時，讀取它來做對比檢證。

為此，我們在maven中，加入
- Spring Data JPA
- h2 database （或任何你的資料庫，如mysql 、 sql server）

最後一步，我們把InMemoryUser去掉，改為從資料庫讀取。因為原始碼太多，就不全部貼上。最主要的是WebSecurityConfig.java要關掉之前的UserDetailsService，改為提供一個UserServiceImpl類，它會實現UserDetailsService的功能。

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    // 把原來的Bean先變成註解，其他不變

    // @Bean
    // public UserDetailsService userDetailsService() {
    //     UserDetails user = User.withUsername("admin")
    //             .password(passwordEncoder().encode("pass"))
    //             .roles("USER").build();

    //     return new InMemoryUserDetailsManager(user);
    // }
}
```

```java
// spring-boot-tutorial/spring-boot-web-api-data/src/main/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/config/UserServiceImpl.java

// other import
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserServiceImpl implements UserDetailsService {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 因為我們資料庫沒有資料，為了方便測試密碼的加密，我們在java code上直接插入一筆資料。
        UserEntity defaultUser = new UserEntity();
        defaultUser.setUsername("admin");
        defaultUser.setPassword(passwordEncoder.encode("pass"));
        defaultUser.setRole("USER");
        defaultUser.setUuid(UUID.randomUUID().toString());
        userRepo.save(defaultUser);
        // 上述為測試用插入資料，不應該出現在正式使用環境中。


        UserEntity user = userRepo.findOneByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username + " not found"));
        // 找找資料庫有沒有正在登入的該名使用者username
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        LOG.debug("got user uuid:{}, username:{}, role:{} from database", user.getUuid(), username, user.getRole());
        // 如果前面的 findOneByUsername 有結果回傳，我們就給它一個ROLE_XXX的權限。
        return new User(username, user.getPassword(), authorities);
        // 這裏從沒有檢查過密碼是否有匹配，全部交給Spring Security去做
    }
}

//spring-boot-tutorial/spring-boot-web-api-data/src/main/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/entity/UserEntity.java
// spring-boot-tutorial/spring-boot-web-api-data/src/main/java/io/github/macauyeah/springboot/tutorial/springbootwebapidata/repo/UserRepo.java
```

上述段落中，筆者省略了UserEntity和UserRepo，它們只是一般的spring-data-jpa概念，有需要可以經文末的連結查看完全原始碼。最需要注意的，是UserEntity的password欄位，在資料庫中是以加密的方式儲存。我們在配匹登入者與資料庫記錄時，也沒有自行檢驗密碼的需要。我們只是在加密過的密碼回傳給Spring Security，Spring框架會自行把登入者輸入的密碼與加密了的密碼作比較。

## Source Code
[spring boot web api data](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-web-api-data)