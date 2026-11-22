package mycommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mycommerce.Model.Shipper;

@Repository
public interface ShipperRepository extends JpaRepository<Shipper, Integer> {

}
