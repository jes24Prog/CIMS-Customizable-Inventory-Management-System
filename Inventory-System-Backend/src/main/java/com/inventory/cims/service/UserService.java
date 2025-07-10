package com.inventory.cims.service;

import com.inventory.cims.dto.UserDto;
import com.inventory.cims.entity.User;
import com.inventory.cims.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(u -> modelMapper.map(u, UserDto.class))
            .collect(Collectors.toList());
    }
}