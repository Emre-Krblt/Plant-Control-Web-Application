package com.plantcontrol.plant_control_api.service;

import com.plantcontrol.plant_control_api.dto.auth.AuthResponse;
import com.plantcontrol.plant_control_api.dto.auth.LoginRequest;
import com.plantcontrol.plant_control_api.dto.auth.RegisterRequest;
import com.plantcontrol.plant_control_api.entity.User;
import com.plantcontrol.plant_control_api.enums.UserRole;
import com.plantcontrol.plant_control_api.exception.BadRequestException;
import com.plantcontrol.plant_control_api.exception.ResourceNotFoundException;
import com.plantcontrol.plant_control_api.repository.UserRepository;
import com.plantcontrol.plant_control_api.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        boolean emailExists = userRepository.existsByEmailIgnoreCase(request.getEmail());

        if (emailExists) {
            throw new BadRequestException("Email is already registered.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(UserRole.USER);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            throw new BadRequestException("Invalid email or password.");
        }

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive.");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
