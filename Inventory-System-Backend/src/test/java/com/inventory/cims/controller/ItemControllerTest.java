package com.inventory.cims.controller;

import com.inventory.cims.dto.ItemDto;
import com.inventory.cims.service.ItemService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ItemController.class)
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private ItemService itemService;

    @Test
    void getItems_returnsJsonList() throws Exception {
        ItemDto dto = new ItemDto();
        dto.setId(1);
        dto.setName("Widget");
        dto.setPrice(BigDecimal.valueOf(9.99));
        dto.setStock(50);

        when(itemService.getAllItems()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Widget"));
    }
}