# spring data test case

這節，我們將會使用spring-data-jpa，寫一個業務上的資料庫模組，提供資料表的存取，讓你的好同僚可以直接使用。這樣可以在多模組的環境中，減少同一個資料表在不同地方重複又重複地重定義。將來要更新，也可以使用jar檔的方式發佈。

Spring Initializr
H2 Database
Spring Data JPA

對pom.xml作一些微調，並把spring-boot-start-data-jpa，h2改為只在測試中生效。
```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
			<scope>test</scope>
		</dependency>
        <dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>test</scope>
		</dependency>
```

並把Java檔案搬一搬位置

```bash
# old location
src/main/java/io/github/macauyeah/springboot/tutorial/springbootdatatest/SpringBootDataTestApplication.java
src/main/resources/application.properties
# new location
src/test/java/io/github/macauyeah/springboot/tutorial/springbootdatatest/SpringBootDataTestApplication.java
src/test/resources/application.properties
```

以上的操作，主要是因為我們的目標是提供Schema，或者叫資料表規格。其他用於做連線的操作，我們不需要打包在jar內。所以把那些次要的東西都放在test資料夾中。

然後我們入正題，在pom.xml中加入hibernate-core，spring-data-jpa，
```xml
        <dependency>
			<groupId>org.springframework.data</groupId>
			<artifactId>spring-data-jpa</artifactId>
		</dependency>
        <dependency>
			<groupId>org.hibernate.orm</groupId>
			<artifactId>hibernate-core</artifactId>
		</dependency>
```