package mycommerce.ModelDTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Rich order-confirmation payload returned after a successful checkout
 * (mock payment succeeded and the order was created).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponseDTO {

    private boolean success;
    private Integer orderId;
    private String orderStatus;
    private String orderDate;
    private Double subTotal;
    private Double taxAmount;
    private Double totalAmount;

    private String paymentId;
    private String paymentStatus;
    private String paymentMethod;

    private List<Item> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private Integer productId;
        private String name;
        private String imageUrl;
        private Integer quantity;
        private Double unitPrice;
        private Double lineTotal;
    }
}
