package mycommerce.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Data
@Entity
@Table(name = "WishlistItems",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}),
        indexes = @Index(name = "idx_wishlist_user", columnList = "user_id"))
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_item_id")
    private Integer wishlistItemId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "added_date", updatable = false)
    private LocalDateTime addedDate;

    @PrePersist
    public void onCreate() {
        this.addedDate = LocalDateTime.now();
    }
}
