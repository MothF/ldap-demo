package org.demo;


import com.amplicode.ldap.synchronization.LdapUsersSynchronizationManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootApplication
public class NewLdapAddonDemoApplication implements CommandLineRunner {

    @Autowired
    UserDetailsManager manager;

    @Autowired
    TransactionTemplate tt;

    @Autowired
    LdapUsersSynchronizationManager synchronizationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(NewLdapAddonDemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
//        synchronizationManager.synchronizeUsers();
        tt.execute(status -> {
            if (!manager.userExists("admin")) {
                manager.createUser(User.withUsername("admin")
                        .password(passwordEncoder.encode("admin"))
                        .authorities(new SimpleGrantedAuthority("ADMIN"))
                        .build()
                );
            }
            return null;
        });
    }
}
