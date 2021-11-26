package org.demo.security;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import javax.servlet.http.HttpServletResponse;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    protected void configure(HttpSecurity http) throws Exception {
        //@formatter:off
        http
            .formLogin()
                .successHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_OK))
                .permitAll()
            .and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .and()
                .csrf().disable()
            .authorizeRequests()
                .antMatchers("/graphiql").permitAll()
                .antMatchers("/graphql", "/graphql/**").permitAll()
                .antMatchers(HttpMethod.GET,"/greeting")
                    .hasAnyAuthority("ADMIN", "MANAGERS")
            .and()
                .httpBasic();
        //@formatter:on
    }
}
