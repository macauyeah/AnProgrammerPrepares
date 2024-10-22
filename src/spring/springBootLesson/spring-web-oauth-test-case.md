# spring web oauth test case

You may not touch oauth server during test phase. (the oauth server is under firewall or something likely).

You want to skip auto config of OAuth2ClientAutoConfiguration by ***@EnableAutoConfiguration(exclude={OAuth2ClientAutoConfiguration.class})***

But everything that need @Autowired will not work. Then you need to mock every bean that is related to oauth2. like
- OAuth2AuthorizedClientManager
- ClientRegistrationRepository
- OAuth2AuthorizedClientRepository

```java
package io.github.macauyeah.ssoclient;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;

@SpringBootTest
@EnableAutoConfiguration(exclude={OAuth2ClientAutoConfiguration.class})
public class WebApplicationTests {
	@MockBean
	OAuth2AuthorizedClientManager authorizedClientManager;
	@MockBean
	ClientRegistrationRepository clientRegistrationRepository;
	@MockBean
	OAuth2AuthorizedClientRepository authorizedClientRepository;
	@Test
	public void contextLoads() {
	}

}
```

if you test controller only, less thing that need to be mocked
```java
package io.github.macauyeah.ssoclient;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;


@WebMvcTest(value = { HomeController.class }, excludeAutoConfiguration = OAuth2ClientAutoConfiguration.class)
public class HomeControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    OAuth2AuthorizedClientRepository authorizedClientRepository;
    
    @Test
    public void testWithAuth() throws Exception {
        RequestBuilder requestBuilder = get("/api/version")
                .with(authentication(getOauthAuthenticationFor(createOAuth2User("macauyeah", "macauyeah@github.io"))));
        this.mockMvc.perform(requestBuilder).andExpect(status().isOk()).andDo(print());
    }


    public static Authentication getOauthAuthenticationFor(OAuth2User principal) {
        Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
        String authorizedClientRegistrationId = "dummyId";
        return new OAuth2AuthenticationToken(principal, authorities, authorizedClientRegistrationId);
    }

    public static OAuth2User createOAuth2User(String name, String email) {
        Set<GrantedAuthority> mappedAuthorities = new HashSet<>();
        mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", name);
        attributes.put("email", email);

        return new DefaultOAuth2User(mappedAuthorities, attributes, "name");
    }
}
```