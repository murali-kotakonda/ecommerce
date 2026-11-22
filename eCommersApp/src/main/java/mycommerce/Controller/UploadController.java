package mycommerce.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import mycommerce.Response.ApiResponse;
import mycommerce.Service.FileStorageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Generic image upload endpoint. Stores the file and returns its public URL so
 * the UI can upload a file instead of pasting an image URL (used by Add/Update
 * Product and anywhere a hosted image URL is needed).
 */
@RestController
@RequestMapping("/ecom/upload")
@RequiredArgsConstructor
@Tag(name = "Uploads", description = "Generic image upload — returns a hosted URL")
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/image", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestPart("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ResponseEntity.ok(ApiResponse.ok("Image uploaded", Map.of("url", url)));
    }
}
