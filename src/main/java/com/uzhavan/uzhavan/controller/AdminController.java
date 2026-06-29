package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.Admin;
import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String token = adminService.login(loginRequest.get("username"), loginRequest.get("password"));
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", loginRequest.get("username"),
            "role", "ADMIN"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Admin> register(@RequestBody Admin admin) {
        return new ResponseEntity<>(adminService.register(admin), HttpStatus.CREATED);
    }

    @GetMapping("/farmers/pending")
    public ResponseEntity<List<Farmer>> getPendingFarmers() {
        return ResponseEntity.ok(adminService.getPendingFarmers());
    }

    @PutMapping("/farmers/{id}/approve")
    public ResponseEntity<Farmer> approveFarmer(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveFarmer(id));
    }

    @PutMapping("/farmers/{id}/reject")
    public ResponseEntity<Void> rejectFarmer(@PathVariable Long id) {
        adminService.rejectFarmer(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        adminService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/farmers/{id}")
    public ResponseEntity<Void> deleteFarmer(@PathVariable Long id) {
        adminService.deleteFarmer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}