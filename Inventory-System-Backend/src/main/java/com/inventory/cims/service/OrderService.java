package com.inventory.cims.service;

import com.inventory.cims.dto.OrderDto;
import com.inventory.cims.entity.Order;
import com.inventory.cims.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(o -> modelMapper.map(o, OrderDto.class))
                .collect(Collectors.toList());
    }

    public OrderDto addOrder(OrderDto orderDto) {
        Order order = modelMapper.map(orderDto, Order.class);
        order = orderRepository.save(order);
        return modelMapper.map(order, OrderDto.class);
    }

    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        Order order = orderRepository.findById(orderDto.getId()).orElseThrow();
        order.setCustomerName(orderDto.getCustomerName());
        order.setOrderDate(orderDto.getOrderDate());
        order.setTotalAmount(orderDto.getTotalAmount());
        order.setStatus(orderDto.getStatus());
        order = orderRepository.save(order);
        return modelMapper.map(order, OrderDto.class);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}