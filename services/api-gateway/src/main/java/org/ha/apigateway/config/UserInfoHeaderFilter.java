package org.ha.apigateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserInfoHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    if (authentication instanceof JwtAuthenticationToken) {
                        Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
                        String userId = jwt.getClaims().get("userId").toString();
                        Object rolesClaim = jwt.getClaims().get("roles");

                        String roles = "";
                        if (rolesClaim instanceof List) {
                            roles = ((List<?>) rolesClaim).stream()
                                    .map(Object::toString)
                                    .collect(Collectors.joining(","));
                        } else if (rolesClaim instanceof String) {
                            roles = (String) rolesClaim;
                        }

                        // Mutate the request to add headers
                        ServerWebExchange mutatedExchange = exchange.mutate()
                                .request(exchange.getRequest().mutate()
                                        .header("X-USER-ID", userId)
                                        .header("X-USER-ROLES", roles)
                                        .build())
                                .build();

                        return chain.filter(mutatedExchange);
                    } else {
                        // If not authenticated, proceed without headers
                        return chain.filter(exchange);
                    }
                })
                .switchIfEmpty(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE; // Run after other filters
    }
}