package org.ha.gameservice.security;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Arrays;

@Component
public class UserContext {

    public String getCurrentUserId() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            return request.getHeader("X-USER-ID");
        }
        return null;
    }

    public List<String> getCurrentUserRoles() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            String rolesHeader = request.getHeader("X-USER-ROLES");
            if (rolesHeader != null && !rolesHeader.trim().isEmpty()) {
                return Arrays.asList(rolesHeader.split(","));
            }
        }
        return List.of();
    }

    public boolean hasRole(String role) {
        List<String> roles = getCurrentUserRoles();
        return roles.contains(role) || roles.contains("ROLE_" + role);
    }

    public boolean isAuthenticated() {
        return getCurrentUserId() != null;
    }

    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            return attrs.getRequest();
        } catch (Exception e) {
            return null;
        }
    }
}