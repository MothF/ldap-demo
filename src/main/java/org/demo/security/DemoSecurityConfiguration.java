package org.demo.security;

//import com.haulmont.np.ldap.security.LdapAuthenticationProviderDecorator;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class DemoSecurityConfiguration extends WebSecurityConfigurerAdapter {

    protected void configure(HttpSecurity http) throws Exception {
        //@formatter:off
        http
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers("/graphiql").permitAll()
                    .antMatchers(HttpMethod.GET,"/greeting")
                        .hasAnyAuthority("ADMIN", "MANAGERS")
                    .and()
                .formLogin()
                    .permitAll()
                    .and()
                .httpBasic();
        //@formatter:on
    }
}
