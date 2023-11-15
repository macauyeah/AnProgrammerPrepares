# Functional Programming vs Lambda

Java作為一個真OOP物件導向的程式，在設計和編寫上是很嚴謹，什至是囉嗦的程度。近年很多Programmer因為各種原因，都放棄Java跳船去其他語言。

Javascript是其中一個很多人的選擇，因為Javascript有nodejs的加持，在Web世界下，可以同時走frontend、backend路線。而Javacript亦有一個很明顯的特性，就是大部份的library都以callback的型式出現。另外，Javascript也讓很多人覺得很簡潔，這除了是因為它沒有強型態的規限外，另一個原因也是因為有callback的大量使用。

## Function Pointer
其實callback，籠統一點講就是在一個function A傳入另一個function pointer B。而編寫function A的作者，並初期並不知道function pointer B的實際操作會是什麼。A作者只是強調在特別定時候，它就會使用這個function pointer B。而這種把function pointer 傳來傳去的做法，就可以看成是Functional Programming的基礎。

Functional Programming除了把function pointer 當成是一等公民以外，還有很多附加要求，例如：
- Pure Function: 它只會使用到自己的Local Variable本地變數，這樣它的作用域就鎖死在Function內部，就不會有副作用。
  - 傳統的OOP，Class中不少變數會以Class Attribute型式存在，雖然它們可能是private attribute，但還是獨立於Function外，這樣各Function的操作，都要靠作者好好地記著Class Attribute的狀態。
- Nested Functions: 與普通程式語言類似，很多情況下都需要對一個Function進行Recursive Call（遞迴）。Function Programming也一樣，但更重要的性質是這樣才能夠更好地重用Function，在某些時候可以重複傳遞。