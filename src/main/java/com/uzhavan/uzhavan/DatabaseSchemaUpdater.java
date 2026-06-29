package com.uzhavan.uzhavan;

import com.uzhavan.uzhavan.entity.DistrictPrice;
import com.uzhavan.uzhavan.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSchemaUpdater implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PriceRepository priceRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("SCHEMA UPDATE: Modifying column size for product.image_url to LONGTEXT...");
            jdbcTemplate.execute("ALTER TABLE product MODIFY COLUMN image_url LONGTEXT;");
            System.out.println("SCHEMA UPDATE SUCCESS: Successfully expanded product.image_url column to LONGTEXT!");
        } catch (Exception e) {
            System.err.println("SCHEMA UPDATE WARNING: " + e.getMessage() + " (This is normal if database is not active yet)");
        }

        try {
            if (priceRepository.count() == 0) {
                System.out.println("SEED DATA: Seeding market price sheets for Tamil Nadu districts...");
                List<String> districts = Arrays.asList(
                    "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Dindigul", "Thanjavur"
                );

                for (String district : districts) {
                    // Seed Onion
                    priceRepository.save(new DistrictPrice(null, district, "Onion", new BigDecimal("40.00"), new BigDecimal("55.00"), "kg", "", "Vegetables", "Tamil Nadu"));

                    // Seed Vegetables (30-60)
                    priceRepository.save(new DistrictPrice(null, district, "Tomato", new BigDecimal("32.00"), new BigDecimal("45.00"), "kg", "", "Vegetables", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Potato", new BigDecimal("35.00"), new BigDecimal("48.00"), "kg", "", "Vegetables", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Carrot", new BigDecimal("42.00"), new BigDecimal("58.00"), "kg", "", "Vegetables", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Brinjal", new BigDecimal("30.00"), new BigDecimal("40.00"), "kg", "", "Vegetables", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Ladies Finger", new BigDecimal("34.00"), new BigDecimal("44.00"), "kg", "", "Vegetables", "Tamil Nadu"));

                    // Seed Fruits (50-100)
                    priceRepository.save(new DistrictPrice(null, district, "Apple", new BigDecimal("80.00"), new BigDecimal("100.00"), "kg", "", "Fruits", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Banana", new BigDecimal("50.00"), new BigDecimal("65.00"), "kg", "", "Fruits", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Mango", new BigDecimal("70.00"), new BigDecimal("95.00"), "kg", "", "Fruits", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Orange", new BigDecimal("55.00"), new BigDecimal("75.00"), "kg", "", "Fruits", "Tamil Nadu"));
                    priceRepository.save(new DistrictPrice(null, district, "Papaya", new BigDecimal("50.00"), new BigDecimal("60.00"), "kg", "", "Fruits", "Tamil Nadu"));
                }
                System.out.println("SEED DATA SUCCESS: Successfully seeded market prices!");
            }
        } catch (Exception e) {
            System.err.println("SEED DATA ERROR: Failed to seed market prices: " + e.getMessage());
        }
    }
}
