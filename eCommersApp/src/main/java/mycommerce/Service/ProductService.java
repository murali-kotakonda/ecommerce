package mycommerce.Service;

import java.util.List;

import org.springframework.data.domain.Page;

import mycommerce.Exception.ProductException;
import mycommerce.Model.Product;
import mycommerce.ModelDTO.ProductDTO;

public interface ProductService {
	
	public Product addProduct(Product products)throws ProductException;
	
	public Product updateProduct(Integer productId,ProductDTO product)throws ProductException;
	
	public List<Product> getProductByName(String name)throws ProductException;
	
	public List<Product> getAllProduct(String keyword, String sortDirection, String sortBy)throws ProductException;
	
	public List<Product> getProductByCategory(String catagory) throws ProductException;
	
	public void removeProduct(Integer productId)throws ProductException;

	public Product getSingleProduct(Integer productId);

	/** Paginated + filtered + sorted product search. */
	public Page<Product> getProductsPaged(String keyword, String category,
			Double minPrice, Double maxPrice, int page, int size, String sortDirection, String sortBy);

	/** Products in the same category, excluding the given product. */
	public List<Product> getRelatedProducts(Integer productId, int limit);
}
 