# spring pure data

## 快速下戴模版
使用Spring initializr，可以很容易就建立一個以Spring boot starter為底的java project。大家可以使用[Spring 官網](https://start.spring.io/)又或是[vscode plugin](https://code.visualstudio.com/docs/java/java-spring-boot) 快速地建立一個maven或gradle project。筆者較為熟悉maven，就以maven起一個範例。

在使用Spring initializr有幾件事必需要指定的:
- Spring boot version: 3.x.y 或以上
- Language: java
- Group Id: 請選擇有意思的域名，如果你用github，可以選 io.github.yourusername
- artifactId: 這個範例的名字，例如commandline
- Packaging type: 本次使用jar，日後若開發web 應用，可以使用war
- Java version: 17或以上
- Dependency: Spring Data JPA, Spring Boot DevTools

這次不像過去順利，因為這裏欠缺了Database連線資料，為了方便測試，我們先在pom.xml加入

```xml
<dependencies>
	<dependency>
		<groupId>com.h2database</groupId>
		<artifactId>h2</artifactId>
		<scope>runtime</scope>
	</dependency>
</dependencies>
```