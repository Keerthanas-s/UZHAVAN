package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Customer;
import com.uzhavan.uzhavan.entity.Orders;
import com.uzhavan.uzhavan.entity.Orders.OrderStatus;
import com.uzhavan.uzhavan.entity.Product;
import com.uzhavan.uzhavan.repository.CustomerRepository;
import com.uzhavan.uzhavan.repository.OrderRepository;
import com.uzhavan.uzhavan.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Orders placeOrder(Long customerId, Long productId, Double orderedQuantity, String deliveryAddress) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isAvailable()) {
            throw new RuntimeException("Product is not available");
        }
        if (orderedQuantity > product.getQuantity()) {
            throw new RuntimeException("Ordered quantity exceeds available stock");
        }

        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(orderedQuantity));

        Orders order = new Orders();
        order.setCustomer(customer);
        order.setProduct(product);
        order.setFarmer(product.getFarmer());
        order.setOrderedQuantity(orderedQuantity);
        order.setTotalPrice(totalPrice);
        order.setDeliveryAddress(deliveryAddress);
        order.setStatus(OrderStatus.PENDING);

        product.setQuantity(product.getQuantity() - orderedQuantity);
        if (product.getQuantity() <= 0) {
            product.setAvailable(false);
        }
        productRepository.save(product);

        return orderRepository.save(order);
    }

    @Override
    public Orders getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Orders> getByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Orders> getByFarmer(Long farmerId) {
        return orderRepository.findByFarmerId(farmerId);
    }

    @Override
    public Orders updateStatus(Long id, OrderStatus status) {
        Orders order = getById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public Orders cancelOrder(Long id) {
        Orders order = getById(id);
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }
        order.setStatus(OrderStatus.CANCELLED);

        Product product = order.getProduct();
        product.setQuantity(product.getQuantity() + order.getOrderedQuantity());
        product.setAvailable(true);
        productRepository.save(product);

        return orderRepository.save(order);
    }

    @Override
    public List<Orders> getAll() {
        return orderRepository.findAll();
    }
}