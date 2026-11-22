package mycommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mycommerce.Model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
	
}
