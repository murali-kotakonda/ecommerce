package mycommerce.ServiceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import mycommerce.Exception.CategoryException;
import mycommerce.Service.FileStorageService;
import jakarta.annotation.PostConstruct;

/**
 * Stores uploaded images on the local filesystem and exposes them under the
 * public path {@code /ecom/uploads/**} (see WebConfig resource handler).
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    /** Public URL prefix that WebConfig maps back to the upload directory. */
    public static final String PUBLIC_PREFIX = "/ecom/uploads/";

    private static final Set<String> ALLOWED = Set.of("jpg", "jpeg", "png", "gif", "webp", "avif", "svg");
    private static final long MAX_BYTES = 5 * 1024 * 1024; // 5 MB

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path root;

    @PostConstruct
    public void init() {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(root);
            log.info("Upload directory ready at {}", root);
        } catch (IOException e) {
            throw new CategoryException("Could not initialize upload directory: " + e.getMessage());
        }
    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new CategoryException("Uploaded file is empty");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new CategoryException("File too large. Maximum allowed is 5 MB");
        }
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String ext = StringUtils.getFilenameExtension(original);
        if (ext == null || !ALLOWED.contains(ext.toLowerCase(Locale.ROOT))) {
            throw new CategoryException("Unsupported image type. Allowed: " + ALLOWED);
        }
        String filename = UUID.randomUUID().toString().replace("-", "") + "." + ext.toLowerCase(Locale.ROOT);
        try {
            Path target = root.resolve(filename).normalize();
            // Prevent path traversal outside the upload root.
            if (!target.getParent().equals(root)) {
                throw new CategoryException("Invalid file path");
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored upload {} ({} bytes)", filename, file.getSize());
            return PUBLIC_PREFIX + filename;
        } catch (IOException e) {
            throw new CategoryException("Failed to store file: " + e.getMessage());
        }
    }

    @Override
    public void delete(String publicUrlOrName) {
        if (publicUrlOrName == null || publicUrlOrName.isBlank()) {
            return;
        }
        String name = publicUrlOrName.startsWith(PUBLIC_PREFIX)
                ? publicUrlOrName.substring(PUBLIC_PREFIX.length())
                : publicUrlOrName;
        name = StringUtils.cleanPath(name);
        if (name.contains("/") || name.contains("\\") || name.contains("..")) {
            return; // ignore anything that isn't a plain filename in our dir
        }
        try {
            Path target = root.resolve(name).normalize();
            if (target.getParent().equals(root)) {
                Files.deleteIfExists(target);
                log.info("Deleted upload {}", name);
            }
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", name, e.getMessage());
        }
    }
}
