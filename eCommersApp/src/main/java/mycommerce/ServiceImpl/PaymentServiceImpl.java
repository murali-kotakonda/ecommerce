package mycommerce.ServiceImpl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import mycommerce.Enum.OrderStatus;
import mycommerce.Enum.PaymentMethod;
import mycommerce.Enum.PaymentStatus;
import mycommerce.Exception.PaymentException;
import mycommerce.Exception.UserException;
import mycommerce.Model.Orders;
import mycommerce.Model.Payment;
import mycommerce.Model.User;
import mycommerce.Repository.OrderRepository;
import mycommerce.Repository.PaymentRepository;
import mycommerce.Repository.UserRepository;
import mycommerce.Service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public Payment makePayment(Integer orderId, Integer userId) throws PaymentException {
        return makePayment(orderId, userId, PaymentMethod.UPI);
    }

    @Override
    @Transactional
    public Payment makePayment(Integer orderId, Integer userId, PaymentMethod method) throws PaymentException {
        log.info("Processing mock payment for order id={}, user id={}, method={}", orderId, userId, method);

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found in the database."));

        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new PaymentException("Order not found for the given customer."));

        Payment payment = new Payment();
        payment.setPaymentAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(method != null ? method : PaymentMethod.UPI);
        // Mock gateway: always succeeds.
        payment.setPaymentStatus(PaymentStatus.SUCCESSFUL);
        payment.setUser(existingUser);

        payment.setOrder(order);
        paymentRepository.save(payment);

        // Successful payment CONFIRMS the order; shipping is a later lifecycle step.
        order.setStatus(OrderStatus.CONFIRMED);

        // Set the payment for the order
        order.setPayment(payment);
        // Save the changes to the Order entity, including the associated Payment
        orderRepository.save(order);

        existingUser.getPayments().add(payment);
        userRepository.save(existingUser);
        log.info("Mock payment id={} SUCCESSFUL for order id={}; order status -> CONFIRMED",
                payment.getPaymentId(), orderId);
        return payment;
    }
}
