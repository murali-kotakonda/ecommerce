package mycommerce.SecurityConfig;

/**
 * Holder for security-related constants. The JWT signing key and token
 * expiration are populated at startup from externalized configuration
 * (see {@link JwtConfig}) rather than being hardcoded in source.
 */
public final class SecurityConstants {

    private SecurityConstants() {
    }

    public static final String JWT_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";

    /** Populated at startup from {@code app.jwt.secret}. */
    public static volatile String JWT_KEY = "secretsfhsfjhdkjngdfjkgfgjdlkfjsdkfjsd-change-me-in-prod";

    /** Populated at startup from {@code app.jwt.expiration-ms}. */
    public static volatile long JWT_EXPIRATION_MS = 30000000L;
}
