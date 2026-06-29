package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Product;

import java.util.List;

public interface ProductService {
    Product addProduct(Long farmerId, Product product);
    List<Product> getAll();
    Product getById(Long id);
    List<Product> getByFarmer(Long farmerId);
    List<Product> getByCategory(String category);
    List<Product> searchByName(String name);
    Product updateProduct(Long id, Product product);
    Product setAvailability(Long id, boolean available);
    void deleteProduct(Long id);
}