package com.uzhavan.uzhavan.controller;

import com.uzhavan.uzhavan.entity.DistrictPrice;
import com.uzhavan.uzhavan.service.PriceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
public class PriceController {

    private final PriceService priceService;

    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @PostMapping
    public ResponseEntity<DistrictPrice> addOrUpdatePrice(@RequestBody DistrictPrice districtPrice) {
        return new ResponseEntity<>(priceService.addOrUpdatePrice(districtPrice), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DistrictPrice>> getAll() {
        return ResponseEntity.ok(priceService.getAll());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<DistrictPrice>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(priceService.getByDistrict(district));
    }

    @GetMapping("/product/{productName}")
    public ResponseEntity<List<DistrictPrice>> getByProduct(@PathVariable String productName) {
        return ResponseEntity.ok(priceService.getByProductName(productName));
    }

    @GetMapping("/district/{district}/product/{productName}")
    public ResponseEntity<DistrictPrice> getSpecific(@PathVariable String district,
                                                       @PathVariable String productName) {
        return ResponseEntity.ok(priceService.getByDistrictAndProduct(district, productName));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        priceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}