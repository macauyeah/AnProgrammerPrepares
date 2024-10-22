筆者在剛接觸Spring boot時，就被Spring的dependency injection所驚歎到。但面對著一堆”@”符號，總是很混亂，所以也花了一些時間去理解它們的不同。

# @SpringBootApplication
Spring boot的切入點，從有這個符號的class所在目錄及子目錄做初始化。這個class最好是只有一個簡單的main method。其他要初始化的東西，應該定義在個別class中，這樣不同class可以選擇自己不同的起動條件，方便測試時有不同的起動組合。
```java
@SpringBootApplication
public class CommandlineApplication {
	public static void main(String[] args) {
		SpringApplication.run(CommandlineApplication.class, args);
	}
}
```

# @Component
所有被標注為Component的class，都可以Spring初始化在它的Application Context（語境）中，變成Bean。一個Bean如果有引用其他Bean，Spring也會一層層幫你做注入。
```java
@Component
public class BasicApplicationRunner implements ApplicationRunner {
    @Override
	public void run(ApplicationArguments args) throws Exception {
    }
}
```

# @Configuration 和 @Bean
第三方library 寫好了的class，我們無法修改他們的原始碼，所以無法經過Component把它們變成Bean。這時，我們可以起一個config class，然後將其中一個method標注為Bean。同樣地，一個Bean如果有引用其他Bean，Spring也會一層層幫你做注入。

```java
@Configuration
public class WrapBean {
	@Bean
	public ThirdParty constructBean(){
		return new ThirdParty();
	}
}
```

# @Service
一般人用來表示Class是某個商業邏輯，筆者也很常用這個。筆者比較少用原始的Component去做事，道理上全用Component也可以。以Spring boot 3.x的原始碼查看，它也真的是Component的另一個別名。

# @Repository
一種很特別的Component，它專用跟資料庫結合，可以寫存取查詢。它很常會被Autowired去注入其他Bean。Spring Data Jpa中已有很多現成的Repository Interface，我們直接引用它們的話，就不需要自己加@符號去標注。
```java
// skip @Repository because it extends JpaRepository
public interface AppleRepo extends JpaRepository<Apple, String>{
    
}
```

# @Controller
一種很特別的Component，它專用於做http接口。一般還需要跟@RequestMapping等一起用。我們很少使用Autowired去注入其他Bean，只是讓它被Spring Boot Starter Web引用。