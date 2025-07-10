package com.inventory.cims.service;

import com.inventory.cims.dto.OrderItemDto;
import com.inventory.cims.entity.OrderItem;
import com.inventory.cims.repository.OrderItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class OrderItemServiceTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private OrderItemService orderItemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllOrderItems_returnsMappedDtos() {
        OrderItem oi = new OrderItem();
        oi.setId(1);
        oi.setOrder(null);
        oi.setQuantity(2);
        oi.setPricePerUnit(BigDecimal.valueOf(50.0));

        OrderItemDto dto = new OrderItemDto();
        dto.setId(1);
        dto.setOrderId("ORD123");
        dto.setQuantity(2);
        dto.setPricePerUnit(BigDecimal.valueOf(50.0));

        when(orderItemRepository.findAll()).thenReturn(List.of(oi));
        when(modelMapper.map(oi, OrderItemDto.class)).thenReturn(dto);

        var result = orderItemService.getAllOrderItems();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(2, result.get(0).getQuantity());
    }
}