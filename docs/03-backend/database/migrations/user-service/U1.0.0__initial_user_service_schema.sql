-- Rollback (Flyway Undo) for V1.0.0__initial_user_service_schema.sql
-- Version: 1.0.0
-- Description: Undo the initial user service schema migration
-- Author: Backend Team
-- Date: 2025-10-03

-- Drop views first
DROP VIEW IF EXISTS v_users_public;
DROP VIEW IF EXISTS v_users_admin;

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS trigger_user_sessions_last_activity ON user_sessions;

-- Drop functions (trigger functions)
DROP FUNCTION IF EXISTS update_users_updated_at();
DROP FUNCTION IF EXISTS update_user_profiles_updated_at();
DROP FUNCTION IF EXISTS update_user_sessions_updated_at();

-- Drop business functions
DROP FUNCTION IF EXISTS can_user_access_profile(UUID, UUID);
DROP FUNCTION IF EXISTS is_token_valid(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS cleanup_expired_tokens();

-- Drop indexes
DROP INDEX IF EXISTS idx_users_username_trgm;
DROP INDEX IF EXISTS idx_users_email_trgm;
DROP INDEX IF EXISTS idx_user_sessions_device_info_gin;

DROP INDEX IF EXISTS idx_user_sessions_last_activity;
DROP INDEX IF EXISTS idx_user_sessions_user_expires;
DROP INDEX IF EXISTS idx_email_verification_tokens_expires_verified;
DROP INDEX IF EXISTS idx_password_reset_tokens_expires_used;
DROP INDEX IF EXISTS idx_refresh_tokens_user_expires;
DROP INDEX IF EXISTS idx_users_email_status;
DROP INDEX IF EXISTS idx_users_status_role;

DROP INDEX IF EXISTS idx_user_sessions_user_id;
DROP INDEX IF EXISTS idx_email_verification_tokens_user_id;
DROP INDEX IF EXISTS idx_password_reset_tokens_user_id;
DROP INDEX IF EXISTS idx_refresh_tokens_user_id;
DROP INDEX IF EXISTS idx_user_profiles_user_id;

DROP INDEX IF EXISTS uk_user_sessions_session_token;
DROP INDEX IF EXISTS uk_email_verification_tokens_token_hash;
DROP INDEX IF EXISTS uk_password_reset_tokens_token_hash;
DROP INDEX IF EXISTS uk_refresh_tokens_token_hash;
DROP INDEX IF EXISTS uk_user_profiles_user_id;
DROP INDEX IF EXISTS uk_users_username;
DROP INDEX IF EXISTS uk_users_email;

DROP INDEX IF EXISTS pk_user_sessions;
DROP INDEX IF EXISTS pk_email_verification_tokens;
DROP INDEX IF EXISTS pk_password_reset_tokens;
DROP INDEX IF EXISTS pk_refresh_tokens;
DROP INDEX IF EXISTS pk_user_profiles;
DROP INDEX IF EXISTS pk_users;

-- Drop tables (children first)
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS email_verification_tokens;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

-- Cleanup extensions if desired (leave installed by DB admin if shared)
-- DROP EXTENSION IF EXISTS pg_trgm;
