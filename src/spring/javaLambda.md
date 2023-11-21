# Lambda 表達式之可讀性

Java作為一個真OOP物件導向的程式，在設計和編寫上是很嚴謹，什至是囉嗦的程度。近年很多Programmer因為各種原因，都放棄Java跳船去其他語言。

Javascript是其中一個很多人的選擇，因為Javascript有nodejs的加持，在Web世界下，可以同時走frontend、backend路線。而Javacript亦有一個很明顯的特性，就是大部份的library都以callback的型式出現。另外，Javascript也讓很多人覺得很簡潔，這除了是因為它沒有強型態的規限外，另一個原因也是因為有callback的大量使用。

## Function Pointer
其實callback，籠統一點講就是在一個function A傳入另一個function pointer B。而編寫function A的作者，並初期並不知道function pointer B的實際操作會是什麼。A作者只是強調在特別定時候，它就會使用這個function pointer B。而這種把function pointer 傳來傳去的做法，就可以看成是Functional Programming的基礎。

Functional Programming除了把function pointer 當成是一等公民以外，還有很多附加要求，例如：
- Pure Function: 它只會使用到自己的Local Variable本地變數，這樣它的作用域就鎖死在Function內部，就不會有副作用。
  - 傳統的OOP，Class中不少變數會以Class Attribute型式存在，雖然它們可能是private attribute，但還是獨立於Function外，這樣各Function的操作，都要靠作者好好地記著Class Attribute的狀態。
- Nested Functions: 與普通程式語言類似，很多情況下都需要local variable，而Function Programming要足夠好用的話，就需要彈性地在function裏定義local function pointer。

## Java Lambda 表達式
其實從Java 8開始，就有提供Lambda表達式，這是一個可以制作匿名function pointer的方法。所以硬要講，Java也可以做Functional Programming。

但必需要盡早強調的是，Java經常性地使用class attribute，它們很多時候都會引申請狀態的概念。即是在它們必需經過特定步驟後，class attribute才會有特定的意義。也就是Lambda表達式想保持Pure Function的特性，它可以使用的時期就有很大限制。

但我們還有必要使用Lambda嗎? 以筆者的經驗來講，它還是有作用的，特別在於它可以改善Class Function的閱讀性。

例如下面一個Java Class。它是一個工廠，提供一個服務可以生產一堆車。那些車而需要經過特定檢測，才能推出。
```java
public class Factory {
    // ex1
    public static List<Car> generateListOfCarByForLoop() {
        List<Car> tempCars = new ArrayList<>();
        // many other logic
        // many other logic
        // many other logic
        List<Car> passTestCars = new ArrayList<>();
        for (Car car : tempCars) {
            if (car.getWheels().size() == 4) {
                // many other check logics
                // many other check logics
                // many other check logics
                passTestCars.add(car);
            }
        }
        return passTestCars;
    }
}
```

中間的for loop可以用lambda來改寫。
```java
    // ex2
    public static List<Car> generateListOfCarByLamda() {
        List<Car> cars = new ArrayList<>();
        // many other logic
        // many other logic
        // many other logic
        cars = cars.stream().filter((car) -> {
            if (car.getWheels().size() == 4) {
                // many other check logics
                // many other check logics
                // many other check logics
                return true;
            }
            return false;
        }).toList();
        return cars;
    }
```

有人會說，上述ex2只是形式上改變了，沒有特別易讀。就像ex3這樣，把特定邏輯抽成獨立function，才是真正的易讀，對嗎?
```java
   // ex3
    public static List<Car> generateListOfCarByForLoopFunction() {
        List<Car> tempCars = new ArrayList<>();
        // many other logic
        // many other logic
        // many other logic
        List<Car> passTestCars = filterCarsByWheelsSize(tempCars, 4);
        return passTestCars;
    }

    private static List<Car> filterCarsByWheelsSize(List<Car> originalList, int targetSize) {
        List<Car> passTestCars = new ArrayList<>();
        for (Car car : originalList) {
            if (car.getWheels().size() == targetSize) {
                // many other check logics
                // many other check logics
                // many other check logics
                passTestCars.add(car);
            }
        }
        return passTestCars;
    }
```

上述ex3是一個有效的改進。如果大家不計較傳入參數的先後順序及交互影響的話，就已經很足夠。

但如果大家對於多參數的解讀又怎樣?
```java
private static List<Car> someotherfunction(List<Car> cars, List<Wheel> wheels)
```

大家又會不會突然停住，想想到底是cars影響wheels，還是wheels影響cars?

對於多參數的function來講，相互影響就會越來越多，但使用Lambda的話，可以針對性地表達這是一個Predicate Lambda。
```java
    // ex4
    public static List<Car> generateListOfCarByLamdaComposition() {
        List<Car> cars = new ArrayList<>();
        // many other logic
        // many other logic
        // many other logic
        List<Wheel> wheels = new ArrayList<>(4);
        cars = cars.stream().filter(
            filterCarByWheelSizePredicate(wheels)
        ).toList();
        return cars;
    }

    private static Predicate<Car> filterCarByWheelSizePredicate(List<Wheel> wheels){
        return (car) -> {
            if (car.getWheels().size() == wheels.size()) {
                // many other check logics
                // many other check logics
                // many other check logics
                return true;
            }
            return false;
        };
    }
```

就最後的ex4版本，可以很明確的知道是cars被Predicate所作用

如果大家還有其他使用Lambda的明顯好處，也可以一起來Github分享大家的[Code](https://github.com/macauyeah/spring-boot-demo)