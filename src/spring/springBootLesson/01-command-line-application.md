# Spring Boot 01 - 萬物始於Spring boot context

筆者早些時候向一位朋友討論，為何Java那麼不受歡迎。朋友一句就回答，Java煩爆，沒有人會喜歡。

老實講，Java在句法上，實在囉唆。但以筆者的經驗，即使使用其他語言和開發框架，在實戰到一定複雜程度下，其實也一樣煩爆。

而現在的Java框架中，就以Spring boot的入門門檻低。筆者從Spring boot 1.x用到現在的3.x，也真的感受到更多的簡化，所以筆者也加入一起推廣Spring boot的行列。筆者將會通過一系列最小的可執行程式，為大家講解Spring在Web和資料庫上的應用。

所以現在就不廢話，馬上開壇作法

## 快速下戴模版
使用Spring initializr，可以很容易就建立一個以Spring boot starter為底的java project。大家可以使用[Spring 官網](https://start.spring.io/)又或是[vscode plugin](https://code.visualstudio.com/docs/java/java-spring-boot) 快速地建立一個maven或gradle project。筆者較為熟悉maven，就以maven起一個範例。

在使用Spring initializr有幾件事必需要指定的:
- Spring boot version: 3.x.y 或以上
- Language: java
- Group Id: 請選擇有意思的域名，如果你用github，可以選 io.github.yourusername
- artifactId: 這個範例的名字，例如commandline
- Packaging type: 本次使用jar，日後若開發web 應用，可以使用war
- Java version: 17或以上

之後就不用選了。若你經官網起範例，你會得到一個zip檔，下載後解壓縮。若你使用vscode插件，最後插件會叫有一個位置儲存。它們都是最後也是會得到同一樣範例Java project。

你使用Vscode，Intellij打開，IDE都會自動辨識到它是java maven project，同時會顯示java和maven結構。道理上你用Intellij 應該可以無腦開始編譯(Community 或Ultimate版都可以)，
Vscode有安裝Extension Pack for Java也會開始自動編譯。不想麻煩，也可以試用[Github Codespaces - java](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/setting-up-your-java-project-for-codespaces)。Github Codespaces其實就是一個雲上的vscode，經網頁可以連到Github VM內的vscode，所以它也會有齊Extension Pack for Java等插件。

筆者最後也會上載已完成的範例，它也可以在Github Codespaces上以Java執行或繼續開發。

打開project中的pom.xml，它為我們添加了兩個很重要的lib
```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter</artifactId>
		</dependency>
		...
		...
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
```

spring-boot-starter是重中之重，它定義了怎樣動態地設定日後的其他lib，它是讓我們可以無腦設定的一個關鍵。(但若大家有很多客制化的設定，就要返撲歸真地逐個lib叫起)。

maven在預設情況下，只會負責編譯和打包目前的project原始碼。所有相關依賴(就是xml中的dependency)，並不會自動包起。而spring-boot-maven-plugin，就是幫我們把相關依據都包在一起，讓你的jar可以獨立行起來。


註: 若大家在開發lib jar，並不是一個獨立執行的jar，也就是原始碼上沒有main函數，大家就不應該引用spring-boot-starter和spring-boot-maven-plugin。

我們繼續看其他原始碼，整個資料夾就像以下那樣。
```
.
|-- HELP.md
|-- pom.xml
`-- src
    |-- main
    |   |-- java
    |   |   `-- io
    |   |       `-- github
    |   |           `-- macauyeah
    |   |               `-- springboot
    |   |                   `-- tutorial
    |   |                       `-- commandline
    |   |                           `-- CommandlineApplication.java
    |   `-- resources
    |       `-- application.properties
    `-- test
        `-- java
            `-- io
                `-- github
                    `-- macauyeah
                        `-- springboot
                            `-- tutorial
                                `-- commandline
                                    `-- CommandlineApplicationTests.java
```

CommandlineApplication是我們有main函數的java class。我像可以經過IDE運行main又或者下指令mvn spring-boot:run來執行。

## 正式開始我們的Commandline開發
我們在CommandlineApplication.class中，加入新的程式碼，實現ApplicationRunner和它的函數run。
```java
package io.github.macauyeah.springboot.tutorial.commandline;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
// other import

@SpringBootApplication
public class CommandlineApplication implements ApplicationRunner {
	static Logger LOG = LoggerFactory.getLogger(CommandlineApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(CommandlineApplication.class, args);
	}

	@Override
	public void run(ApplicationArguments args) throws Exception {
		args.getOptionNames().stream().forEach(optionName -> {
			LOG.debug("option name:" + optionName);

			args.getOptionValues(optionName).forEach(optionValue -> {
				LOG.debug("option values:" + optionValue);
			});
		});
		LOG.debug("program end.");
	}
	// ...
```

這個run函數很直白，就是更好地演譯main中的String[] args。

但大家還要看清楚，這個main並沒有直接執行run。其實它是靠SpringApplication.run及@SpringBootApplication，跑一堆自動設定，最後因為傳入CommandlineApplication.class是一個Spring 可以處理的ApplicationRunner，所以才呼叫它的CommandlineApplication.run。

換個講法，如果今天做的是web應用，傳入去的就會是SpringBootServletInitializer，這個SpringBootServletInitializer也不一定跟main是同一個class。

如果大家有興趣，可以經過反編譯器，點入@SpringBootApplication看它的原始碼，你就可以看到它其實代表了很多自動化的東西。如果我們只做一些在同一個模組下生效的事情，《自動化》極大地降低了大家入門門檻。一般來講，如果大家不在意程式碼的複用度，比較少機會自行設定，自動化已經很有用。而隨著系統規模增加，多模組就慢慢地顯得重要，在大家了解完基本的Spring後，著者再從測試用途test case入手，為大家介紹如何手動設定。

## Source Code
[Commandline Application](https://github.com/macauyeah/spring-boot-demo/tree/main/spring-boot-tutorial/commandline)