package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.DistrictPrice;

import java.util.List;

public interface PriceService {
    DistrictPrice addOrUpdatePrice(DistrictPrice districtPrice);
    List<DistrictPrice> getAll();
    List<DistrictPrice> getByDistrict(String district);
    List<DistrictPrice> getByProductName(String productName);
    DistrictPrice getByDistrictAndProduct(String district, String productName);
    void delete(Long id);
}