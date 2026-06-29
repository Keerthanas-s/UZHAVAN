package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Farmer;

import java.util.List;

public interface FarmerService {
    Farmer register(Farmer farmer);
    String login(String email, String password);
    Farmer getById(Long id);
    List<Farmer> getAll();
    Farmer updateProfile(Long id, Farmer farmer);
    List<Farmer> getByDistrict(String district);
    void delete(Long id);
}