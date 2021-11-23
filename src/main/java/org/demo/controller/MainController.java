package org.demo.controller;

import org.demo.entity.Greeting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
    private static final Logger log = LoggerFactory.getLogger(MainController.class);

    private static final String PATTERN = "Hello %s! Your grants are %s";
    private int counter;

    @GetMapping("/greeting")
    public Greeting greeting(@AuthenticationPrincipal UserDetails  principal) {
        return new Greeting(++counter, String.format(PATTERN, principal.getUsername(), principal.getAuthorities()));
    }
}
