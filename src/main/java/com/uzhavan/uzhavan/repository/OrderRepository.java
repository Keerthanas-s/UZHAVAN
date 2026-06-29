package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.Customer;
import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.entity.Orders;
import com.uzhavan.uzhavan.entity.Orders.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

    List<Orders> findByCustomer(Customer customer);

    List<Orders> findByCustomerId(Long customerId);

    List<Orders> findByFarmer(Farmer farmer);

    List<Orders> findByFarmerId(Long farmerId);

    List<Orders> findByStatus(OrderStatus status);

    List<Orders> findByFarmerIdAndStatus(Long farmerId, OrderStatus status);

    List<Orders> findByCustomerIdAndStatus(Long customerId, OrderStatus status);

    void deleteByProductId(Long productId);
}