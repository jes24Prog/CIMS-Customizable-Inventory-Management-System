package com.inventory.cims.repository;

import com.inventory.cims.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
    }
