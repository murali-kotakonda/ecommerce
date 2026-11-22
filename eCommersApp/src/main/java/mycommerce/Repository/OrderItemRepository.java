package mycommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mycommerce.Model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

}
