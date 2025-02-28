# Spring Boot 08 - 多情境設置 maven profile 與 application.properties 
## 為何要有不同的建構 Profile
Profile這一字，很難在IT技術文章中翻譯，它在Spring boot中的語意大概就是一個設定一個固定的運行環境參數合。例如我們做開發時，有些只想在開發環境中出現的設定，諸如測試用的資料庫、細緻一點的LOG層級，都寫在dev profile中。當換成正式環境時，我們也有一套全新的配置，而且會集中寫在prod profile中。把這些參數設定從程式碼邏輯中抽離，可以讓你的程式碼簡潔很多，也方便對比不同環境的設定。

### application.properties
Spring Boot (Spring Boot Starter) 就提供了 Profile 管理。我們可以為一個Spring Boot 模組設定多個不同的 application.properties
- src/main/resources/application.properties 為預設 (default profile)
- src/main/resources/application-uat.properties 為驗收環境專用
- src/main/resources/application-prod.properties 為投產環境專用
- src/main/resources/application-test.properties 為自動測試專用

在執行程式時，我們只要動改變啟動的參數`spring.profiles.active`，例如
```
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=uat"
# or
mvn package && java -jar target/YOUR_JAR_NAME --spring.profiles.active=uat
```

Spring Boot 就會指定載入 application-uat.properties 的內容，如果有些值沒有定義，它會再追溯到預設的 application.properties中。

在運行中改變啟動參數的情況可能不多，筆者更常用的情況是在編譯期間產生多個 Jar 檔，不同 Jar 檔指定不同的環境，方便系統管理員取用測試。想做到這個效果，我們需要在 application.properties 中，我們還需要加入一句`spring.profiles.active=@active.profile@`，並在編譯工具中加入這個變量，例如筆者常用的 maven pom.xml 中，就會有這一串設定
```
    <profiles>
		<profile>
			<id>dev</id>
			<properties>
				<active.profile>dev</active.profile>
			</properties>
			<activation>
				<activeByDefault>true</activeByDefault>
			</activation>
		</profile>
		<profile>
			<id>uat</id>
			<properties>
				<active.profile>uat</active.profile>
			</properties>
		</profile>
	</profiles>
```

它在 maven clean compile package 時，就已經可以在JAR中填入固定spring.profiles.active。那麼每次執行時，都會是指定的profile。
```
mvn package -Puat
java -jar target/YOUR_JAR_NAME
```
在這個例子中，JAR 中的 spring.profiles.active 就會固定是uat，我們不需要在啟動參數中加入字眼。

如果大家不會碰到混合Profile的話，其實上述的資訊已經足夠大家應付很多情境。

但當大家有追求，需要寫自動測試，有機會不同自動測試需要啟用不同的 Profile ，更有可能出現混合Profile的情況，這件事就變得很複雜。我們需要繼續深入了解一下 Spring Boot 的覆蓋機制，下面將會以測試方式導出結論。

如果真的對混合 Profile 沒有太多信心，我們也可以用單一 Profile 重組不同 properties 的方式，自行去模擬混合 Profile ，例如除了dev, uat, test之外，我們可以加入 dev-test, uat-test, default-test 作為驅分。這樣應該可以簡化測試的複雜度，不過 properties 檔案就可能會成幾何級成長。

但在某情特殊情況下，我們不可能簡單地重組 properties 等型式去做測試，例如針對部份uat-test的測試，只有部份可以執行，部份不可以，那麼我們還是需要用到混合 Profile ，限定某些測試需要執個某個 profile ，但其餘部份可以動態切換。接下來，就試試看混合 Profile 的使用效果吧。

## 混合 Profile
在開始之前，筆者總結一下前述的 Profile 的要點。
- Spring boot 是經過 `spring.profiles.active` 去選擇什麼 (spring boot) Profile 生效
- `spring.profiles.active` 它可以在runtime(運行時)動態更改
- maven 是經過 xml 去選擇編譯時的 (maven) profile
- maven 編譯時為 `spring.profiles.active` 填入一個固定值

另外，筆者亦在測試途中，發現一個現像。 maven 並不提供混合 profile，即使下指令同時觸發兩個 profile ，最後亦只有一個 maven profile 生效。但這個部份筆者未在官方文件中找到，大家如果有任何發現，可以幫忙修正。

### Spring boot 混合 Profile
當我們經IDE編譯時，可以為 `spring.profiles.active` 填入多個值，各值之間用逗號分隔，就可以觸發多個 profile 。
- `spring.profiles.active=dev,uat`
- 程式碼中的`application.properties`, `application-dev.properties`, `application-uat.properties` 都會生效
- Spring boot會先後載入上述三個檔案，如果有重複值，後面出現的會覆蓋前面的值。

`spring.profiles.active`如果填入的值與現在的application-xxx.properties不匹配，該部份不生效，例如
- `spring.profiles.active=dev,uat`
- 程式碼中只有`application.properties`, `application-dev.properties`，但沒有`application-uat.properties`
- Spring boot會先後載入上述兩個檔案

上述的都好理解，當大家都接受上面的結論後，再來看這個現像。
- `spring.profiles.active` 是啟動spring boot時，作為選擇profile的依據。
- `application.properties`可以有一個預設的`spring.profiles.active`，正常跑spring boot就會看它。
- 正常跑spring boot時，還可以通過傳入參數`--spring.profiles.active=xx`，改變那個值。
- Spring boot test 因為結構特殊，它只會看到 `application.properties` 中的那個`spring.profiles.active`值。
- Spring boot test 暫時沒有方法傳入參數`spring.profiles.active`，但可以經程式碼 @ActiveProfiles 硬改運行中的 profile 。`spring.profiles.active`亦只會顯示 `application.properties`中的那個值。

### Spring boot 混合 Profile 例子
大家看完概念之後，可以來看看實際例子。

當什麼都不加，就是根據`application.properties`的`spring.profiles.active`來啟動profile。
```bash
mvn clean compile spring-boot:run
# or
mvn clean compile package
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar
```

正常spring-boot:run的情況下，可以經的 `--spring.profiles.active` 覆蓋過`application.properties`內的值。
```bash
mvn clean compile spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev --spring.profiles.active=uat"
mvn clean compile spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev,uat"
# or
mvn clean compile package
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev --spring.profiles.active=uat
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev,uat
```

上述例子，若dev，uat內的值沒有衝突，沒有覆蓋問題。但如果有衝突，最後會是uat內定義的值。

### Spring boot test Profile 例子
因為不是正常spring-boot:run，所以那些參數都沒有用，具體只會看`application.properties`內預設`spring.profiles.active`
```bash
mvn clean compile test -Dspring-boot.run.arguments="--spring.profiles.active=dev,uat"
# arguments will be ignored, same as
mvn clean compile test
```

### Maven Profile 例子
加入Maven之後，就可以修改`application.properties`內的預設`spring.profiles.active`。但要注意，maven只會有單profile

假設pom.xml如下
```xml
	<profiles>
		<profile>
			<id>dev</id>
			<properties>
				<active.profile>dev</active.profile>
			</properties>
			<activation>
				<activeByDefault>true</activeByDefault>
			</activation>
		</profile>
		<profile>
			<id>uat</id>
			<properties>
				<active.profile>uat</active.profile>
			</properties>
			<activation>
				<property>
					<name>ci</name>
					<value>true</value>
				</property>
			</activation>
		</profile>
	</profiles>
```

application.properties如下
```
spring.profiles.active=@active.profile@
```

下述三組例子，有且只有uat生效。因為maven的uat生效後，會修改
```bash
mvn clean compile spring-boot:run -Puat
# or
mvn clean compile package -Pdev -Dci=true
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar
# or
mvn clean compile test -Puat
```

當然，你想要弄一個maven mix profile 也可以
```xml
	<profile>
		<id>mix</id>
		<properties>
			<active.profile>dev,uat</active.profile>
		</properties>
	</profile>
```

以下例子可以令 dev, uat 同時出現在`spring.profiles.active`
```bash
mvn clean compile spring-boot:run -Pmix
# or
mvn clean compile package -Pmix
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar
# or
mvn clean compile test -Pmix
```

### Maven Profile Spring boot test例子
上述例子都了解後，最後就來看看全部混合的情況

當Test case中沒有硬改 profile 定義，`application.properties`中的`spring.profiles.active`就直接作用。以下情況就是同時運行dev,uat
```
// java
@SpringBootTest
class ProfileTests {
}

// bash
mvn clean compile test -Pmix
```

當Test case中有定義@ActiveProfiles ，`application.properties`中的`spring.profiles.active`的值會保留，但不在該test case中生效。以下情況就是同時運行uat,dev，但讀取spring.profiles.active的值會是dev,uat。
```
// java
@SpringBootTest
@ActiveProfiles(value = { "uat", "dev" })
class MultipleProfileUatDevTests {
}

// bash
mvn clean compile test -Pmix
```


如果我們把maven 指令中的加入package，預期 test 執行的是 uat,dev 。而 jar 的打包結果會是 dev,uat。
```
// java
@SpringBootTest
@ActiveProfiles(value = { "uat", "dev" })
class MultipleProfileUatDevTests {
}

// bash
mvn clean compile test package -Pmix
```

但請盡量不要這些做，因為會越來越混亂，特別是打包 prod 環境。為減少出錯的機會，例如test污染了prod的環境，筆者在package時，通常都會跳過test。
```
mvn clean compile package -Pprod -Dmaven.test.skip=true
```


# Reference
- [官方文件](https://docs.spring.io/spring-boot/reference/features/profiles.html)
- [混合Profile Source code](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-profile)