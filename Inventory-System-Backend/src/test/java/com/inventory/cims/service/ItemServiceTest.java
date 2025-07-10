package com.inventory.cims.service;

import com.inventory.cims.dto.ItemDto;
import com.inventory.cims.entity.Item;
import com.inventory.cims.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ItemService itemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllItems_returnsMappedDtos() {
        Item item = new Item();
        item.setId(1);
        item.setName("Widget");
        item.setPrice(BigDecimal.valueOf(9.99));
        item.setStock(50);
        item.setStatus("In Stock");
        item.setDateAdded(LocalDate.now());

        ItemDto dto = new ItemDto();
        dto.setId(1);
        dto.setName("Widget");
        dto.setPrice(BigDecimal.valueOf(9.99));
        dto.setStock(50);

        when(itemRepository.findAll()).thenReturn(List.of(item));
        when(modelMapper.map(item, ItemDto.class)).thenReturn(dto);

        var result = itemService.getAllItems();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Widget", result.get(0).getName());
    }
}