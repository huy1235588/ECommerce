package org.ha.apigateway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    @Value("${app.cors.allowedOrigins:}")
    private String allowedOrigins;

    @Order(Ordered.HIGHEST_PRECEDENCE)
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        // If not configured (null or blank) -> allow any origin by default
        if (allowedOrigins == null || allowedOrigins.trim().isEmpty()) {
            config.setAllowedOriginPatterns(Collections.singletonList("*"));
        } else {
            // Split, trim and remove empty entries
            List<String> origins = Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            if (origins.isEmpty()) {
                config.setAllowedOriginPatterns(Collections.singletonList("*"));
            } else if (origins.size() == 1 && "*".equals(origins.stream().findFirst().orElse(null))) {
                // Explicit wildcard -> allow any origin
                config.setAllowedOriginPatterns(Collections.singletonList("*"));
            } else {
                config.setAllowedOrigins(origins);
            }
        }

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
