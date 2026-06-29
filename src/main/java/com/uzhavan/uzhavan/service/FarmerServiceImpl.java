package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Farmer;
import com.uzhavan.uzhavan.repository.FarmerRepository;
import com.uzhavan.uzhavan.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerServiceImpl implements FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Farmer register(Farmer farmer) {
        if (farmerRepository.existsByEmail(farmer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        farmer.setPassword(passwordEncoder.encode(farmer.getPassword()));
        farmer.setApproved(false);
        return farmerRepository.save(farmer);
    }

    @Override
    public String login(String email, String password) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, farmer.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!farmer.isApproved()) {
            throw new RuntimeException("Account pending admin approval");
        }
        return jwtUtil.generateToken(farmer.getEmail());
    }

    @Override
    public Farmer getById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    @Override
    public List<Farmer> getAll() {
        return farmerRepository.findAll();
    }

    @Override
    public Farmer updateProfile(Long id, Farmer updated) {
        Farmer farmer = getById(id);
        farmer.setName(updated.getName());
        farmer.setPhoneNumber(updated.getPhoneNumber());
        farmer.setDistrict(updated.getDistrict());
        farmer.setVillage(updated.getVillage());
        farmer.setAddress(updated.getAddress());
        return farmerRepository.save(farmer);
    }

    @Override
    public List<Farmer> getByDistrict(String district) {
        return farmerRepository.findByDistrict(district);
    }

    @Override
    public void delete(Long id) {
        farmerRepository.deleteById(id);
    }
}