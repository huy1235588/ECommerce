package org.ha.apigateway.config;

import org.ha.apigateway.exception.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import reactor.core.publisher.Mono;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(auth -> auth
                        .pathMatchers("/actuator/**").permitAll()
                        .pathMatchers("/api/auth/**").permitAll()
                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt
                        .jwtAuthenticationConverter(grantedAuthoritiesExtractor())
                        .jwtDecoder(customJwtDecoder())))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler()))
                .build();
    }

    @Bean
    public ReactiveJwtDecoder customJwtDecoder() {
        SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256");
        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        // Wrap decoder to throw custom exceptions
        return token -> decoder.decode(token)
                .onErrorMap(JwtException.class, ex -> {
                    String message = ex.getMessage();
                    if (message != null) {
                        if (message.contains("expired")) {
                            return new TokenExpiredException();
                        } else if (message.contains("invalid") || message.contains("malformed")) {
                            return new InvalidTokenException();
                        }
                    }
                    return new InvalidTokenException();
                });
    }

    @Bean
    public ServerAuthenticationEntryPoint authenticationEntryPoint() {
        return (exchange, ex) -> {
            AuthenticationException authEx;

            String message = ex.getMessage();
            if (message != null) {
                if (message.contains("No JWT") || message.contains("Missing") || message.contains("required") 
                        || message.contains("Not Authenticated")) {
                    authEx = new MissingTokenException();
                } else if (message.contains("expired") || message.contains("Expired")) {
                    authEx = new TokenExpiredException();
                } else if (message.contains("invalid") || message.contains("Invalid") ||
                          message.contains("malformed") || message.contains("Malformed")) {
                    authEx = new InvalidTokenException();
                } else {
                    authEx = new AuthErrorException("Authentication failed: " + message);
                }
            } else {
                authEx = new MissingTokenException();
            }

            // Re-throw as GlobalExceptionHandler will catch it
            return Mono.error(authEx);
        };
    }

    @Bean
    public ServerAccessDeniedHandler accessDeniedHandler() {
        return (exchange, ex) -> Mono.error(new AuthErrorException("Access denied"));
    }

    // Extract roles từ JWT claims
    private ReactiveJwtAuthenticationConverterAdapter grantedAuthoritiesExtractor() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Object rolesClaim = jwt.getClaims().get("roles");
            
            if (rolesClaim instanceof List) {
                return ((List<?>) rolesClaim).stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toString()))
                        .collect(Collectors.toList());
            } else if (rolesClaim instanceof String) {
                return List.of(new SimpleGrantedAuthority("ROLE_" + rolesClaim));
            }
            
            return List.of();
        });
        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }
}