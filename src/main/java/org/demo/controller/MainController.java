package org.demo.controller;

import com.amplicode.ldap.synchronization.LdapUsersSynchronizationManager;
import lombok.RequiredArgsConstructor;
import org.demo.entity.Greeting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class MainController {
    private static final Logger log = LoggerFactory.getLogger(MainController.class);

    private static final String PATTERN = "Hello %s! Your grants are %s";
    private int counter;

    private final LdapUsersSynchronizationManager syncManager;

    @GetMapping("/greeting")
    public Greeting greeting(@AuthenticationPrincipal UserDetails  principal) {
        return new Greeting(++counter, String.format(PATTERN, principal.getUsername(), principal.getAuthorities()));
    }

    @GetMapping("/synchronize")
    public ResponseEntity<Map<String, List<UserDetails>>> synchronize() {
        try {
            return ResponseEntity.ok(syncManager.synchronizeUsers());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
