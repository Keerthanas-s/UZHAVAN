package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Orders;
import com.uzhavan.uzhavan.entity.Orders.OrderStatus;

import java.util.List;

public interface OrderService {
    Orders placeOrder(Long customerId, Long productId, Double orderedQuantity, String deliveryAddress);
    Orders getById(Long id);
    List<Orders> getByCustomer(Long customerId);
    List<Orders> getByFarmer(Long farmerId);
    List<Orders> getAll();
    Orders updateStatus(Long id, OrderStatus status);
    Orders cancelOrder(Long id);
}