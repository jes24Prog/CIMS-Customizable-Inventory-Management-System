package com.inventory.cims.controller;

import com.inventory.cims.dto.UserDto;
import com.inventory.cims.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Test
    void getUsers_returnsJsonList() throws Exception {
        UserDto dto = new UserDto();
        dto.setId(1);
        dto.setUsername("jdoe");
        dto.setName("John Doe");
        dto.setEmail("jdoe@example.com");
        dto.setRole("USER");
        dto.setAvatar(null);

        when(userService.getAllUsers()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("jdoe"));
    }
}