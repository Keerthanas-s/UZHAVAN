package com.uzhavan.uzhavan.service;

import com.uzhavan.uzhavan.entity.DistrictPrice;
import com.uzhavan.uzhavan.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceServiceImpl implements PriceService {

    @Autowired
    private PriceRepository priceRepository;

    @Override
    public DistrictPrice addOrUpdatePrice(DistrictPrice districtPrice) {
        return priceRepository.findByDistrictAndProductName(
                        districtPrice.getDistrict(), districtPrice.getProductName())
                .map(existing -> {
                    existing.setMinPrice(districtPrice.getMinPrice());
                    existing.setMaxPrice(districtPrice.getMaxPrice());
                    existing.setUnit(districtPrice.getUnit());
                    existing.setImageUrl(districtPrice.getImageUrl());
                    existing.setCategory(districtPrice.getCategory());
                    existing.setState(districtPrice.getState());
                    return priceRepository.save(existing);
                })
                .orElseGet(() -> priceRepository.save(districtPrice));
    }

    @Override
    public List<DistrictPrice> getAll() {
        return priceRepository.findAll();
    }

    @Override
    public List<DistrictPrice> getByDistrict(String district) {
        return priceRepository.findByDistrict(district);
    }

    @Override
    public List<DistrictPrice> getByProductName(String productName) {
        return priceRepository.findByProductName(productName);
    }

    @Override
    public DistrictPrice getByDistrictAndProduct(String district, String productName) {
        return priceRepository.findByDistrictAndProductName(district, productName)
                .orElseThrow(() -> new RuntimeException("Price not found for given district/product"));
    }

    @Override
    public void delete(Long id) {
        priceRepository.deleteById(id);
    }
}