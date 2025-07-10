package com.inventory.cims.service;

import com.inventory.cims.dto.OrderItemDto;
import com.inventory.cims.entity.OrderItem;
import com.inventory.cims.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;

    public List<OrderItemDto> getAllOrderItems() {
        List<OrderItem> items = orderItemRepository.findAll();
        return items.stream()
            .map(i -> modelMapper.map(i, OrderItemDto.class))
            .collect(Collectors.toList());
    }

    public OrderItemDto updateOrderItem(Long id, OrderItemDto orderItemDto) {
        OrderItem orderItem = orderItemRepository.findById(Math.toIntExact(id)).orElseThrow();
        orderItem.setOrderId(orderItemDto.getOrderId());
        orderItem.setItemId(orderItemDto.getItemId());
        orderItem.setQuantity(orderItemDto.getQuantity());
        orderItem.setPricePerUnit(orderItemDto.getPricePerUnit());
        orderItem = orderItemRepository.save(orderItem);
        return modelMapper.map(orderItem, OrderItemDto.class);
    }

    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(Math.toIntExact(id));
    }
}