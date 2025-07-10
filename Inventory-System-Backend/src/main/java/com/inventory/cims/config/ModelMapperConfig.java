package com.inventory.cims.config;

import com.inventory.cims.entity.*;
import com.inventory.cims.dto.*;
import org.modelmapper.Converter;
import org.modelmapper.Condition;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // skip nulls
        mapper.getConfiguration()
              .setMatchingStrategy(MatchingStrategies.STRICT)
              .setPropertyCondition(Conditions.isNotNull());

        // Converter for list of order items
        Converter<List<OrderItem>, List<OrderItemDto>> orderItemListConverter = ctx -> {
            List<OrderItem> source = ctx.getSource();
            if (source == null) return null;
            return source.stream()
                         .map(oi -> mapper.map(oi, OrderItemDto.class))
                         .collect(Collectors.toList());
        };

        // Converter for list of activity logs
        Converter<List<ActivityLog>, List<ActivityLogDto>> activityLogListConverter = ctx -> {
            List<ActivityLog> source = ctx.getSource();
            if (source == null) return null;
            return source.stream()
                         .map(al -> mapper.map(al, ActivityLogDto.class))
                         .collect(Collectors.toList());
        };

        //User → UserDto
        TypeMap<User, UserDto> userMap = mapper.createTypeMap(User.class, UserDto.class);
        userMap.addMappings(m -> {
            m.map(User::getId,            UserDto::setId);
            m.map(User::getUsername,      UserDto::setUsername);
            m.map(User::getName,          UserDto::setName);
            m.map(User::getEmail,         UserDto::setEmail);
            m.map(User::getRole,          UserDto::setRole);
            m.map(User::getAvatar,        UserDto::setAvatar);
            m.map(User::getCreatedAt,     UserDto::setCreatedAt);
            m.using(activityLogListConverter).map(User::getActivityLogs, UserDto::setActivityLogs);
        });

        //Category → CategoryDto
        mapper.createTypeMap(Category.class, CategoryDto.class);

        //Item → ItemDto
        mapper.createTypeMap(Item.class, ItemDto.class);

        //Order → OrderDto
        TypeMap<Order, OrderDto> ordMap = mapper.createTypeMap(Order.class, OrderDto.class);
        ordMap.addMappings(m -> {
            m.map(Order::getId,           OrderDto::setId);
            m.map(Order::getCustomerName, OrderDto::setCustomerName);
            m.map(Order::getOrderDate,    OrderDto::setOrderDate);
            m.map(Order::getTotalAmount,  OrderDto::setTotalAmount);
            m.map(Order::getStatus,       OrderDto::setStatus);
            m.map(Order::getCreatedAt,    OrderDto::setCreatedAt);
            m.using(orderItemListConverter).map(Order::getOrderItems, OrderDto::setOrderItems);
        });

        //OrderItem → OrderItemDto
        mapper.createTypeMap(OrderItem.class, OrderItemDto.class);

        //ActivityLog → ActivityLogDto
        mapper.createTypeMap(ActivityLog.class, ActivityLogDto.class);

        return mapper;
    }
}
