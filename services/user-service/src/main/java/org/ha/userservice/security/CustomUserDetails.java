package org.ha.userservice.security;

import org.ha.userservice.model.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record CustomUserDetails(User user) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user.getRole() == null ? "USER" : user.getRole();
        // Normalize and prefix with ROLE_ to fit Spring Security conventions
        String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
        return List.of(new SimpleGrantedAuthority(authority));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        // No expiration implemented in entity; treat as non-expired
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // If status equals 'locked' then locked
        return !"locked".equalsIgnoreCase(user.getStatus());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Enabled when status is 'active'
        return "active".equalsIgnoreCase(user.getStatus());
    }
}
