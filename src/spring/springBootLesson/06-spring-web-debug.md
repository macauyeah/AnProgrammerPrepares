# install nessary plugin in vs code
spring boot tools

# api docs
spring init with spring boot web

add maven
```xml
   <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.5.0</version>
   </dependency>
```

set header if you can modify proxy gateway
https://springdoc.org/index.html#how-can-i-deploy-springdoc-openapi-starter-webmvc-ui-behind-a-reverse-proxy

set config if you only controller your code

```java
  @Bean
  public OpenAPI springShopOpenAPI() {
      return new OpenAPI()
              .info(new Info().title("SpringShop API")
              .description("Spring shop sample application")
              .version("v0.0.1")
              .license(new License().name("Apache 2.0").url("http://springdoc.org")))
              .externalDocs(new ExternalDocumentation()
              .description("SpringShop Wiki Documentation")
              .url("https://springshop.wiki.github.org/docs"));
  }
```
spring open-api

# inheritance?