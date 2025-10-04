-- User Service - Split roles into roles and user_roles
-- Version: V002
-- Description: Create `roles` and `user_roles` tables, seed default roles, migrate existing values from users.role (if present).
-- Author: Backend Team
-- Date: 2025-10-03

-- =============================================================================
-- EXTENSIONS
-- =============================================================================
-- Use pgcrypto for gen_random_uuid(); change if your environment uses uuid-ossp
CREATE
EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Roles table: stores role definitions (RBAC)
CREATE TABLE roles
(
    id          UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_default  BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP
);

-- Junction table mapping users to roles (many-to-many)
CREATE TABLE user_roles
(
    id          UUID PRIMARY KEY   DEFAULT gen_random_uuid(),
    user_id     UUID      NOT NULL,
    role_id     UUID      NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at  TIMESTAMP,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Unique / primary indexes
CREATE UNIQUE INDEX pk_roles ON roles (id);
CREATE UNIQUE INDEX pk_user_roles ON user_roles (id);

-- Business unique constraints
CREATE UNIQUE INDEX uk_roles_name ON roles (name);
CREATE UNIQUE INDEX uk_user_roles_user_role ON user_roles (user_id, role_id);

-- Foreign key / join indexes
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

-- =============================================================================
-- CONSTRAINTS & CHECKS
-- =============================================================================

-- No additional check constraints here; role validity is enforced by referential integrity

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Helper function: assign a role to a user by role name (idempotent)
CREATE
OR REPLACE FUNCTION assign_role_to_user(p_user_id UUID, p_role_name VARCHAR)
RETURNS VOID AS $$
DECLARE
v_role_id UUID;
BEGIN
SELECT id
INTO v_role_id
FROM roles
WHERE name = p_role_name;
IF
v_role_id IS NULL THEN
        RAISE EXCEPTION 'Role % not found', p_role_name;
END IF;

INSERT INTO user_roles (id, user_id, role_id, assigned_at)
VALUES (gen_random_uuid(), p_user_id, v_role_id, NOW()) ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$
LANGUAGE plpgsql;

-- Helper function: revoke a role from a user (soft revoke)
CREATE
OR REPLACE FUNCTION revoke_role_from_user(p_user_id UUID, p_role_name VARCHAR)
RETURNS VOID AS $$
DECLARE
v_role_id UUID;
BEGIN
SELECT id
INTO v_role_id
FROM roles
WHERE name = p_role_name;
IF
v_role_id IS NULL THEN
        RAISE EXCEPTION 'Role % not found', p_role_name;
END IF;

UPDATE user_roles
SET revoked_at = NOW()
WHERE user_id = p_user_id
  AND role_id = v_role_id
  AND revoked_at IS NULL;
END;
$$
LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- =============================================================================
-- VIEWS (if needed)
-- =============================================================================

-- Example view: user with active roles (active = revoked_at IS NULL)
CREATE
OR REPLACE VIEW v_users_with_roles AS
SELECT u.id                                                                                as user_id,
       u.email,
       u.username,
       array_remove(array_agg(DISTINCT r.name) FILTER (WHERE ur.revoked_at IS NULL), NULL) AS roles
FROM users u
         LEFT JOIN user_roles ur ON ur.user_id = u.id
         LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id, u.email, u.username;

-- Example view: user with profile and active roles
CREATE
OR REPLACE VIEW user_with_profile_view AS
SELECT u.id,
       u.email,
       u.username,
       up.first_name,
       up.last_name,
       up.avatar_url,
       u.status,
       u.email_verified,
       up.birth_date,
       up.country,
       u.created_at,
       u.updated_at,
       u.last_login_at,
       array_remove(array_agg(DISTINCT r.name) FILTER (WHERE ur.revoked_at IS NULL), NULL) AS roles
FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.id
         LEFT JOIN user_roles ur ON ur.user_id = u.id
         LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id, u.email, u.username, up.first_name, up.last_name,
         up.avatar_url, u.status, u.email_verified, up.birth_date,
         up.country, u.created_at, u.updated_at, u.last_login_at;


-- =============================================================================
-- INITIAL DATA / SEED
-- =============================================================================

-- Seed core roles (id generated); do nothing if already present
INSERT INTO roles (id, name, description, is_default)
VALUES (gen_random_uuid(), 'CUSTOMER', 'Default customer role', true),
       (gen_random_uuid(), 'ADMIN', 'Administrator role', false) ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- MIGRATE EXISTING DATA
-- =============================================================================

-- =============================================================================
-- OPTIONAL: Drop old column
-- =============================================================================

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT
ON TABLE roles IS 'System roles for RBAC; might be extended with permissions table later';
COMMENT
ON COLUMN roles.name IS 'Canonical role name (e.g., customer, admin)';
COMMENT
ON COLUMN roles.is_default IS 'Whether role should be assigned to new users by default';

COMMENT
ON TABLE user_roles IS 'Mapping between users and roles; revoked_at indicates soft revocation';
COMMENT
ON COLUMN user_roles.assigned_at IS 'Timestamp when role was assigned to user';
COMMENT
ON COLUMN user_roles.revoked_at IS 'Timestamp when role was revoked (soft remove)';

-- =============================================================================
-- PERFORMANCE / MAINTENANCE
-- =============================================================================

ANALYZE
roles;
ANALYZE
user_roles;

COMMIT;

-- End of migration V002__split_roles.sql
