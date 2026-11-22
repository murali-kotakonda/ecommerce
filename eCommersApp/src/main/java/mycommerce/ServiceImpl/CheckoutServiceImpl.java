package mycommerce.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mycommerce.Enum.PaymentMethod;
import mycommerce.Exception.OrdersException;
import mycommerce.Model.Orders;
import mycommerce.Model.Payment;
import mycommerce.ModelDTO.CheckoutResponseDTO;
import mycommerce.ModelDTO.OrdersDTO;
import mycommerce.Service.CheckoutService;
import mycommerce.Service.OrdersService;
import mycommerce.Service.PaymentService;

/**
 * Orchestrates the checkout: mock payment first, then order creation, in a
 * single transaction. If anything fails the whole thing rolls back, so an
 * order never exists without a successful payment.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final OrdersService ordersService;
    private final PaymentService paymentService;

    @Override
    @Transactional
    public CheckoutResponseDTO checkout(Integer userId, String paymentMethod) {
        log.info("Checkout started for user id={}, method={}", userId, paymentMethod);

        // 1. Create the order from the cart (validates cart + stock, reduces inventory).
        OrdersDTO placed = ordersService.placeOrder(userId);
        Integer orderId = placed.getOrderId();

        // 2. Run the mock payment (always succeeds). If it threw, the @Transactional
        //    boundary rolls back the order created above.
        PaymentMethod method = parseMethod(paymentMethod);
        Payment payment;
        try {
            payment = paymentService.makePayment(orderId, userId, method);
        } catch (RuntimeException ex) {
            log.error("Payment failed for order id={}; rolling back order", orderId, ex);
            throw new OrdersException("Payment failed: " + ex.getMessage());
        }

        // 3. Load the confirmed order and assemble the confirmation payload.
        Orders order = ordersService.getOrdersDetails(orderId);

        List<CheckoutResponseDTO.Item> items = order.getOrderItem().stream()
                .map(oi -> CheckoutResponseDTO.Item.builder()
                        .productId(oi.getProduct().getProductId())
                        .name(oi.getProduct().getName())
                        .imageUrl(oi.getProduct().getImageUrl())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getUnitPrice())
                        .lineTotal(oi.getLineTotal())
                        .build())
                .collect(Collectors.toList());

        log.info("Checkout complete: order id={}, payment id={}, status={}",
                orderId, payment.getPaymentId(), payment.getPaymentStatus());

        return CheckoutResponseDTO.builder()
                .success(true)
                .orderId(order.getOrderId())
                .orderStatus(order.getStatus().name())
                .orderDate(order.getOrderDate().toString())
                .subTotal(order.getSubTotal())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .paymentId("MOCK_PAYMENT_" + payment.getPaymentId())
                .paymentStatus("SUCCESS")
                .paymentMethod(payment.getPaymentMethod().name())
                .items(items)
                .build();
    }

    private PaymentMethod parseMethod(String method) {
        if (method == null) {
            return PaymentMethod.UPI;
        }
        try {
            return PaymentMethod.valueOf(method.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            // Any UI value (card/cod/wallet/etc.) maps to a generic method for the mock.
            log.debug("Unknown payment method '{}', defaulting to UPI", method);
            return PaymentMethod.UPI;
        }
    }
}
