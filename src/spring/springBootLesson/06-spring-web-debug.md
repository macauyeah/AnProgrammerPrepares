# install nessary plugin in vs code
spring boot tools

# api docs - open api
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
inheritance of controller still works