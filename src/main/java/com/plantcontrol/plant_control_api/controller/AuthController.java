package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.auth.AuthResponse;
import com.plantcontrol.plant_control_api.dto.auth.LoginRequest;
import com.plantcontrol.plant_control_api.dto.auth.RegisterRequest;
import com.plantcontrol.plant_control_api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
