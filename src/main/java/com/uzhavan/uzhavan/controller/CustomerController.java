package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Customer;
import com.uzhavan.uzhavan.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final com.uzhavan.uzhavan.repository.CustomerRepository customerRepository;

    public CustomerController(CustomerService customerService, com.uzhavan.uzhavan.repository.CustomerRepository customerRepository) {
        this.customerService = customerService;
        this.customerRepository = customerRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> register(@RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.register(customer), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String token = customerService.login(loginRequest.get("email"), loginRequest.get("password"));
        Customer customer = customerRepository.findByEmail(loginRequest.get("email")).orElse(null);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "id", customer != null ? customer.getId() : 0L,
            "name", customer != null ? customer.getName() : "",
            "role", "CUSTOMER",
            "user", customer != null ? customer : Map.of()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAll() {
        return ResponseEntity.ok(customerService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateProfile(@PathVariable Long id, @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateProfile(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}