package com.inventory.cims.repository;

import com.inventory.cims.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    }
