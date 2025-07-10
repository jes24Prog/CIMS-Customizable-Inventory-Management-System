package com.inventory.cims.service;

import com.inventory.cims.dto.CategoryDto;
import com.inventory.cims.entity.Category;
import com.inventory.cims.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
            .map(c -> modelMapper.map(c, CategoryDto.class))
            .collect(Collectors.toList());
    }

    public CategoryDto addCategory(CategoryDto categoryDto) {
        Category category = modelMapper.map(categoryDto, Category.class);
        category = categoryRepository.save(category);
        return modelMapper.map(category, CategoryDto.class);
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(categoryDto.getId()).orElseThrow();
        category.setName(categoryDto.getName());
        category.setCapacity(categoryDto.getCapacity());
        category = categoryRepository.save(category);
        return modelMapper.map(category, CategoryDto.class);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(Math.toIntExact(id));
    }
}