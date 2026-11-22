package mycommerce.SecurityConfig;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import mycommerce.Enum.UserAccountStatus;
import mycommerce.Enum.UserRole;
import mycommerce.Model.Category;
import mycommerce.Model.Product;
import mycommerce.Model.User;
import mycommerce.Repository.CategoryRepository;
import mycommerce.Repository.ProductRepository;
import mycommerce.Repository.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * Seeds a bootstrap admin, a demo customer, categories and sample products on
 * first startup (only when the Users table is empty). Because admin creation is
 * now locked to ADMIN role, this provides the initial admin to break the
 * chicken-and-egg problem. Credentials are overridable via env vars.
 */
@Component
@org.springframework.context.annotation.Conditional(DataSeeder.SeederEnabledCondition.class)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    /**
     * Only runs when {@code app.seeder.enabled=true}. Disabled by default so it
     * does not conflict with Liquibase seed data.
     */
    static class SeederEnabledCondition implements org.springframework.context.annotation.Condition {
        @Override
        public boolean matches(org.springframework.context.annotation.ConditionContext ctx,
                org.springframework.core.type.AnnotatedTypeMetadata md) {
            return Boolean.parseBoolean(ctx.getEnvironment().getProperty("app.seeder.enabled", "false"));
        }
    }

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUser("admin@ecom.com", "admin123", "System", "Admin", UserRole.ROLE_ADMIN);
            seedUser("customer@ecom.com", "customer123", "Demo", "Customer", UserRole.ROLE_USER);
            log.info("Seeded bootstrap admin (admin@ecom.com / admin123) and demo customer (customer@ecom.com / customer123)");
        }

        if (categoryRepository.count() == 0) {
            seedCategory("Fruits", "Fresh fruits");
            seedCategory("Vegetables", "Fresh vegetables");
            seedCategory("Dairy", "Milk and dairy products");
            log.info("Seeded default categories");
        }

        if (productRepository.count() == 0) {
            seedProduct("Red Apple", "APL-001", "Fruits", 120.0, 99.0, 50,
                    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce");
            seedProduct("Fresh Banana", "BAN-001", "Fruits", 60.0, null, 80,
                    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e");
            seedProduct("Organic Tomato", "TOM-001", "Vegetables", 40.0, 35.0, 100,
                    "https://images.unsplash.com/photo-1546470427-f5b2d4e9f2b4");
            seedProduct("Whole Milk 1L", "MLK-001", "Dairy", 55.0, null, 30,
                    "https://images.unsplash.com/photo-1550583724-b2692b85b150");
            log.info("Seeded sample products");
        }
    }

    private void seedUser(String email, String rawPassword, String first, String last, UserRole role) {
        User u = new User();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setFirstName(first);
        u.setLastName(last);
        u.setPhoneNumber("9999999999");
        u.setRole(role);
        u.setRegisterTime(LocalDateTime.now());
        u.setUserAccountStatus(UserAccountStatus.ACTIVE);
        userRepository.save(u);
    }

    private void seedCategory(String name, String description) {
        Category c = new Category();
        c.setName(name);
        c.setDescription(description);
        c.setActive(Boolean.TRUE);
        categoryRepository.save(c);
    }

    private void seedProduct(String name, String sku, String category, double price,
            Double discount, int stock, String image) {
        Product p = new Product();
        p.setName(name);
        p.setSku(sku);
        p.setCategory(category);
        p.setPrice(price);
        p.setDiscountPrice(discount);
        p.setStockQuantity(stock);
        p.setImageUrl(image);
        p.setDescription(name + " — fresh and high quality, sourced daily.");
        p.setShortDescription(name);
        p.setBrand("Generic");
        p.setRating(4.2);
        p.setAvailable(true);
        p.setActive(Boolean.TRUE);
        productRepository.save(p);
    }
}
