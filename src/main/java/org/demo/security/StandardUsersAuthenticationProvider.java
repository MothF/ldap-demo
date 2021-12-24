package org.demo.security;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.stereotype.Component;

@Component
public class StandardUsersAuthenticationProvider extends DaoAuthenticationProvider {
    public StandardUsersAuthenticationProvider(UserDetailsService userDetailsService) {
        setPasswordEncoder(PasswordEncoderFactories.createDelegatingPasswordEncoder());
        setUserDetailsService(userDetailsService);
    }
}
