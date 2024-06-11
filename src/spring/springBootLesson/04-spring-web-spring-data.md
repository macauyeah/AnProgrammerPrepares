# spring boot web with spring data

- Spring Web
- Spring Boot DevTools
- Spring Security


implement get api and test case as 04;

add security folder, add role, run test case again, should failed

and modify test case, add with role statement; 

add in memory user, role, userdetails

and modify test case, with user password only; (by set header, dont use mock user, because it will ignore UserDetailsService)

and we never run the real server;

curl http://localhost:8080/api/someRecord/1234

curl -u "admin:pass" http://localhost:8080/api/someRecord/1234

# read user from database

add maven dependency
- Spring Data JPA (no, because only do in memory auth)
- h2 database

public class UserServiceImpl implements UserDetailsService, load user by repo; should ignore save statement because it should exists in database;