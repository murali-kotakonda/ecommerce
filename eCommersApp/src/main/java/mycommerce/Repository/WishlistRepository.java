package mycommerce.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mycommerce.Model.WishlistItem;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Integer> {

    List<WishlistItem> findByUserId(Integer userId);

    Optional<WishlistItem> findByUserIdAndProduct_ProductId(Integer userId, Integer productId);

    boolean existsByUserIdAndProduct_ProductId(Integer userId, Integer productId);
}
