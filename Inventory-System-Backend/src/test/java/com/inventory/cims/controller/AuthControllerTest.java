package com.inventory.cims.controller;

import com.inventory.cims.dto.JwtAuthResponse;
import com.inventory.cims.dto.LoginRequest;
import com.inventory.cims.security.JwtTokenProvider;
import com.inventory.cims.service.CustomUserDetailsService;
import com.inventory.cims.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Test
    void authenticateUser_success() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setUsername("jdoe");
        req.setPassword("password");

        when(tokenProvider.generateToken(org.mockito.Mockito.any())).thenReturn("token123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"jdoe\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("token123"));
    }

}