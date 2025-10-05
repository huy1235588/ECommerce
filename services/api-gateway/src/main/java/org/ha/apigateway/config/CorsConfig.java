package org.ha.apigateway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final Environment env;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        String[] originsArray = env.getProperty("app.cors.allowedOrigins", String[].class, new String[0]);

        List<String> origins = Arrays.stream(originsArray)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (origins.isEmpty()) {
            // default: allow any origin when none configured
            config.setAllowedOriginPatterns(List.of("*"));
        } else {
            if (origins.size() == 1 && "*".equals(origins.getFirst())) {
                config.setAllowedOriginPatterns(List.of("*"));
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
