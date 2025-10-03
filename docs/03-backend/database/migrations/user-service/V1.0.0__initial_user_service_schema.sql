-- User Service - Initial Schema Migration
-- Version: 1.0.0
-- Description: Create initial tables, indexes, constraints, functions, triggers and views for User Service
-- Author: Backend Team
-- Date: 2025-10-03

-- =============================================================================
-- EXTENSIONS (if needed)
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Create main users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    last_login_at TIMESTAMP
);

-- user_profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    bio TEXT,
    country VARCHAR(2),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- refresh_tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- password_reset_tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- email_verification_tokens
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- user_sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    device_info JSONB,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Primary indexes for primary keys (explicit for clarity)
CREATE UNIQUE INDEX pk_users ON users(id);
CREATE UNIQUE INDEX pk_user_profiles ON user_profiles(id);
CREATE UNIQUE INDEX pk_refresh_tokens ON refresh_tokens(id);
CREATE UNIQUE INDEX pk_password_reset_tokens ON password_reset_tokens(id);
CREATE UNIQUE INDEX pk_email_verification_tokens ON email_verification_tokens(id);
CREATE UNIQUE INDEX pk_user_sessions ON user_sessions(id);

-- Unique indexes / business constraints
CREATE UNIQUE INDEX uk_users_email ON users(email);
CREATE UNIQUE INDEX uk_users_username ON users(username);
CREATE UNIQUE INDEX uk_user_profiles_user_id ON user_profiles(user_id);
CREATE UNIQUE INDEX uk_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE UNIQUE INDEX uk_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE UNIQUE INDEX uk_email_verification_tokens_token_hash ON email_verification_tokens(token_hash);
CREATE UNIQUE INDEX uk_user_sessions_session_token ON user_sessions(session_token);

-- Foreign key indexes (for join performance)
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- Composite and helper indexes
CREATE INDEX idx_users_status_role ON users(status, role);
CREATE INDEX idx_users_email_status ON users(email, status);
CREATE INDEX idx_refresh_tokens_user_expires ON refresh_tokens(user_id, expires_at, is_revoked);
CREATE INDEX idx_password_reset_tokens_expires_used ON password_reset_tokens(expires_at, is_used);
CREATE INDEX idx_email_verification_tokens_expires_verified ON email_verification_tokens(expires_at, is_verified);
CREATE INDEX idx_user_sessions_user_expires ON user_sessions(user_id, expires_at);
CREATE INDEX idx_user_sessions_last_activity ON user_sessions(last_activity_at);

-- Trigram indexes for search
CREATE INDEX idx_users_username_trgm ON users USING gin (username gin_trgm_ops);
CREATE INDEX idx_users_email_trgm ON users USING gin (email gin_trgm_ops);

-- JSONB indexes
CREATE INDEX idx_user_sessions_device_info_gin ON user_sessions USING gin (device_info);

-- =============================================================================
-- CONSTRAINTS
-- =============================================================================

-- Email format validation
ALTER TABLE users ADD CONSTRAINT chk_users_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Username format validation (alphanumeric + underscore only)
ALTER TABLE users ADD CONSTRAINT chk_users_username_format
    CHECK (username ~* '^[a-zA-Z0-9_]{3,50}$');

-- Status enum validation
ALTER TABLE users ADD CONSTRAINT chk_users_status
    CHECK (status IN ('active', 'inactive', 'suspended'));

-- Role enum validation
ALTER TABLE users ADD CONSTRAINT chk_users_role
    CHECK (role IN ('customer', 'admin'));

-- Password hash length (bcrypt produces 60 characters)
ALTER TABLE users ADD CONSTRAINT chk_users_password_length
    CHECK (LENGTH(password) = 60);

-- Country code validation (ISO 3166-1 alpha-2)
ALTER TABLE user_profiles ADD CONSTRAINT chk_user_profiles_country_format
    CHECK (country IS NULL OR LENGTH(country) = 2);

-- Bio length validation
ALTER TABLE user_profiles ADD CONSTRAINT chk_user_profiles_bio_length
    CHECK (bio IS NULL OR LENGTH(bio) <= 500);

-- Birth date validation (must be in past, at least 13 years old)
ALTER TABLE user_profiles ADD CONSTRAINT chk_user_profiles_birth_date
    CHECK (birth_date IS NULL OR birth_date < CURRENT_DATE - INTERVAL '13 years');

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp for users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp for user_profiles
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp for user_sessions
CREATE OR REPLACE FUNCTION update_user_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = COALESCE(NEW.last_activity_at, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Business logic functions
CREATE OR REPLACE FUNCTION can_user_access_profile(
    p_user_id UUID,
    p_target_user_id UUID
)
RETURNS boolean AS $$
DECLARE
    v_user_role VARCHAR(20);
BEGIN
    -- Get user role
    SELECT role INTO v_user_role FROM users WHERE id = p_user_id;

    -- Admin can access all profiles
    IF v_user_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    -- User can access own profile
    IF p_user_id = p_target_user_id THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_token_valid(
    p_token_hash VARCHAR(255),
    p_token_type VARCHAR(50)
)
RETURNS boolean AS $$
DECLARE
    v_expires_at TIMESTAMP;
    v_is_used BOOLEAN;
    v_is_revoked BOOLEAN;
BEGIN
    IF p_token_type = 'refresh' THEN
        SELECT expires_at, is_revoked INTO v_expires_at, v_is_revoked
        FROM refresh_tokens
        WHERE token_hash = p_token_hash;

        RETURN v_expires_at > NOW() AND NOT v_is_revoked;

    ELSIF p_token_type = 'password_reset' THEN
        SELECT expires_at, is_used INTO v_expires_at, v_is_used
        FROM password_reset_tokens
        WHERE token_hash = p_token_hash;

        RETURN v_expires_at > NOW() AND NOT v_is_used;

    ELSIF p_token_type = 'email_verification' THEN
        SELECT expires_at, is_verified INTO v_expires_at, v_is_used
        FROM email_verification_tokens
        WHERE token_hash = p_token_hash;

        RETURN v_expires_at > NOW() AND NOT v_is_used;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for expired tokens and sessions
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    -- Cleanup refresh tokens
    DELETE FROM refresh_tokens
    WHERE (expires_at < NOW() - INTERVAL '30 days')
       OR (is_revoked = true AND created_at < NOW() - INTERVAL '30 days');

    -- Cleanup password reset tokens
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW() - INTERVAL '24 hours';

    -- Cleanup email verification tokens
    DELETE FROM email_verification_tokens
    WHERE (is_verified = true AND created_at < NOW() - INTERVAL '7 days')
       OR (expires_at < NOW() - INTERVAL '7 days');

    -- Cleanup expired sessions
    DELETE FROM user_sessions
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger for updating updated_at timestamp
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

CREATE TRIGGER trigger_user_sessions_last_activity
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_sessions_updated_at();

-- =============================================================================
-- VIEWS (if needed)
-- =============================================================================

-- Active records / public view
CREATE VIEW v_users_public AS
SELECT
    u.id,
    u.username,
    u.status,
    u.email_verified,
    u.created_at,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.bio,
    p.country
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE u.status = 'active'
ORDER BY u.created_at DESC;

-- Admin view
CREATE VIEW v_users_admin AS
SELECT
    u.id,
    u.email,
    u.username,
    u.status,
    u.role,
    u.email_verified,
    u.created_at,
    u.updated_at,
    u.last_login_at,
    p.first_name,
    p.last_name,
    p.country,
    COUNT(DISTINCT s.id) as active_sessions
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN user_sessions s ON u.id = s.user_id AND s.expires_at > NOW()
GROUP BY u.id, p.id
ORDER BY u.created_at DESC;

-- =============================================================================
-- INITIAL DATA (if needed)
-- =============================================================================

-- (no initial data inserted in this migration)

-- =============================================================================
-- PERMISSIONS (if applicable)
-- =============================================================================

-- (grant statements omitted; manage in deployment scripts if necessary)

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE users IS 'Authentication and account information for users';
COMMENT ON COLUMN users.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (lowercased before insert)';
COMMENT ON COLUMN users.username IS 'Unique username';
COMMENT ON COLUMN users.password IS 'BCrypt hashed password';
COMMENT ON COLUMN users.email_verified IS 'Email verification flag';

COMMENT ON TABLE user_profiles IS 'Profile information for users';
COMMENT ON COLUMN user_profiles.user_id IS 'Reference to users.id';

-- =============================================================================
-- PERFORMANCE OPTIMIZATION
-- =============================================================================

ANALYZE users;
ANALYZE user_profiles;
ANALYZE refresh_tokens;
ANALYZE password_reset_tokens;
ANALYZE email_verification_tokens;
ANALYZE user_sessions;
