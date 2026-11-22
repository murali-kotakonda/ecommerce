package mycommerce.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import mycommerce.Model.Category;
import mycommerce.Response.ApiResponse;
import mycommerce.Service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ecom/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> create(@Valid @RequestBody Category category) {
        Category created = categoryService.createCategory(category);
        return new ResponseEntity<>(ApiResponse.ok("Category created", created), HttpStatus.CREATED);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Category>> update(@PathVariable Integer categoryId,
            @RequestBody Category category) {
        return ResponseEntity.ok(ApiResponse.ok("Category updated",
                categoryService.updateCategory(categoryId, category)));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.listCategories()));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Category>> get(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getCategory(categoryId)));
    }

    /** Enable / disable a category. */
    @PatchMapping("/{categoryId}/status")
    public ResponseEntity<ApiResponse<Category>> setStatus(@PathVariable Integer categoryId,
            @RequestParam boolean active) {
        return ResponseEntity.ok(ApiResponse.ok(
                active ? "Category enabled" : "Category disabled",
                categoryService.setActive(categoryId, active)));
    }

    /** Upload or replace the category image (multipart form field "file"). */
    @PostMapping(value = "/{categoryId}/image", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Category>> uploadImage(@PathVariable Integer categoryId,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok("Image uploaded",
                categoryService.uploadImage(categoryId, file)));
    }

    /** Delete the category image. */
    @DeleteMapping("/{categoryId}/image")
    public ResponseEntity<ApiResponse<Category>> deleteImage(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(ApiResponse.ok("Image deleted",
                categoryService.deleteImage(categoryId)));
    }
}
