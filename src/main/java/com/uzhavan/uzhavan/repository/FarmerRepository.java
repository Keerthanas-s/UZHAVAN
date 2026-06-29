package com.uzhavan.uzhavan.repository;

import com.uzhavan.uzhavan.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {

    Optional<Farmer> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Farmer> findByApproved(boolean approved);

    List<Farmer> findByDistrict(String district);
}