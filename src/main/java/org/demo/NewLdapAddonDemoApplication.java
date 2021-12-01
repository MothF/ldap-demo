package org.demo;


import com.amplicode.ldap.synchronization.LdapUsersSynchronizationManager;
import lombok.RequiredArgsConstructor;
import org.demo.db.user.management.Role;
import org.demo.db.user.management.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.ClassUtils;

import java.util.Collections;

@RequiredArgsConstructor
@SpringBootApplication
public class NewLdapAddonDemoApplication implements CommandLineRunner {

    final UserDetailsManager manager;
    final TransactionTemplate tt;
    final LdapUsersSynchronizationManager synchronizationManager;
    final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        System.setProperty("user.timezone", "Asia/Kolkata");
        SpringApplication.run(NewLdapAddonDemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
//        synchronizationManager.synchronizeUsers();
        tt.executeWithoutResult(status -> {
            if (!manager.userExists("admin")) {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin"));
                Role role = new Role();
                role.setAuthority("ADMIN");
                user.setRoles(Collections.singleton(role));
                manager.createUser(user);
            }
        });
    }
}
