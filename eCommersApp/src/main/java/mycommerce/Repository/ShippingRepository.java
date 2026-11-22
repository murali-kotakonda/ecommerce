package mycommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mycommerce.Model.ShippingDetails;

public interface ShippingRepository extends JpaRepository<ShippingDetails, Integer> {

}
