package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByFarmer(Farmer farmer);

    List<Product> findByFarmerId(Long farmerId);

    List<Product> findByCategory(String category);

    List<Product> findByAvailable(boolean available);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategoryAndAvailable(String category, boolean available);
}