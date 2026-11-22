package mycommerce.Repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mycommerce.Model.Product;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
	
	@Query("SELECT p FROM Product p  WHERE p.name like %:prduct%")
	public List<Product> findByName(@Param("prduct") String name);
	
	@Query("SELECT p FROM Product p  WHERE p.category like %:cat%")
	public List<Product> getProductCategoryName(@Param("cat") String category);

    List<Product> findAllByNameContainingIgnoreCase(String keyword, Sort sort);

    List<Product> findByCategoryIgnoreCaseAndProductIdNot(String category, Integer productId);

    @Query("SELECT p FROM Product p WHERE "
            + "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND "
            + "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND "
            + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
            + "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    org.springframework.data.domain.Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            org.springframework.data.domain.Pageable pageable);

    // ---- Inventory aggregates for the admin dashboard ----
    @Query("SELECT COALESCE(SUM(p.stockQuantity), 0) FROM Product p")
    Long getTotalStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity > 0 AND p.stockQuantity < :threshold")
    long countLowStock(@Param("threshold") int threshold);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity IS NULL OR p.stockQuantity <= 0")
    long countOutOfStock();

//	@Query(value = "SELECT p FROM Product p JOIN Category c ON p.category_id = c.category_id WHERE c.name = :cat", nativeQuery = true)
//	public List<Product> getProductCategoryName(@Param("cat") String category);

	

}
