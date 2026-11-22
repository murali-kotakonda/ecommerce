package mycommerce.Controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mycommerce.ModelDTO.PaymentRequestDTO;
import mycommerce.ModelDTO.PaymentResponseDTO;
import mycommerce.Service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Spec-compliant mock payment endpoint. Always returns a SUCCESS response.
 * This does NOT integrate a real payment gateway.
 */
@RestController
@RequestMapping("/ecom/payments")
@Tag(name = "Payments (Mock)", description = "Mock payment processing — always succeeds")
public class MockPaymentController {

    private final PaymentService paymentService;

    public MockPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/process")
    @Operation(summary = "Process a mock payment", description = "Always returns status SUCCESS")
    public ResponseEntity<PaymentResponseDTO> process(@RequestBody(required = false) PaymentRequestDTO request) {
        // If an orderId/userId is supplied, persist a real mock Payment record so
        // the order lifecycle advances; otherwise just return a synthetic success.
        String paymentId;
        if (request != null && request.getOrderId() != null && request.getUserId() != null) {
            var payment = paymentService.makePayment(request.getOrderId(), request.getUserId());
            paymentId = String.valueOf(payment.getPaymentId());
        } else {
            paymentId = UUID.randomUUID().toString();
        }
        return ResponseEntity.ok(new PaymentResponseDTO(paymentId, "SUCCESS"));
    }
}
