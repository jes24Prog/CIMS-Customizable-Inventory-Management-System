package com.inventory.cims.service;

import com.inventory.cims.dto.CategoryDto;
import com.inventory.cims.entity.Category;
import com.inventory.cims.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCategories_returnsMappedDtos() {
        Category cat = new Category();
        cat.setId(1);
        cat.setName("CIMSElectronics");
        cat.setCapacity(100);

        CategoryDto dto = new CategoryDto();
        dto.setId(1);
        dto.setName("CIMSElectronics");
        dto.setCapacity(100);

        when(categoryRepository.findAll()).thenReturn(List.of(cat));
        when(modelMapper.map(cat, CategoryDto.class)).thenReturn(dto);

        var result = categoryService.getAllCategories();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("CIMSElectronics", result.get(0).getName());
    }
}