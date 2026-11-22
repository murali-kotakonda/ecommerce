package mycommerce.Service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /** Stores the uploaded file and returns the public relative URL (e.g. /ecom/uploads/{file}). */
    String store(MultipartFile file);

    /** Deletes a previously stored file given its public URL or filename. No-op if missing. */
    void delete(String publicUrlOrName);
}
