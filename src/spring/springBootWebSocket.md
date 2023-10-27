# Web Socket vs http/1.1 vs http/2

## http/1.1
現時最基本的http protocol。但它效能不算很好的原因，在於每次都要起連線，先Client Request，再Server Response。雖然它可以使用[Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) header，同一個TCP/IP連線中連續做多次request/response循環，但重點是它需要先後request/response，所以當中有一個response長度很大，就要慢慢等它完結。

## http/2
沿用http/1.1的大部份東西，包括status code等，但傳送的方法做了更改。

在傳統的Client Server行為中，假設第一個Client request是去問Server取得主網頁index.html。在Client得知完整的index.html response後，分析其中有一個main.css，才後知後覺的再問server去取main.css，這才有了第二個request。

http/2，就是一種Server有主導權的機制。Server明明知道index.html會連著main.css，所以在第一次回傳時，把main.css跟index.html一起回傳，即是回傳比Client原本查詢範圍更多的結果。即它可以主動推送資料，不用等Client去做二次操作。

## Web Socket
原本在http/1.1的時代，就有人提出了升級的玩法。Web socket就是把http 1.1的request/response循環，在第一次握手後，硬改為TCP/IP 的傳統Socket機制。Client/Server可以隨時Read/Write。但跟傳統TCP Socket的差別在於，Web Socket可以保證Read時可以讀取一個完整內容，而傳統TCP Socket每次Read都可能只有該內容的一部份，要多次Read及計算長度才能確保讀完完整的內容。

因為建立了Socket，長期維持連線，再加上多工機制，所以十分適合作為實時傳輸用。

# Spring boot implementation
筆者查看了一下Spring boot的教學，http/2只有一些基本文件支援描述，但沒有簡單無腦可以的教學。但對於Web Socket，倒是有的。

STOMP (Simple / Streaming Text Orientated Messaging Protocol)是Web Socket內的一個實現方式，Spring boot提供的就是STOMP底下的Web Socket。筆者實驗後，感覺就是傳統的http 1.1升級Web Socket的做法。

# 基於Http2 的Web Socket升級版
筆者之前亦跟好友聊過一下Web Socket、Http 2的差異，經好友梳理，其實Web Socket也不一定是Http 1.1，現在Http 2也開始可以這樣玩了。

好友轉發的[Medium](https://medium.com/@pgjones/http-2-websockets-81ae3aab36dd)的文章描述下，IETF在2018年後也制定了新的玩法[RFC8441](https://www.rfc-editor.org/rfc/rfc8441)，Web Socket可以經 http 2轉化出來。

無奈筆者還受困於Spring http/1.1的限制內，未能為大家介紹更多。


# Reference
- [Mozilla Web socket](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)
- [Mozilla Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive)
- [Mozilla HTTP/2](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2)
- [Medium - pgjones - HTTP/2 WebSockets](https://medium.com/@pgjones/http-2-websockets-81ae3aab36dd)
- [Wikipedia - HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)
- [Cloudflare - HTTP/2 與 HTTP/1.1 的比較：其如何影響 Web 效能？](https://www.cloudflare.com/zh-tw/learning/performance/http2-vs-http1.1/)
- [stack overflow - HTTP/1.1, webSocket and HTTP/2.0 analysis in terms of Socket](https://stackoverflow.com/questions/52441828/http-1-1-websocket-and-http-2-0-analysis-in-terms-of-socket)
- [Spring - Using WebSocket to build an interactive web application](https://spring.io/guides/gs/messaging-stomp-websocket/)
- [IETF - RFC8441](https://www.rfc-editor.org/rfc/rfc8441)
- [Source Code - spring-boot-stomp](https://github.com/macauyeah/spring-boot-stomp)