package mycommerce.SecurityConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

/**
 * Populates {@link SecurityConstants} from externalized configuration so the
 * JWT signing key and expiration are never hardcoded in source for production.
 */
@Configuration
public class JwtConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @PostConstruct
    public void init() {
        SecurityConstants.JWT_KEY = jwtSecret;
        SecurityConstants.JWT_EXPIRATION_MS = jwtExpirationMs;
    }
}
