package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Product;
import com.uzhavan.uzhavan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<Product> addProduct(@PathVariable Long farmerId, @RequestBody Product product) {
        return new ResponseEntity<>(productService.addProduct(farmerId, product), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Product>> getByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(productService.getByFarmer(farmerId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchByName(name));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Product> toggleAvailability(@PathVariable Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(productService.setAvailability(id, available));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}