package mycommerce.Service;

import mycommerce.Exception.PaymentException;
import mycommerce.Model.Payment;

import mycommerce.Enum.PaymentMethod;

public interface PaymentService {

	 Payment makePayment(Integer orderId,Integer userId) throws PaymentException;

	 /** Mock payment with a chosen method; always succeeds. */
	 Payment makePayment(Integer orderId, Integer userId, PaymentMethod method) throws PaymentException;
}
