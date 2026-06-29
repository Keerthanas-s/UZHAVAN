package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Orders;
import com.uzhavan.uzhavan.entity.Orders.OrderStatus;
import com.uzhavan.uzhavan.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Orders> placeOrder(@RequestBody Map<String, Object> orderRequest) {
        Long customerId = Long.valueOf(orderRequest.get("customerId").toString());
        Long productId = Long.valueOf(orderRequest.get("productId").toString());
        Double orderedQuantity = Double.valueOf(orderRequest.get("orderedQuantity").toString());
        String deliveryAddress = orderRequest.get("deliveryAddress").toString();

        Orders order = orderService.placeOrder(customerId, productId, orderedQuantity, deliveryAddress);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Orders>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Orders>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getByCustomer(customerId));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Orders>> getByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(orderService.getByFarmer(farmerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Orders> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Orders> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}