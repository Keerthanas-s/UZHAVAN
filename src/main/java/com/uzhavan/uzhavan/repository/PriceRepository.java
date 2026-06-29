package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.DistrictPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<DistrictPrice, Long> {

    List<DistrictPrice> findByDistrict(String district);

    List<DistrictPrice> findByProductName(String productName);

    Optional<DistrictPrice> findByDistrictAndProductName(String district, String productName);
}