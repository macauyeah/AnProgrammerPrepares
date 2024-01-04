# Lambda 表達式之可讀性2 - Java Sorting

對於習慣寫SQL的朋友來講，排序是件很容易的事，通常在SQL的結尾，先後加上不同欄位名稱，就可以有排序效果。例如:

```sql
select car.size, car.NumberOfWheels
from car
order by car.size, car.NumberOfWheels
```

即使要改變排序的條件，先以car.NumberOfWheels再car.size，那改一改就好
```sql
select car.size, car.NumberOfWheels
from car
order by car.NumberOfWheels, car.size
```

但對於Java來說，就不是這麼容易的一回事。很多依賴SQL的商用開發者，可能也不記得Java是怎樣做Sorting interface的。但對於NoSQL的世代來講，Database應該視為一個Storage Engine。某些排序還是要靠Program層面做，例如傳統的Java就需要提供一個回傳-1, 0, 1的Function，以決定A應該排在B前面，還是相等，還是排在B後面。
```java
    public static void sortExample(){
        List<Car> cars = new ArrayList<>();
        // ... many cars
        cars.sort(ChainComparator.getOldSchoolComparator());
    }

    private static Comparator<Car> getOldSchoolComparator(){
        return (a, b)->{
            Double aCarSize = a.getSize();
            Double bCarSize = b.getSize();
            if (aCarSize.compareTo(bCarSize) != 0) {
                return aCarSize.compareTo(bCarSize);
            } else { // if tied
                Integer aNumOfWheel = a.getWheels().size();
                Integer bNumOfWheel = b.getWheels().size();
                return aNumOfWheel.compareTo(bNumOfWheel);
            }
        };
    }
```

上述例子雖然已使用Lambda去簡化寫法，但實際上如果排序欄位很多，就會出現一個很長的表達式。而且也很難去改寫中間的先後次序，例如怎樣才能很輕易地把numOfWheel改到放在carSize前面。即使我們有辦法把分段邏輯都抽入個別Function裏面，那個If的結構也是抽不走。

在Java 8 Lambda出現後，其實Comparator也有提供新的寫法，它可以連在一起繼續延伸，讓平手、再查一下條件的情況簡化了。這也是讓Dynamic Sorting變得有可能。
```java
    public static void sortExample(){
        List<Car> cars = new ArrayList<>();
        // ... many cars
        cars.sort(ChainComparator.getComparatorChain());
    }
	private static Comparator<Car> getComparatorCarSize(){
        return (aCar, bCar)->{
            Double aCarSize = aCar.getSize();
            Double bCarSize = bCar.getSize();
            return aCarSize.compareTo(bCarSize);
        };
    }

    private static Comparator<Car> getComparatorNumOfWheels(){
        return (aCar, bCar)->{
            Integer aNumOfWheel = aCar.getWheels().size();
            Integer bNumOfWheel = bCar.getWheels().size();
            return aNumOfWheel.compareTo(bNumOfWheel);
        };
    }

    private static Comparator<Car> getComparatorChain(){
        return ChainComparator.getComparatorCarSize()
            .thenComparing(ChainComparator.getComparatorNumOfWheels());
    }
```

上述的例子，可能還是沒有太體現出Lambda的好處，主要是Java型態的問題，上面那樣寫我們每次都要重複地編寫適合Car的Comparator，就變得有點囉唆。但貼心的Comparator還有提供進一步的Lambda結構。
```java
    public static void sortExample(){
        List<Car> cars = new ArrayList<>();
        // ... many cars
        cars.sort(ChainComparator.getComparatorChain2());
    }

    private static Comparator<Double> getComparatorDouble(){
        return (aCarSize, bCarSize)->{
            return aCarSize.compareTo(bCarSize);
        };
    }

    private static Comparator<Integer> getComparatorInteger(){
        return (aNumOfWheel, bNumOfWheel)->{
            return aNumOfWheel.compareTo(bNumOfWheel);
        };
    }

    private static Comparator<Car> getComparatorChain2(){
        Comparator<Car> chainedComparator = Comparator.comparing(
            car->car.getSize(), // converter
            ChainComparator.getComparatorDouble() // reuse exisiting comparator
        );
        chainedComparator = chainedComparator.thenComparing(
            car->car.getWheels().size(), // converter
            ChainComparator.getComparatorInteger() // reuse exisiting comparator
        );
        return chainedComparator;
    }
```

上述的例子中，getComparatorDouble，getComparatorInteger可能是別人寫好的Comparator，它們不是針對Car來使用的。但我們還是可以經過Comparator.comparing的介面，硬把Car轉為Double或Integer，然後就可以重用別人準備好的getComparatorDouble，getComparatorInteger。

[Github Code](https://github.com/macauyeah/spring-boot-demo/)