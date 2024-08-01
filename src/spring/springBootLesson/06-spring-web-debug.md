# Spring Boot Web 調試工具
之前兩節，都一直在講怎樣寫code，也介紹了Test Case的好。若為初次接觸，Spring有很多設定需要摸索，若開始時就設定錯誤，對不少人來講都會有很大打擊。在這裏，筆者就介紹一些vscode和spring的工具，可以讓IDE多幫忙一下，減少走歪路的機會。

## vscode插件
以下兩個插件，都在於提示用戶設定。

- Spring Boot Dashboard (vscjava.vscode-spring-boot-dashboard)
   - 可以那它來運作spring boot app，省去找尋main 位置的麻煩
   - 綜覽整個程式中的所有Bean (Bean是一個很重要的元素，日後會再提及)
   - 若程式為Spring boot web，可以顯示所 http endpoint。
- Spring Boot Tools (vmware.vscode-spring-boot)
   - 檢查設定檔的設定值有沒有寫錯 （application*.properties， application*.yml）
   - 綜覽檔案中的有以@為首的與spring相關的元素（檔案很大時就會有用）
   - 可以在IDE運行spring時，查看@元素的bean資訊 (not works ?, 加了actuator也是沒有看見)
- Spring Initializr（vscjava.vscode-spring-initializr）
   - 經網絡初始化spring 專案的依賴引用設定
- Maven for Java (vscjava.vscode-maven)
   - 若大家在使用Spring Initializr時，選取了maven作管理工具，那麼這插件就可以在後續幫忙更新引用。
   - 若專案的Spring 及㡳層引用有變，vscode也需要它來引用更新。
   - 這是java 開發工具包(vscjava)的其中一員，它的其他插件也可以順帶安裝。

actuator? 
## 調試工具 - open api / swagger-ui
如果我們在開發Web http API ，其實都是為了該某個客戶端使用。但如果該客端明白我們的API該怎樣使用，大家總不會逐個連結，自行編寫使用手冊及範例吧。所以就有了open api 和 swagger-ui 的旦生 。

open api，就是一個公認的使用手冊標準，我們只要在spring-web中加入 springdoc-openapi-starter-webmvc-ui 的程式庫，就可以自動為我們的controller 生成 open api 的說明檔。

更強大的是，這個程式庫可以利用剛生成的open api，配上 swagger-ui ，自動測生一個可供測試的頁面。這個頁面可以供碼農們直接操作，也會產生對應的 curl 指令，讓碼農們可以在任何的主機上重複。這樣，那麼是沒有太多解釋的說明文檔也可以使用。

spring init with spring boot web

add maven
```xml
   <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.5.0</version>
   </dependency>
```

add controller

running program, visit http://localhost:8080/swagger-ui.html , all works out of box

## swagger under proxy
set header if you can modify proxy gateway
https://springdoc.org/index.html#how-can-i-deploy-springdoc-openapi-starter-webmvc-ui-behind-a-reverse-proxy

set config if you only controller your code like using code-server
```java
  @Bean
  public OpenAPI springShopOpenAPI() {
        Server server = new Server();
        server.setUrl("http://localhost:9000/proxy/8080/");
        return new OpenAPI().servers(List.of(server));
  }
```

Connect under proxy http://localhost:9000/proxy/8080/swagger-ui.html, 
you might get "Failed to load remote configuration."
you need to paste http://localhost:9000/proxy/8080/v3/api-docs to the "explore" search box and press "explore" again the get the correct json.

# inheritance?
inheritance of controller still works, if you want to test less, un inheritance, higher test coverage you will have.