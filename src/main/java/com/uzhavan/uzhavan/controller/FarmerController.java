package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.service.FarmerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;
    private final com.uzhavan.uzhavan.repository.FarmerRepository farmerRepository;

    public FarmerController(FarmerService farmerService, com.uzhavan.uzhavan.repository.FarmerRepository farmerRepository) {
        this.farmerService = farmerService;
        this.farmerRepository = farmerRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Farmer> register(@RequestBody Farmer farmer) {
        return new ResponseEntity<>(farmerService.register(farmer), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String token = farmerService.login(loginRequest.get("email"), loginRequest.get("password"));
        Farmer farmer = farmerRepository.findByEmail(loginRequest.get("email")).orElse(null);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "id", farmer != null ? farmer.getId() : 0L,
            "name", farmer != null ? farmer.getName() : "",
            "role", "FARMER",
            "user", farmer != null ? farmer : Map.of()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farmer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(farmerService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Farmer>> getAll() {
        return ResponseEntity.ok(farmerService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Farmer> updateProfile(@PathVariable Long id, @RequestBody Farmer farmer) {
        return ResponseEntity.ok(farmerService.updateProfile(id, farmer));
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<Farmer>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(farmerService.getByDistrict(district));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        farmerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}