package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.entity.Product;
import com.uzhavan.uzhavan.repository.FarmerRepository;
import com.uzhavan.uzhavan.repository.ProductRepository;
import com.uzhavan.uzhavan.repository.OrderRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Product addProduct(Long farmerId, Product product) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        if (!farmer.isApproved()) {
            throw new RuntimeException("Farmer is not approved yet");
        }
        product.setFarmer(farmer);
        product.setAvailable(true);
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @Override
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<Product> getByFarmer(Long farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    @Override
    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryAndAvailable(category, true);
    }

    @Override
    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public Product updateProduct(Long id, Product updated) {
        Product product = getById(id);
        product.setName(updated.getName());
        product.setCategory(updated.getCategory());
        product.setPrice(updated.getPrice());
        product.setQuantity(updated.getQuantity());
        product.setUnit(updated.getUnit());
        product.setDescription(updated.getDescription());
        product.setImageUrl(updated.getImageUrl());
        return productRepository.save(product);
    }

    @Override
    public Product setAvailability(Long id, boolean available) {
        Product product = getById(id);
        product.setAvailable(available);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        orderRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }
}