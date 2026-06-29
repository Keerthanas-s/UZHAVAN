package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.Admin;
import com.uzhavan.uzhavan.entity.Farmer;

import java.util.List;
import java.util.Map;

public interface AdminService {
    String login(String username, String password);
    Admin register(Admin admin);
    List<Farmer> getPendingFarmers();
    Farmer approveFarmer(Long farmerId);
    void rejectFarmer(Long farmerId);
    void deleteCustomer(Long customerId);
    void deleteFarmer(Long farmerId);
    Map<String, Object> getDashboardStats();
}