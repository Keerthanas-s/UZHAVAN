package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Customer;

import java.util.List;

public interface CustomerService {
    Customer register(Customer customer);
    String login(String email, String password);
    Customer getById(Long id);
    List<Customer> getAll();
    Customer updateProfile(Long id, Customer customer);
    void delete(Long id);
}