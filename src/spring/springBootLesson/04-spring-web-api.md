# Spring with web api
本節，我們將會建立一個http服務，提供json api讓程式訪問。

## 下戴模版
我們跟上節一樣，使用Spring Initializr (Maven) 下載模版，但細節筆者就不再講啦。Dependency主要選擇
- Spring Web
- Spring Boot DevTools

下載後，可以直接運行測試，可以用指令```mvn test```或經IDE運行。Spring會至少測試下能不能成功取用預設的8080端口。


implement a new controller with one get and one post method;

explain about the detail feature

running server with ide, or by command mvn clean compile spring-boot:run
curl -v localhost:8080/api/someRecord/1234
curl -v -X POST localhost:8080/api/someRecord -H "Content-Type: application/json" -d '{"requst":"did you get it?"}'


implement test case for that method (By Source Action, Generate Test)
in test case
- add @SpringBootTest, @AutoConfigureMockMvc at class level;
- add @Autowired private MockMvc mockMvc; in class attribute;
- send requets with mockMvc and test result with json path
implement test case for post method too;

notice, we are not running the real http server.