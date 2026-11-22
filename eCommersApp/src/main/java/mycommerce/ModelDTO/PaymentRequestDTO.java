package mycommerce.ModelDTO;

import lombok.Data;

/** Optional request body for POST /ecom/payments/process. */
@Data
public class PaymentRequestDTO {
    private Integer orderId;
    private Integer userId;
    private Double amount;
    private String method;
}
