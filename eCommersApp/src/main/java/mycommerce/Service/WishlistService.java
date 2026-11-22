package mycommerce.Service;

import java.util.List;

import mycommerce.Model.WishlistItem;

public interface WishlistService {

    WishlistItem addToWishlist(Integer userId, Integer productId);

    void removeFromWishlist(Integer userId, Integer productId);

    List<WishlistItem> viewWishlist(Integer userId);
}
