package mycommerce.ServiceImpl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import mycommerce.Exception.CategoryException;
import mycommerce.Model.Category;
import mycommerce.Repository.CategoryRepository;
import mycommerce.Service.CategoryService;
import mycommerce.Service.FileStorageService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);

    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Override
    public Category createCategory(Category category) {
        if (category.getName() == null || category.getName().isBlank()) {
            throw new CategoryException("Category name is mandatory");
        }
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new CategoryException("Category already exists: " + category.getName());
        }
        log.info("Creating category: {}", category.getName());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Integer categoryId, Category category) {
        Category existing = getCategory(categoryId);
        if (category.getName() != null && !category.getName().isBlank()) {
            existing.setName(category.getName());
        }
        if (category.getDescription() != null) {
            existing.setDescription(category.getDescription());
        }
        if (category.getActive() != null) {
            existing.setActive(category.getActive());
        }
        log.info("Updating category id={}", categoryId);
        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Integer categoryId) {
        Category existing = getCategory(categoryId);
        if (existing.getImageUrl() != null && !existing.getImageUrl().isBlank()) {
            fileStorageService.delete(existing.getImageUrl());
        }
        log.info("Deleting category id={}", categoryId);
        categoryRepository.delete(existing);
    }

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategory(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryException("Category not found with id: " + categoryId));
    }

    @Override
    public Category setActive(Integer categoryId, boolean active) {
        Category existing = getCategory(categoryId);
        existing.setActive(active);
        log.info("Setting category id={} active={}", categoryId, active);
        return categoryRepository.save(existing);
    }

    @Override
    public Category uploadImage(Integer categoryId, MultipartFile file) {
        Category existing = getCategory(categoryId);
        // Replace: remove the previous image file if present.
        if (existing.getImageUrl() != null && !existing.getImageUrl().isBlank()) {
            fileStorageService.delete(existing.getImageUrl());
        }
        String url = fileStorageService.store(file);
        existing.setImageUrl(url);
        log.info("Uploaded image for category id={} -> {}", categoryId, url);
        return categoryRepository.save(existing);
    }

    @Override
    public Category deleteImage(Integer categoryId) {
        Category existing = getCategory(categoryId);
        if (existing.getImageUrl() != null && !existing.getImageUrl().isBlank()) {
            fileStorageService.delete(existing.getImageUrl());
        }
        existing.setImageUrl(null);
        log.info("Deleted image for category id={}", categoryId);
        return categoryRepository.save(existing);
    }
}
