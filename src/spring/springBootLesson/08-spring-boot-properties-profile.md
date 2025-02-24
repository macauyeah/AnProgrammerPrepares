# Spring Boot 08 - 多情境設置 maven profile 與 application.properties 
## draft point
- maven control compiled default profile
- spring boot control very possible profile
- running different profile by command and overwrite value
- multiple profile

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

但在某情特殊情況下，我們不可能簡單地重組 properties 等型式去做測試，例如針對部份uat-test的測試，只有部份可以執行，部份不可以，那麼我們還是需要用到混合 Profile ，限定某些測試需要執個某個 profile ，但其餘部份可以動態切換。

有條件的讀者，也可以先行試玩一下混合 profile 的特性，下期筆者再為不同情況作解紹。
# 混合Profile Source code
[spring boot profile](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-profile)

## 通过 Maven 参数激活 Profile

你可以使用 Maven 的 `-Dspring-boot.run.arguments` 参数来指定在运行时激活哪些 Profile。例如：

```bash
mvn clean compile spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev --spring.profiles.active=uat"
```

或者你也可以将多个 Profile 用逗号分隔：

```bash
mvn clean compile spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev,uat"
```

## 通过 Maven 打包和运行

在打包时，你可以指定要激活的 Profile，并且这些 Profile 的配置会包含在最终的 JAR 文件中。例如：

```bash
mvn clean compile package -Pdev -Dci=true
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar
```

在运行时，你仍然可以通过命令行参数覆盖已经打包的 Profile 配置：

```bash
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev --spring.profiles.active=uat
```

## 通过 Maven 参数覆盖已打包的 Profile

如果你希望在运行时覆盖已经打包的 Profile 配置，可以直接在命令行中指定新的 Profile：

```bash
java -jar target/spring-boot-profile-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev --spring.profiles.active=uat
```

## 总结

在 Spring Boot 中，激活 Profile 的方式有多种。通过 Maven 参数可以直接在运行时指定要激活的 Profile，并且这些配置可以覆盖已经打包的配置。如果你需要同时激活多个 Profile，可以使用逗号分隔。此外，在打包过程中也可以指定要激活的 Profile，并
且这些配置会包含在最终的 JAR 文件中。

希望这篇指南能帮助你更好地理解和使用 Spring Boot 的 Profile 功能！


# Reference
[官方文件](https://docs.spring.io/spring-boot/reference/features/profiles.html)

# source code
[spring boot profile](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/spring-boot-profile)