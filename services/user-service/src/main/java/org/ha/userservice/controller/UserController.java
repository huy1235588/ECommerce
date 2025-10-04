package org.ha.userservice.controller;

import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/test")
    public ApiResponse test() {
        return SuccessResponse.builder().message("User service is up and running").build();
    }
}
