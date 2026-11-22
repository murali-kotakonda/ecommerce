package mycommerce.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mycommerce.Model.WishlistItem;
import mycommerce.Response.ApiResponse;
import mycommerce.Service.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ecom/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Customer wishlist management")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<ApiResponse<WishlistItem>> add(@PathVariable Integer userId,
            @PathVariable Integer productId) {
        WishlistItem item = wishlistService.addToWishlist(userId, productId);
        return new ResponseEntity<>(ApiResponse.ok("Added to wishlist", item), HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Integer userId,
            @PathVariable Integer productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<WishlistItem>>> view(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.ok(wishlistService.viewWishlist(userId)));
    }
}
