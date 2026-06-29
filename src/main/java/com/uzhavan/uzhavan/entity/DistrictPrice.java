package com.uzhavan.uzhavan.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "district_price")
public class DistrictPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private BigDecimal minPrice;

    @Column(nullable = false)
    private BigDecimal maxPrice;

    @Column(nullable = false)
    private String unit;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String category; // Vegetables, Fruits, Millets, Grains

    private String state;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public DistrictPrice() {}

    public DistrictPrice(Long id, String district, String productName, BigDecimal minPrice,
                          BigDecimal maxPrice, String unit, String imageUrl, String category, String state) {
        this.id = id;
        this.district = district;
        this.productName = productName;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.unit = unit;
        this.imageUrl = imageUrl;
        this.category = category;
        this.state = state;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}