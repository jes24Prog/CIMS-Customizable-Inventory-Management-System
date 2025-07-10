package com.inventory.cims.service;

import com.inventory.cims.dto.UserDto;
import com.inventory.cims.entity.User;
import com.inventory.cims.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers_returnsMappedDtos() {
        User user = new User();
        user.setId(1);
        user.setUsername("test");
        user.setName("test test");
        user.setEmail("test@test.com");
        user.setRole("USER");
        user.setAvatar(null);
        user.setCreatedAt(LocalDateTime.now());

        UserDto dto = new UserDto();
        dto.setId(1);
        dto.setUsername("test");
        dto.setName("Test Test");
        dto.setEmail("test@test.com");
        dto.setRole("USER");
        dto.setAvatar(null);

        when(userRepository.findAll()).thenReturn(List.of(user));
        when(modelMapper.map(user, UserDto.class)).thenReturn(dto);

        List<UserDto> result = userService.getAllUsers();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test", result.get(0).getUsername());
    }
}