package mycommerce.Repository;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mycommerce.Enum.OrderStatus;
import mycommerce.Model.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {

	@Query("SELECT o FROM Orders o WHERE o.orderId = :orderId AND o.user.userId = :userId")
	Orders findByIdAndCustomerId(@Param("orderId") Integer orderId, @Param("userId") Integer userId);

	@Query("SELECT o FROM Orders o WHERE o.orderDate >= :date")
	List<Orders> findByOrderDateGreaterThanEqual(Date date);

	@Query("SELECT o FROM Orders o WHERE  o.user.userId = :userId")
	List<Orders> getAllOrderByUserId(@Param("userId") Integer userId);

	@Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Orders o WHERE o.status NOT IN :excluded")
	Double getTotalSalesExcluding(@Param("excluded") Collection<OrderStatus> excluded);

	/** Total sales excluding cancelled orders. */
	default Double getTotalSales() {
		return getTotalSalesExcluding(java.util.List.of(OrderStatus.CANCELLED, OrderStatus.CANCELED));
	}

}
