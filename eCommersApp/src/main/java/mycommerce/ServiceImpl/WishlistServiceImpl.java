package mycommerce.ServiceImpl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import mycommerce.Exception.ProductException;
import mycommerce.Exception.UserException;
import mycommerce.Exception.WishlistException;
import mycommerce.Model.Product;
import mycommerce.Model.WishlistItem;
import mycommerce.Repository.ProductRepository;
import mycommerce.Repository.UserRepository;
import mycommerce.Repository.WishlistRepository;
import mycommerce.Service.WishlistService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private static final Logger log = LoggerFactory.getLogger(WishlistServiceImpl.class);

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public WishlistItem addToWishlist(Integer userId, Integer productId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found with id: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found with id: " + productId));

        if (wishlistRepository.existsByUserIdAndProduct_ProductId(userId, productId)) {
            throw new WishlistException("Product already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setUserId(userId);
        item.setProduct(product);
        log.info("Adding product {} to wishlist for user {}", productId, userId);
        return wishlistRepository.save(item);
    }

    @Override
    public void removeFromWishlist(Integer userId, Integer productId) {
        WishlistItem item = wishlistRepository.findByUserIdAndProduct_ProductId(userId, productId)
                .orElseThrow(() -> new WishlistException("Item not found in wishlist"));
        log.info("Removing product {} from wishlist for user {}", productId, userId);
        wishlistRepository.delete(item);
    }

    @Override
    public List<WishlistItem> viewWishlist(Integer userId) {
        return wishlistRepository.findByUserId(userId);
    }
}
