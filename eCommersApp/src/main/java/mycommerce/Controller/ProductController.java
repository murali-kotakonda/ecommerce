package mycommerce.Controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mycommerce.Model.Product;
import mycommerce.ModelDTO.ProductDTO;
import mycommerce.Service.ProductService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ecom/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        Product newProduct = productService.addProduct(product);
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<Product> updateProduct( @PathVariable Integer productId, @Valid @RequestBody ProductDTO updatedProduct) {
        Product updatedProductResult = productService.updateProduct(productId, updatedProduct);
        return new ResponseEntity<>(updatedProductResult, HttpStatus.OK);
    }

    @GetMapping("/product-By-name/{name}")
    public ResponseEntity<List<Product>> getProductByName(@PathVariable String name) {
        List<Product> products = productService.getProductByName(name);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> search(
       @RequestParam (required = false)  String keyword,
       @RequestParam(required = false,defaultValue = "asc") String sort,
       @RequestParam(required = false,defaultValue = "price") String sortBy

    ) {
        List<Product> products = productService.getAllProduct(keyword, sort, sortBy);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }



    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductByCategory(category);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    /** Paginated, filterable, sortable search. */
    @GetMapping("/page")
    public ResponseEntity<org.springframework.data.domain.Page<Product>> searchPaged(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort,
            @RequestParam(defaultValue = "productId") String sortBy) {
        return ResponseEntity.ok(productService.getProductsPaged(
                keyword, category, minPrice, maxPrice, page, size, sort, sortBy));
    }

    /** Related products in the same category. */
    @GetMapping("/{productId}/related")
    public ResponseEntity<List<Product>> relatedProducts(@PathVariable Integer productId,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productService.getRelatedProducts(productId, limit));
    }


    @GetMapping("/{productId}")
    public ResponseEntity<Product> getSingleProduct(@PathVariable Integer productId) {
        Product singleProsuct = productService.getSingleProduct(productId);
        return new ResponseEntity<>(singleProsuct, HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeProduct(@PathVariable Integer productId) {
        productService.removeProduct(productId);
        return new ResponseEntity<>("Product removed successfully.", HttpStatus.OK);
    }
}
