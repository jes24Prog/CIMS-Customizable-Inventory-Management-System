package com.inventory.cims.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_per_unit", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerUnit;

    // Setter for orderId
    public void setOrderId(String orderId) {
        if (this.order == null) {
            this.order = new Order();
        }
        this.order.setId(orderId);
    }

    // Setter for itemId
    public void setItemId(Integer itemId) {
        if (this.item == null) {
            this.item = new Item();
        }
        this.item.setId(itemId);
    }
}