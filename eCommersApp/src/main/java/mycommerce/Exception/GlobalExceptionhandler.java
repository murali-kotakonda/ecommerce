package mycommerce.Exception;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

/**
 * Centralized exception handling. Each exception type is mapped to the
 * semantically correct HTTP status code (400 / 401 / 404 / 409 / 500)
 * instead of the previous blanket 502.
 */
@ControllerAdvice
public class GlobalExceptionhandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionhandler.class);

	private MyErrorClass build(String message, WebRequest req) {
		MyErrorClass e1 = new MyErrorClass();
		e1.setMessage(message);
		e1.setLocalDateTimes(LocalDateTime.now());
		e1.setDesc(req.getDescription(false));
		return e1;
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<MyErrorClass> handleValidation(MethodArgumentNotValidException e, WebRequest req) {
		String msg = e.getBindingResult().getFieldError() != null
				? e.getBindingResult().getFieldError().getDefaultMessage()
				: "Validation failed";
		log.warn("Validation error: {}", msg);
		return new ResponseEntity<>(build(msg, req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public ResponseEntity<MyErrorClass> handleNoHandler(NoHandlerFoundException e, WebRequest req) {
		return new ResponseEntity<>(build("Requested resource was not found", req), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<MyErrorClass> handleBadCredentials(BadCredentialsException e, WebRequest req) {
		return new ResponseEntity<>(build("Invalid credentials or token", req), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(UserException.class)
	public ResponseEntity<MyErrorClass> handleUser(UserException e, WebRequest req) {
		log.warn("UserException: {}", e.getMessage());
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(AddressException.class)
	public ResponseEntity<MyErrorClass> handleAddress(AddressException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(CartException.class)
	public ResponseEntity<MyErrorClass> handleCart(CartException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(OrdersException.class)
	public ResponseEntity<MyErrorClass> handleOrders(OrdersException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(PaymentException.class)
	public ResponseEntity<MyErrorClass> handlePayment(PaymentException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ProductException.class)
	public ResponseEntity<MyErrorClass> handleProduct(ProductException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(ReviewException.class)
	public ResponseEntity<MyErrorClass> handleReview(ReviewException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ShippingException.class)
	public ResponseEntity<MyErrorClass> handleShipping(ShippingException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ShipperException.class)
	public ResponseEntity<MyErrorClass> handleShipper(ShipperException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(CategoryException.class)
	public ResponseEntity<MyErrorClass> handleCategory(CategoryException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(WishlistException.class)
	public ResponseEntity<MyErrorClass> handleWishlist(WishlistException e, WebRequest req) {
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<MyErrorClass> handleGeneric(Exception e, WebRequest req) {
		log.error("Unhandled exception", e);
		return new ResponseEntity<>(build(e.getMessage(), req), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
