package mycommerce.SecurityConfig;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;

@Configuration
public class AppConfig {

    /**
     * TEMPORARY DEV SWITCH. When false, all endpoints are open (no JWT / role
     * checks) to simplify UI work. Set app.security.enabled=true (or env
     * SECURITY_ENABLED=true) to restore full authentication/authorization.
     * DO NOT deploy with this disabled.
     */
    @Value("${app.security.enabled:true}")
    private boolean securityEnabled;

    @Bean
    public SecurityFilterChain springSecurityConfiguration(HttpSecurity http) throws Exception {

        if (!securityEnabled) {
            // --- Auth disabled: permit everything, no JWT validator filter ---
            http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .cors(cors -> cors.configurationSource(devCorsSource()))
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                    .csrf(csrf -> csrf.disable())
                    // Keep the generator so /ecom/signIn still issues a token for the UI.
                    .addFilterAfter(new JwtTokenGeneratorFilter(), BasicAuthenticationFilter.class)
                    .httpBasic(Customizer.withDefaults());
            return http.build();
        }

        http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .cors(cors -> {
                    cors.configurationSource(new CorsConfigurationSource() {
                        @Override
                        public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                            CorsConfiguration cfg = new CorsConfiguration();

                            // Allow the known frontend origins (not overwritten repeatedly).
                            cfg.setAllowedOriginPatterns(Arrays.asList(
                                    "http://localhost:3000",
                                    "http://127.0.0.1:3000",
                                    "https://eccomers96.netlify.app"));
                            cfg.setAllowedMethods(Collections.singletonList("*"));
                            cfg.setAllowCredentials(true);
                            cfg.setAllowedHeaders(Collections.singletonList("*"));
                            cfg.setExposedHeaders(Arrays.asList("Authorization"));

                            return cfg;

                        }
                    });
                })
                .authorizeHttpRequests(auth -> {
                    auth
                            // Public: registration, sign-in, public product/category/review reads
                            .requestMatchers(HttpMethod.POST, "/ecom/customers").permitAll()
                            .requestMatchers(HttpMethod.GET, "/ecom/signIn",
                                    "/ecom/product-reviews/**", "/ecom/products/**",
                                    "/ecom/categories/**", "/ecom/uploads/**").permitAll()
                            // Mock payment + checkout require an authenticated user
                            .requestMatchers(HttpMethod.POST, "/ecom/payments/process").hasAnyRole("ADMIN", "USER")
                            .requestMatchers(HttpMethod.POST, "/ecom/checkout/**").hasAnyRole("ADMIN", "USER")

                            // Admin creation is NO LONGER public — must be an existing ADMIN.
                            // (Bootstrap the first admin via a DB seed / data.sql in non-prod.)
                            .requestMatchers(HttpMethod.POST, "/ecom/admin").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/ecom/admin/dashboard").hasRole("ADMIN")

                            // Product write operations are ADMIN-only (fixed path: /ecom/products/**)
                            .requestMatchers(HttpMethod.POST, "/ecom/products/**",
                                    "/ecom/order-shippers/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/ecom/products/**",
                                    "/ecom/admin/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/ecom/products/**",
                                    "/ecom/product-reviews/**",
                                    "/ecom/customer-addresses/delete/**",
                                    "/ecom/order-shipping/**",
                                    "/ecom/order-shippers/**",
                                    "/ecom/categories/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/ecom/categories/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/ecom/categories/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.PATCH, "/ecom/categories/**").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/ecom/upload/**").hasRole("ADMIN")

                            // USER (customer) operations
                            .requestMatchers(HttpMethod.POST,
                                    "/ecom/product-reviews/**",
                                    "/ecom/customer-addresses/**",
                                    "/ecom/cart/**",
                                    "/ecom/orders/**",
                                    "/ecom/order-shipping/**",
                                    "/ecom/wishlist/**").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT,
                                    "/ecom/product-reviews/**",
                                    "/ecom/customer-addresses/update/**",
                                    "/ecom/cart/**",
                                    "/ecom/order-shipping/**").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE,
                                    "/ecom/cart/remove-product/**",
                                    "/ecom/cart/empty-Cart/**",
                                    // Order deletion/cancel is now authenticated (was public).
                                    "/ecom/orders/users/**",
                                    "/ecom/wishlist/**").hasAnyRole("USER", "ADMIN")

                            // Shared reads for authenticated customers/admins
                            .requestMatchers(HttpMethod.GET,
                                    "/ecom/customer-addresses/**",
                                    "/ecom/cart/products/**",
                                    "/ecom/orders/**",
                                    "/ecom/order-shippers",
                                    "/ecom/order-payments/**",
                                    "/ecom/wishlist/**").hasAnyRole("ADMIN", "USER")

                            .requestMatchers("/swagger-ui*/**", "/swagger-ui.html",
                                    "/v3/api-docs/**").permitAll()
                            .anyRequest().authenticated();
                })
                .csrf(csrf -> csrf.disable())
                .addFilterAfter(new JwtTokenGeneratorFilter(), BasicAuthenticationFilter.class)
                .addFilterBefore(new JwtTokenValidatorFilter(), BasicAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults());

        return http.build();

    }

    /** CORS config reused by the auth-disabled dev chain. */
    private CorsConfigurationSource devCorsSource() {
        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowedOriginPatterns(Arrays.asList(
                    "http://localhost:3000", "http://127.0.0.1:3000",
                    "https://eccomers96.netlify.app"));
            cfg.setAllowedMethods(Collections.singletonList("*"));
            cfg.setAllowCredentials(true);
            cfg.setAllowedHeaders(Collections.singletonList("*"));
            cfg.setExposedHeaders(Arrays.asList("Authorization"));
            return cfg;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();

    }


}

