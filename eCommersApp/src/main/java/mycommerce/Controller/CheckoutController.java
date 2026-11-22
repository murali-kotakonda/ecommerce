package mycommerce.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mycommerce.ModelDTO.CheckoutResponseDTO;
import mycommerce.ModelDTO.PaymentRequestDTO;
import mycommerce.Response.ApiResponse;
import mycommerce.Service.CheckoutService;

/**
 * Single endpoint for the "pay then create order" flow. Payment runs first
 * (mock, always succeeds) and the order is created only on success.
 */
@RestController
@RequestMapping("/ecom/checkout")
@RequiredArgsConstructor
@Tag(name = "Checkout", description = "Pay (mock) then create the order atomically")
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/{userId}")
    @Operation(summary = "Checkout: mock payment succeeds, then order is created")
    public ResponseEntity<ApiResponse<CheckoutResponseDTO>> checkout(
            @PathVariable Integer userId,
            @RequestParam(required = false, defaultValue = "UPI") String paymentMethod,
            @RequestBody(required = false) PaymentRequestDTO body) {

        String method = (body != null && body.getMethod() != null) ? body.getMethod() : paymentMethod;
        CheckoutResponseDTO result = checkoutService.checkout(userId, method);
        return ResponseEntity.ok(ApiResponse.ok("Payment successful, order created", result));
    }
}
