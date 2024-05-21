# Spring with web api
本節，我們將會建立一個http服務，提供json api讓程式訪問。

## 下戴模版
我們跟上節一樣，使用Spring Initializr (Maven) 下載模版，但細節筆者就不再講啦。Dependency主要選擇
- Spring Web
- Spring Boot DevTools

下載後，可以直接運行測試，可以用指令 ```mvn test``` 或經IDE運行。Spring會至少測試下能不能成功取用預設的8080端口。

## Controller
我們若要實作 http json api，需要在 spring 中加入一個類，附註為
 @RestController ，那方便起見，類名我們也命名為 XXXController 吧。作為示範，我們弄一個 HomeController.java ，裏面有最常見的 http GET, POST功能。

```java
// src/main/java/io/github/macauyeah/springboot/tutorial/springbootwebapibasic/controller/HomeController.java
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

// ... other import

@RestController
@RequestMapping("/api")
public class HomeController {
    @GetMapping("/someRecord/{uuid}")
    public Map<String, String> readSomeRecord(@PathVariable String uuid) {
        return Map.of("ret", "your uuid:" + uuid);
    }

    @PostMapping("/someRecord")
    public Map<String, String> createSomeRecord(@RequestBody Map<String, String> requestBody) {
        HashMap<String, String> ret = new HashMap<>(requestBody);
        ret.put("ret", "got your request");
        return ret;
    }
}
```

HomeController裏，完整的URL 其實為:
- GET http://localhost:8080/api/someRecord/{uuid}
- POST http://localhost:8080/api/someRecord

URL中的api之後的路徑，都是定義在 HomeController 中，而前半的8080及context path，是使用預設值。在正式環境下，可能隨時會被重新定義。但我們做本地測試，只需要驗證預設值就可以了。

我們真的運行起程式```mvn clean compile spring-boot:run```，再使用最簡測試工具進行測試。Windows的朋友，可以選擇Postman作為測試，它有圖形介面。而linux的朋友，請用curl，預設安裝都會有。下列為方便表示測試參數，筆者選用curl。

測試GET，其中1234會自動對應到spring裏的uuid。
```bash
curl http://localhost:8080/api/someRecord/1234

# return
{"ret":"your uuid:1234"}
```

測試 POST，其中的 -d 參數，會對應 spring裏的 @RequestBody， -H 參數則是設定 http header 的意思，我們就使用約定俗成的 json 作為 header 。
```bash
curl -X POST http://localhost:8080/api/someRecord -H "Content-Type: application/json" -d '{"requst":"did you get it?"}'

# return
{"requst":"did you get it?","ret":"got your request"}
```

上面的兩個操作，都回傳了我們輸入的資訊，這代表了我們成功用spring架起了http json api，而且正常讀入資訊。

## Test Case
雖然我們可以正常地架起 api，但每次開發都要 postman / curl這種工具額外試一次，其實也有一些成本。而且 api 數量變大，或經多次修改後，就重複人手執行，就變得相當討厭。

面對這個問題，筆者會建議寫測試用例，即是Test Case，而且用Spring內置的@SpringBootTest來寫。

產生一個空的Test類，vscode中，最簡單可以Source Action => Generate Test，然後加入這次要測試的參數。
```java
// src/test/java/io/github/macauyeah/springboot/tutorial/springbootwebapibasic/controller/HomeControllerTest.java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
public class HomeControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetSomeRecord() throws Exception {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/someRecord/1234")
                .contentType(MediaType.APPLICATION_JSON);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret").value("your uuid:1234"))
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    void testPostSomeRecord() throws Exception {
        String request = """
                {"requst":"did you get it?"}
                    """;
        RequestBuilder requestBuilder = MockMvcRequestBuilders.post("/api/someRecord")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request);
        this.mockMvc.perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.jsonPath("$.requst").value("did you get it?"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.ret").value("got your request"))
                .andDo(MockMvcResultHandlers.print());
    }
}
```

最後就是執行 ```mvn test``` 或經IDE運行，應該都會得到所有測試都通過的結果。
```bash
mvn test
# other test result ...
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.368 s -- in io.github.macauyeah.springboot.tutorial.springbootwebapibasic.controller.HomeControllerTest
# other test result ...
```

上面的程式碼很多，我們逐一來。
- @SpringBootTest 寫在類的外面，代表執行這個測試類時，需要運行起整個Spring程序，當然也包括http的部份。
- @AutoConfigureMockMvc 寫在類的外面，代表執行這個測試類時，可以模擬一些發向自己的 http 請求。
- @Autowired private MockMvc mockMvc 寫在類的裏面，因為之前有定義了可以模擬 http 的請求，Spring在運行時為大家提供了那個所謂的模擬http client的實例。
- MockMvcRequestBuilders，則是建造要測試的URL及Header參數。
- MockMvcResultMatchers，則是檢查回傳的結果是否如遇期的一樣。
- 為何這個http client叫模擬 - Mock ? 因為在測試用例中，可能連Controller 內部依賴組件也需要進一步模擬，這樣才能把測試目標集中在Controller裏，這也是單元測試的原意。只是本次的例子看不出模擬與否的差別。
- MockMvcResultMatchers.jsonPath()，這是用來檢測json的結構是否跟預期一樣。有些網路上的其他例子會簡寫成 jsonPath() ，但因為vscode IDE的自動import功能比較差，筆者還是保留傳統的寫法。

如果大家覺得@SpringBootTest很難，想折衷地把其他測試方法，那麼把 postman / curl好好管理起來，每次修改完程式，都完整地執行一次 postman / curl ，也可以達到測試的效果。只不過大家還是要好好學會整合 postman / curl，知道如何檢測json結構，什麼時候有錯，什麼時候叫測試通過，所以也要花一樣功夫來實現。

最後，大家千萬不要因為測試難寫而逃課，因為寫測試絕對地可以減輕日後重執行的工作量。除非你的程式碼即用即棄，否則都建議寫測試。(測試跟寫文檔不一樣，有了測試也不能沒有文檔。好消息的是，文檔現在越來越多自動生成的工具，我們日後再找機會介紹。)

## Source Code
[spring boot web api basic](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-web-api-basic)