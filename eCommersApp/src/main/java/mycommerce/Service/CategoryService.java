package mycommerce.Service;

import java.util.List;

import mycommerce.Model.Category;

public interface CategoryService {

    Category createCategory(Category category);

    Category updateCategory(Integer categoryId, Category category);

    void deleteCategory(Integer categoryId);

    List<Category> listCategories();

    Category getCategory(Integer categoryId);

    /** Toggles the active flag and returns the updated category. */
    Category setActive(Integer categoryId, boolean active);

    /** Stores the uploaded image, replaces any existing one, and persists the URL. */
    Category uploadImage(Integer categoryId, org.springframework.web.multipart.MultipartFile file);

    /** Removes the category image file and clears the stored URL. */
    Category deleteImage(Integer categoryId);
}
