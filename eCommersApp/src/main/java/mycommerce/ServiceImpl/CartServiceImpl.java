package mycommerce.ServiceImpl;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import mycommerce.Exception.CartException;
import mycommerce.Exception.ProductException;
import mycommerce.Exception.UserException;
import mycommerce.Model.Cart;
import mycommerce.Model.CartItem;
import mycommerce.Model.Product;
import mycommerce.Model.User;
import mycommerce.Repository.CartItemRepository;
import mycommerce.Repository.CartRepository;
import mycommerce.Repository.ProductRepository;
import mycommerce.Repository.UserRepository;
import mycommerce.Service.CartService;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

	private final ProductRepository productRepository;

	private final CartRepository cartRepository;

	private final CartItemRepository cartItemRepository;

	private final UserRepository userRepository;

	/** Flat tax rate applied to the cart subtotal (10%). */
	private static final double TAX_RATE = 0.10;

	/**
	 * Recomputes subtotal, tax and grand total on the cart from its items,
	 * honoring discountPrice when present. Returns the grand total.
	 */
	private double recalculateCart(Cart cart) {
		List<CartItem> items = cart.getCartItems();
		double subTotal = 0.0;
		if (items != null) {
			for (CartItem item : items) {
				Product p = item.getProduct();
				double unit = (p.getDiscountPrice() != null && p.getDiscountPrice() > 0)
						? p.getDiscountPrice()
						: p.getPrice();
				subTotal += unit * item.getQuantity();
			}
		}
		double tax = round2(subTotal * TAX_RATE);
		double grand = round2(subTotal + tax);
		cart.setSubTotal(round2(subTotal));
		cart.setTaxAmount(tax);
		cart.setTotalAmount(grand);
		return grand;
	}

	private double round2(double v) {
		return Math.round(v * 100.0) / 100.0;
	}

	public Cart addProductToCart(Integer userId, Integer productId) throws CartException {
		log.info("Add to cart: user id={}, product id={}", userId, productId);

		Product existingProduct = productRepository.findById(productId)
				.orElseThrow(() -> new ProductException("Product not available in Stock..."));

		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserException("User Not Found In Database"));

		// Stock availability check before adding to cart
		if (existingProduct.getStockQuantity() != null && existingProduct.getStockQuantity() <= 0) {
			throw new CartException("Product is out of stock: " + existingProduct.getName());
		}

		if (existingUser.getCart() != null) {
			Cart userCart = existingUser.getCart();

			List<CartItem> cartItems = userCart.getCartItems();
			if (cartItems != null) {
				for (CartItem existing : cartItems) {
					if (existing.getProduct().getProductId().equals(productId)
							&& existing.getCart().getCartId().equals(userCart.getCartId())) {
						throw new CartException("Product Already in the Cart, Please Increase the Quantity");
					}
				}
			}
			CartItem cartItem = new CartItem();
			cartItem.setProduct(existingProduct);
			cartItem.setQuantity(1);
			cartItem.setCart(userCart);
			userCart.getCartItems().add(cartItem);

			recalculateCart(userCart);
			cartRepository.save(userCart);
			return userCart;

		} else {

			Cart newCart = new Cart();
			newCart.setUser(existingUser);
			existingUser.setCart(newCart);

			CartItem cartItem = new CartItem();
			cartItem.setProduct(existingProduct);
			cartItem.setQuantity(1);

			newCart.getCartItems().add(cartItem);
			cartItem.setCart(newCart);

			recalculateCart(newCart);
			userRepository.save(existingUser);

			return existingUser.getCart();
		}
	}

	@Override
	public Cart increaseProductQuantity(Integer cartId, Integer productId) throws CartException {
		// Resolve by cartId (matches the controller path variable and the
		// cartId the frontend stores) rather than treating it as a userId.
		Cart userCart = cartRepository.findById(cartId)
				.orElseThrow(() -> new CartException("Cart Not Found"));

		List<CartItem> cartItems = userCart.getCartItems();

		CartItem cartItemToUpdate = cartItems.stream()
				.filter(item -> item.getProduct().getProductId().equals(productId)
						&&item.getCart().getCartId().equals(userCart.getCartId())).findFirst()
				.orElseThrow(() -> new CartException("Cart Item Not Found"));

		// Stock check against available quantity
		Product product = cartItemToUpdate.getProduct();
		if (product.getStockQuantity() != null
				&& cartItemToUpdate.getQuantity() + 1 > product.getStockQuantity()) {
			throw new CartException("Only " + product.getStockQuantity() + " unit(s) available in stock");
		}

		int quantity = cartItemToUpdate.getQuantity();
		cartItemToUpdate.setQuantity(quantity + 1);
		userCart.setCartItems(cartItems);
		recalculateCart(userCart);
		cartRepository.save(userCart);

		return userCart;
	}
	@Override
	public Cart decreaseProductQuantity(Integer cartId, Integer productId) throws CartException {
		Cart userCart = cartRepository.findById(cartId)
				.orElseThrow(() -> new CartException("Cart Not Found"));

		List<CartItem> cartItems = userCart.getCartItems();
		CartItem cartItemToUpdate = cartItems.stream()
				.filter(item -> item.getProduct().getProductId().equals(productId)
						&&item.getCart().getCartId().equals(userCart.getCartId())).findFirst()
				.orElseThrow(() -> new CartException("Cart Item Not Found"));

		int quantity = cartItemToUpdate.getQuantity();
		if(quantity==1){
			throw new CartException("Product can not be Further decresse...");
		}
		if (quantity > 1) {
			cartItemToUpdate.setQuantity(quantity - 1);
			userCart.setCartItems(cartItems);
			recalculateCart(userCart);
			cartRepository.save(userCart);
		} else {
			cartItems.remove(cartItemToUpdate);
			userCart.setCartItems(cartItems);
			recalculateCart(userCart);
			cartRepository.save(userCart);
		}
		return userCart;
	}
	@Override
	public void removeProductFromCart(Integer cartId, Integer productId) throws CartException {
		Cart existingCart = cartRepository.findById(cartId).orElseThrow(() -> new CartException("Cart Not Found"));

		cartItemRepository.removeProductFromCart(cartId, productId);

		// Remove from the in-memory collection so the recalculated total is
		// correct even though the bulk delete query ran against the DB.
		List<CartItem> list = existingCart.getCartItems();
		if (list != null) {
			list.removeIf(ci -> ci.getProduct().getProductId().equals(productId));
		}
		recalculateCart(existingCart);
		cartRepository.save(existingCart);
	}

	@Override
	public Cart getAllCartProduct(Integer cartId) throws CartException {
		Cart existingCart = cartRepository.findById(cartId).orElseThrow(() -> new CartException("Cart Not Found"));

		List<CartItem> cartItems = existingCart.getCartItems();
		List<Product> products = new ArrayList<>();

		for (CartItem cartItem : cartItems) {
			if (cartItem.getCart().getCartId() == cartId) {
				Product product = cartItem.getProduct();
				products.add(product);
			}
		}
		if(products.isEmpty()){
			throw new CartException("Cart is Empty...");
		}
		return existingCart;
	}

	@Override
	public void removeAllProductFromCart(Integer cartId) throws CartException {
		Cart existingCart = cartRepository.findById(cartId).orElseThrow(() -> new CartException("Cart Not Found"));

		cartItemRepository.removeAllProductFromCart(cartId);

		if (existingCart.getCartItems() != null) {
			existingCart.getCartItems().clear();
		}
		existingCart.setSubTotal(0.0);
		existingCart.setTaxAmount(0.0);
		existingCart.setTotalAmount(0.0);
		cartRepository.save(existingCart);
	}
}