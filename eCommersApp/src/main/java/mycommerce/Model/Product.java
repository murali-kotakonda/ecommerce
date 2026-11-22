package mycommerce.Model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "Products", indexes = {
        @Index(name = "idx_product_name", columnList = "name"),
        @Index(name = "idx_product_category", columnList = "category_name"),
        @Index(name = "idx_product_sku", columnList = "sku", unique = true)
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @NotNull(message = "Product name is Mandatory ,can Not Be Null")
    @NotBlank(message = "Product name is Mandatory")
    @Column(name = "name")
    private String name;

    @NotNull(message = "Product Image is Mandatory ,can Not Be Null")
    @NotBlank(message = "Product Image is Mandatory")
    @Column(name = "imageUrl")
    private String imageUrl;

    @Column(name = "isAvailable")
    private boolean isAvailable = true;

    @NotNull(message = "Product description is Mandatory ,can Not Be Null")
    @NotBlank(message = "Product description is Mandatory")
    @Size(min = 10, max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @NotNull(message = "Product price is Mandatory ,can Not Be Null")
    @Column(name = "price")
    private Double price;

    @NotNull(message = "Product category_name is Mandatory ,can Not Be Null")
    @NotBlank(message = "Product category_name is Mandatory")
    @Column(name = "category_name")
    private String category;

    // ---- Extended production fields (additive, backward compatible) ----

    @Size(max = 255)
    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "sku")
    private String sku;

    @Column(name = "brand")
    private String brand;

    /** Comma-separated gallery image URLs in addition to the primary {@link #imageUrl}. */
    @Column(name = "images", length = 2000)
    private String images;

    @Column(name = "discount_price")
    private Double discountPrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "rating")
    private Double rating = 0.0;

    /** Explicit active flag mirroring {@link #isAvailable} for the product lifecycle. */
    @Column(name = "active")
    private Boolean active = Boolean.TRUE;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<OrderItem> orderItem = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdDate = now;
        this.updatedDate = now;
        if (this.active == null) {
            this.active = this.isAvailable;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}

