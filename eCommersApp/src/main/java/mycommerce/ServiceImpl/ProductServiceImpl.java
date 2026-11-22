package mycommerce.ServiceImpl;

import java.util.List;
import java.util.Optional;

import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import mycommerce.Exception.ProductException;
import mycommerce.Model.Product;
import mycommerce.ModelDTO.ProductDTO;
import mycommerce.Repository.ProductRepository;
import mycommerce.Service.ProductService;


@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Product addProduct(Product product) throws ProductException {
        if (product == null)
            throw new ProductException("Product Can not be Null");
        Product saved = productRepository.save(product);
        log.info("Product added id={}, name={}", saved.getProductId(), saved.getName());
        return saved;
    }

    @Override
    public Product updateProduct(Integer productId, ProductDTO updatedProduct) throws ProductException {

        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) {
            throw new ProductException("Product with ID " + productId + " not found.");
        }
        Product existingProduct = product.get();

        // Partial update: only overwrite fields that were supplied.
        if (updatedProduct.getName() != null) existingProduct.setName(updatedProduct.getName());
        if (updatedProduct.getCategory() != null) existingProduct.setCategory(updatedProduct.getCategory());
        if (updatedProduct.getPrice() != null) existingProduct.setPrice(updatedProduct.getPrice());
        if (updatedProduct.getImageUrl() != null) existingProduct.setImageUrl(updatedProduct.getImageUrl());
        if (updatedProduct.getDescription() != null) existingProduct.setDescription(updatedProduct.getDescription());
        if (updatedProduct.getDiscountPrice() != null) existingProduct.setDiscountPrice(updatedProduct.getDiscountPrice());
        if (updatedProduct.getStockQuantity() != null) {
            existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
            // Restock re-activates the product; zero stock marks it unavailable.
            boolean inStock = updatedProduct.getStockQuantity() > 0;
            existingProduct.setAvailable(inStock);
            existingProduct.setActive(inStock);
        }
        log.info("Updated product id={} (stock={})", productId, existingProduct.getStockQuantity());
        productRepository.save(existingProduct);
        return existingProduct;
    }

    @Override
    public List<Product> getProductByName(String name) throws ProductException {

        List<Product> existProductByName = productRepository.findByName(name);
        if (existProductByName.isEmpty()) {
            throw new ProductException("Product Not found with name " + name);
        }
        return existProductByName;
    }

    @Override
    public List<Product> getAllProduct(String keyword, String sortDirection, String sortBy) throws ProductException {

        Sort sort = Sort.by(sortDirection.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,sortBy);

        List<Product> products;

        if (keyword != null) {

            products = productRepository.findAllByNameContainingIgnoreCase(keyword, sort);
        } else {
            products = productRepository.findAll(sort);
        }
        if (products.isEmpty()) {
            throw new ProductException("Product List Empty");
        }

        return products;

    }

    @Override
    public List<Product> getProductByCategory(String category) throws ProductException {
        // Retrieve products by category from the database
        List<Product> allproductCategoryName = productRepository.getProductCategoryName(category);
        if (allproductCategoryName.isEmpty())
            throw new ProductException("Product with category Name " + category + " not found.");

        return allproductCategoryName;
    }


    @Override
    public void removeProduct(Integer productId) throws ProductException {

        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product with ID " + productId + " not found."));

        productRepository.delete(existingProduct);
    }

    @Override
    public Product getSingleProduct(Integer productId) {

        Product single = productRepository.findById(productId).orElseThrow(() -> new ProductException("Product not found"));
        return single;
    }

    @Override
    public Page<Product> getProductsPaged(String keyword, String category, Double minPrice, Double maxPrice,
            int page, int size, String sortDirection, String sortBy) {
        Sort.Direction dir = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String safeSortBy = (sortBy == null || sortBy.isBlank()) ? "productId" : sortBy;
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 10 : size, Sort.by(dir, safeSortBy));
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword;
        String cat = (category == null || category.isBlank()) ? null : category;
        return productRepository.searchProducts(kw, cat, minPrice, maxPrice, pageable);
    }

    @Override
    public List<Product> getRelatedProducts(Integer productId, int limit) {
        Product product = getSingleProduct(productId);
        return productRepository
                .findByCategoryIgnoreCaseAndProductIdNot(product.getCategory(), productId)
                .stream()
                .limit(limit <= 0 ? 4 : limit)
                .collect(Collectors.toList());
    }
}
