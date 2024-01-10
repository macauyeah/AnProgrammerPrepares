# Spring Boot - Maven Cheat sheet

## 基礎

刪除所有結果，全部重新編譯
```bash
mvn clean compile
```

跑起用Spring boot寫的main class，運行Spring boot context。
```bash
mvn spring-boot:run
# or
mvn clean compile spring-boot:run
```

執行測試用例，預設只會測試test資料夾下以某些命名規則的class(例如class名以Tests或Test結尾的class，其他命名規則筆者未有能力一一驗證)
```bash
mvn test
# or
mvn clean compile test
```

## 多Profile、多組件、多測試
使用-P指定編譯時的選用pom.xml中的project.profiles.profile參數。也可以用此來傳遞到spring profile，使得編譯後的spring war預設選擇特定profile。
```bash
mvn clean compile -PmvnProfile
# or
mvn clean compile spring-boot:run -PmvnProfile
```

使用-pl限定mvn指令只對某個子組件生效，但有時候子組件之間也有引用關係，所以需要再額外加上-am參數(--also-make)
```bash
mvn clean compile spring-boot:run -pl SUBMODULE_NAME -am
```

使用-Dtest=限定只執行某個class的測試用例，或單個測試函數。(可以無視class名的命名規則)
```bash
mvn test -Dtest=TEST_CLASS_NAME
# or
mvn test -Dtest=TEST_CLASS_NAME#TES_METHOD_NAME
```

若屬於多組件情況下，其他子模組找不到同樣名稱的測試，會測試失敗。需要再加上-Dsurefire.failIfNoSpecifiedTests=false
```bash
mvn test -pl SUBMODULE_NAME -am -Dtest=TEST_CLASS_NAME -Dsurefire.failIfNoSpecifiedTests=false
# or
mvn test -pl SUBMODULE_NAME -am -Dtest=TEST_CLASS_NAME#TES_METHOD_NAME -Dsurefire.failIfNoSpecifiedTests=false
```

## 打包
在本機電腦中，把java變成jar或者war。通常用於自行發佈的環境中。
```bash
mvn package
```

## 例外情況
強行把一個第三方jar，種到本機電腦中的.m2/repository
```bash
# copy from https://maven.apache.org/guides/mini/guide-3rd-party-jars-local.html
mvn install:install-file -Dfile=<path-to-file> -DgroupId=<group-id> -DartifactId=<artifact-id> -Dversion=<version> -Dpackaging=<packaging>
```

有時特定Profile沒法成功執行測試用例，或者你認為有些測試問題不影響使用，需要跳過package中的test。
```bash
mvn package -Dmaven.test.skip=true  # won't compile test folder
mvn package -DskipTests=true # compile, but won't run
```

若想預設特定submodule為不執行test。可以修改對應的pom.xml
```xml
	<profiles>
		<profile>
			<id>dev</id>
			<properties>
				<maven.test.skip>true</maven.test.skip>
			</properties>
			<activation>
				<activeByDefault>true</activeByDefault>
			</activation>
		</profile>
	</profiles>
```

此後有需要測試，則要手動執行
```bash
mvn test -pl SUBMODULE_NAME -am -Dmaven.test.skip=false
```

若你不想整個submodule 跳過，想逐個class跳過。可以
```xml
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>3.2.5</version>
				<configuration>
					<excludes>
						<exclude>**/SpecialTest.java</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
```

此後有需要測試，則要手動執行指定特定class。但你只能一個個class手動測試。
```bash
mvn clean compile test -pl SUBMODULE_NAME -am -Dtest=SpecialTest -Dsurefire.failIfNoSpecifiedTests=false
```