package org.ha.apigateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/auth")
    public String authServiceFallback() {
        return "Auth service is currently unavailable. Please try again later.";
    }

    @GetMapping("/users")
    public String userServiceFallback() {
        return "User service is currently unavailable. Please try again later.";
    }
}
