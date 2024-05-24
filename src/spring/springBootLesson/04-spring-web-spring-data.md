# spring boot web with spring data

- Spring Web
- Spring Boot DevTools
- Spring Data JPA
- Spring Security

對pom.xml作一些微調，加入h2。
```xml
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>test</scope>
		</dependency>
```

implement get api and test case as 04;

add security folder, add role, run test case again, should failed

and modify test case, add with statement;

select user form db as login user;