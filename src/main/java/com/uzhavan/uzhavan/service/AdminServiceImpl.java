package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Admin;
import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.repository.AdminRepository;
import com.uzhavan.uzhavan.repository.CustomerRepository;
import com.uzhavan.uzhavan.repository.FarmerRepository;
import com.uzhavan.uzhavan.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String login(String username, String password) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid admin credentials");
        }
        return jwtUtil.generateToken(admin.getUsername());
    }

    @Override
    public Admin register(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    @Override
    public List<Farmer> getPendingFarmers() {
        return farmerRepository.findByApproved(false);
    }

    @Override
    public Farmer approveFarmer(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        farmer.setApproved(true);
        return farmerRepository.save(farmer);
    }

    @Override
    public void rejectFarmer(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        farmerRepository.delete(farmer);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }

    @Override
    public void deleteFarmer(Long farmerId) {
        farmerRepository.deleteById(farmerId);
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFarmers", farmerRepository.count());
        stats.put("totalCustomers", customerRepository.count());
        stats.put("pendingFarmers", farmerRepository.findByApproved(false).size());
        return stats;
    }
}