package mycommerce.Service;

import mycommerce.ModelDTO.CheckoutResponseDTO;

public interface CheckoutService {

    /**
     * Executes checkout: runs the mock payment (always succeeds) and creates the
     * order only after payment success, then returns a confirmation. The whole
     * operation is transactional so no order exists without a successful payment.
     *
     * @param userId        the customer
     * @param paymentMethod the chosen method (any value accepted; mock always succeeds)
     */
    CheckoutResponseDTO checkout(Integer userId, String paymentMethod);
}
