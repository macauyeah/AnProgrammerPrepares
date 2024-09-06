# Spring Boot 06 - 回顧 Spring Web + Spring Data 架構

前述幾章，一直跟著範例來寫，道理上都不難。在繼續講解其他功能之前，我們還是保險地把過去的資訊整理好，方便大家在此基礎上開支散葉。

## 最簡流程圖
```mermaid
graph TD;
    application[一個有main function，而且有@SpringBootApplication 附註的class];
    controller[所有@Controller附註的class會被轉成Http Servlet];
    repository["所有繼承 CurdRepositry 或 JpaRepository 的Interface"];
    repoInstance["CurdRepositry 或 JpaRepository 的實例"];
    entity["含有@Entity附註的class"];
    businessLogic["程序員根據業務需求，以某個方式生成、更新、刪除Entity的實例，並經過 JpaRepository 寫到資料庫中"];
    dbTable["資料庫Table(表)"];
    SpringBootServletInitializer[一個繼承SpringBootServletInitializer的class];
    application-->|自動偵測|SpringBootServletInitializer;
    SpringBootServletInitializer-->|自動設定|controller;
    application-->|自動偵測|repository;
    controller-->|引用實列|repoInstance;
    repository-->|"一對一操作 (Save, Delete, Find)"|entity;
    repository-->|自動設定|repoInstance;
    businessLogic<-->|讀寫|dbTable;
    controller-->businessLogic;
    repoInstance-->businessLogic;
    entity-->businessLogic;
```

@Controller會自動生成http endpoint，@Entity則會對應生成資料庫的表。我們可以在任何Class中，包括Controller，經過自動註冊，叫Repository去記錄@Entity。

在Spring中，@Service，@Bean都被。

controller, service, test what, 

# inheritance?
no test if inheritance?