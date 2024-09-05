# 程序員的自我修養 A Programmer Prepares

這個倉庫是 [https://macauyeah.github.io/AProgrammerPrepares](https://macauyeah.github.io/AProgrammerPrepares) 的原始碼，經過mdbook編譯成網頁，再由GithubAction進行發佈。

這個倉內有兩個子倉庫，針對討論
- [VM和Docker](https://github.com/macauyeah/VMDockerNotes.git)
- [git](https://github.com/macauyeah/gitNotes.git)

歡迎大家一起更新及改進內容。

## 本地編譯 Local build 
```bash
sudo apt-get update && sudo apt-get install cargo
cargo install mdbook mdbook-mermaid
mdbook build .
```