package org.ha.userservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Component
@Getter
public class JwtUtil {

    @Value("${jwt.secret}")  // nên là Base64-encoded secret
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    /**
     * Khởi tạo SecretKey từ chuỗi bí mật, sử dụng chuẩn UTF-8
     *
     * @return SecretKey để ký JWT
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Trích xuất tên người dùng (username) từ JWT
     *
     * @param token JWT
     * @return Tên người dùng
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Trích xuất user ID từ JWT
     *
     * @param token JWT
     * @return User ID
     */
    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    /**
     * Trích xuất roles từ JWT
     *
     * @param token JWT
     * @return Danh sách roles
     */
    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> {
            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof List<?> rawList) {
                return rawList.stream()
                        .filter(Objects::nonNull)
                        .map(Object::toString)
                        .collect(Collectors.toList());
            }
            return Collections.emptyList();
        });
    }

    /**
     * Trích xuất một claim cụ thể từ JWT
     *
     * @param token          JWT
     * @param claimsResolver Hàm để trích xuất claim từ Claims
     * @param <T>            Kiểu dữ liệu của claim
     * @return Giá trị của claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Tạo JWT cho một người dùng cụ thể
     *
     * @param userDetails Thông tin người dùng
     * @return JWT
     */
    public String generateToken(CustomUserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Tạo JWT với các claim bổ sung
     *
     * @param extraClaims Các claim bổ sung
     * @param userDetails Thông tin người dùng
     * @return JWT
     */
    public String generateToken(Map<String, Object> extraClaims, CustomUserDetails userDetails) {
        return buildToken(extraClaims, userDetails, expiration);
    }

    /**
     * Tạo JWT với userId và roles
     *
     * @param username Tên người dùng
     * @param userId   ID người dùng
     * @param roles    Danh sách roles
     * @return JWT
     */
    public String generateToken(String username, String userId, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("roles", roles);
        return buildToken(claims, username, expiration);
    }

    /**
     * Tạo JWT làm token làm mới (refresh token) cho một người dùng cụ thể
     *
     * @param userDetails Thông tin người dùng
     * @return JWT làm token làm mới
     */
    public String generateRefreshToken(CustomUserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }

    /**
     * Tạo refresh token với username
     *
     * @param username Tên người dùng
     * @return Refresh token
     */
    public String generateRefreshToken(String username) {
        return buildToken(new HashMap<>(), username, refreshExpiration);
    }

    /**
     * Tạo refresh token với userId và roles
     *
     * @param username Tên người dùng
     * @param userId   ID người dùng
     * @param roles    Danh sách roles
     * @return Refresh token
     */
    public String generateRefreshToken(String username, String userId, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("roles", roles);
        return buildToken(claims, username, refreshExpiration);
    }

    /**
     * Tạo JWT với các claim và chủ đề (subject) cụ thể
     *
     * @param extraClaims Các claim bổ sung
     * @param userDetails Thông tin người dùng
     * @param expiration  Thời gian hết hạn của token
     * @return JWT
     */
    private String buildToken(
            Map<String, Object> extraClaims,
            CustomUserDetails userDetails,
            long expiration
    ) {
        return buildToken(extraClaims, userDetails.getUsername(), expiration);
    }

    /**
     * Tạo JWT với các claim và subject cụ thể
     *
     * @param extraClaims Các claim bổ sung
     * @param subject     Subject (thường là username)
     * @param expiration  Thời gian hết hạn của token
     * @return JWT
     */
    private String buildToken(
            Map<String, Object> extraClaims,
            String subject,
            long expiration
    ) {
        Date now = new Date(System.currentTimeMillis());
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Xác thực JWT với tên người dùng cụ thể
     *
     * @param token       JWT
     * @param userDetails Thông tin người dùng
     * @return true nếu JWT hợp lệ và khớp với tên người dùng, ngược lại false
     */
    public Boolean isTokenValid(String token, CustomUserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Xác thực JWT với username
     *
     * @param token    JWT
     * @param username Tên người dùng
     * @return true nếu JWT hợp lệ và khớp với tên người dùng, ngược lại false
     */
    public Boolean isTokenValid(String token, String username) {
        final String tokenUsername = extractUsername(token);
        return (tokenUsername.equals(username)) && !isTokenExpired(token);
    }

    /**
     * Kiểm tra xem JWT có hợp lệ hay không (không cần so sánh với user)
     *
     * @param token JWT
     * @return true nếu JWT hợp lệ và chưa hết hạn, ngược lại false
     */
    public Boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Kiểm tra xem JWT đã hết hạn hay chưa
     *
     * @param token JWT
     * @return true nếu JWT đã hết hạn, ngược lại false
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Trích xuất thời gian hết hạn từ JWT
     *
     * @param token JWT
     * @return Thời gian hết hạn
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Trích xuất thời gian tạo từ JWT
     *
     * @param token JWT
     * @return Thời gian tạo
     */
    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    /**
     * Phương thức trích xuất tất cả các Claims từ JWT
     *
     * @param token JWT
     * @return Claims chứa tất cả các thông tin trong JWT
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Lấy thời gian còn lại của token (tính bằng milliseconds)
     *
     * @param token JWT
     * @return Thời gian còn lại, -1 nếu đã hết hạn
     */
    public long getTokenRemainingTime(String token) {
        try {
            Date expiration = extractExpiration(token);
            long currentTime = System.currentTimeMillis();
            long expirationTime = expiration.getTime();
            return Math.max(0, expirationTime - currentTime);
        } catch (Exception e) {
            log.error("Error getting token remaining time: {}", e.getMessage());
            return -1;
        }
    }
}
