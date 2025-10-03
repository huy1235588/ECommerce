# Database Migration Template

Đây là template chuẩn cho việc tạo file migration trong dự án ECommerce. Template này dựa trên best practices từ các migration hiện có của user service.

## 1. Template File Migration SQL

### Cấu trúc tên file:

```
V{major}.{minor}.{patch}__{description}.sql
```

**Ví dụ:** `V1.5.0__Add_notification_system.sql`

### Template nội dung:

```sql
-- {Service Name} - {Feature Description} Migration
-- Version: {version}
-- Description: {detailed description of what this migration does}
-- Author: {author name or team name}
-- Date: {YYYY-MM-DD}

-- =============================================================================
-- EXTENSIONS (if needed)
-- =============================================================================
-- CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- TABLES
-- =============================================================================

-- Create main table
CREATE TABLE {table_name} (
    id UUID PRIMARY KEY,
    -- Foreign key references
    user_id UUID NOT NULL,
    -- Core business fields
    name VARCHAR(255) NOT NULL,
    description TEXT,
    -- Status and flags
    is_active BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    -- JSON fields (if needed)
    settings JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    -- Add foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Primary indexes for foreign keys
CREATE INDEX idx_{table_name}_user_id ON {table_name}(user_id);

-- Indexes for common query patterns
CREATE INDEX idx_{table_name}_active ON {table_name}(is_active) WHERE is_deleted = false;
CREATE INDEX idx_{table_name}_created_at ON {table_name}(created_at);
CREATE INDEX idx_{table_name}_updated_at ON {table_name}(updated_at);

-- Partial indexes for better performance
CREATE INDEX idx_{table_name}_active_not_deleted ON {table_name}(id)
    WHERE is_active = true AND is_deleted = false;

-- Composite indexes for complex queries
CREATE INDEX idx_{table_name}_user_active ON {table_name}(user_id, is_active)
    WHERE is_deleted = false;

-- JSONB indexes (if applicable)
CREATE INDEX idx_{table_name}_settings ON {table_name} USING GIN (settings);
CREATE INDEX idx_{table_name}_metadata ON {table_name} USING GIN (metadata);

-- =============================================================================
-- CONSTRAINTS
-- =============================================================================

-- Check constraints
ALTER TABLE {table_name} ADD CONSTRAINT chk_{table_name}_name_not_empty
    CHECK (LENGTH(TRIM(name)) > 0);

-- Email format validation (if applicable)
-- ALTER TABLE {table_name} ADD CONSTRAINT chk_{table_name}_email_format
--     CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Enum constraints (if applicable)
-- ALTER TABLE {table_name} ADD CONSTRAINT chk_{table_name}_status
--     CHECK (status IN ('active', 'inactive', 'pending', 'suspended'));

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_{table_name}_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Business logic functions (example)
CREATE OR REPLACE FUNCTION soft_delete_{table_name}(p_id UUID, p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE {table_name}
    SET is_deleted = true,
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_id AND user_id = p_user_id AND is_deleted = false;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record not found or already deleted';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for maintenance
CREATE OR REPLACE FUNCTION cleanup_{table_name}(p_retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Hard delete records that have been soft deleted for retention period
    DELETE FROM {table_name}
    WHERE is_deleted = true
    AND deleted_at < (NOW() - (p_retention_days || ' days')::INTERVAL);

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RAISE NOTICE 'Cleaned up % {table_name} records', deleted_count;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger for updating updated_at timestamp
CREATE TRIGGER trigger_{table_name}_updated_at
    BEFORE UPDATE ON {table_name}
    FOR EACH ROW
    EXECUTE FUNCTION update_{table_name}_updated_at();

-- =============================================================================
-- VIEWS (if needed)
-- =============================================================================

-- Active records view
CREATE VIEW active_{table_name} AS
SELECT *
FROM {table_name}
WHERE is_active = true AND is_deleted = false;

-- Analytics view (example)
CREATE VIEW {table_name}_analytics AS
SELECT
    user_id,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE is_active = true) as active_records,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_records,
    MIN(created_at) as first_created,
    MAX(updated_at) as last_updated
FROM {table_name}
WHERE is_deleted = false
GROUP BY user_id;

-- =============================================================================
-- INITIAL DATA (if needed)
-- =============================================================================

-- Insert default/reference data
-- INSERT INTO {table_name} (name, description, is_active) VALUES
-- ('Default Item', 'Default description', true);

-- =============================================================================
-- PERMISSIONS (if applicable)
-- =============================================================================

-- Grant appropriate permissions
-- GRANT SELECT, INSERT, UPDATE, DELETE ON {table_name} TO app_user;
-- GRANT USAGE ON SEQUENCE {table_name}_id_seq TO app_user;

-- =============================================================================
-- COMMENTS
-- =============================================================================

-- Table comments
COMMENT ON TABLE {table_name} IS '{Description of what this table stores and its purpose}';

-- Column comments
COMMENT ON COLUMN {table_name}.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN {table_name}.user_id IS 'Reference to users table';
COMMENT ON COLUMN {table_name}.name IS 'Human readable name/title';
COMMENT ON COLUMN {table_name}.description IS 'Detailed description';
COMMENT ON COLUMN {table_name}.is_active IS 'Whether the record is active';
COMMENT ON COLUMN {table_name}.is_deleted IS 'Soft delete flag';
COMMENT ON COLUMN {table_name}.settings IS 'Configuration settings in JSON format';
COMMENT ON COLUMN {table_name}.metadata IS 'Additional metadata in JSON format';
COMMENT ON COLUMN {table_name}.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN {table_name}.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN {table_name}.deleted_at IS 'Soft deletion timestamp';

-- Function comments
COMMENT ON FUNCTION update_{table_name}_updated_at() IS 'Automatically updates the updated_at timestamp';
COMMENT ON FUNCTION soft_delete_{table_name}(UUID, UUID) IS 'Soft delete a record by setting is_deleted flag';
COMMENT ON FUNCTION cleanup_{table_name}(INTEGER) IS 'Hard delete old soft-deleted records for cleanup';

-- =============================================================================
-- PERFORMANCE OPTIMIZATION
-- =============================================================================

-- Update table statistics
ANALYZE {table_name};

-- Create concurrent indexes if this is a hot table
-- CREATE INDEX CONCURRENTLY idx_{table_name}_performance ON {table_name}(frequently_queried_column);
```

## 2. Best Practices

### 2.1 Naming Conventions

**Tables:**

-   Sử dụng snake_case
-   Tên số nhiều: `users`, `collections`, `items`
-   Tên có ý nghĩa và mô tả rõ mục đích

**Columns:**

-   Sử dụng snake_case
-   Tên rõ ràng và có ý nghĩa
-   Tránh viết tắt không cần thiết

**Indexes:**

-   `idx_{table_name}_{column_name(s)}`
-   `idx_{table_name}_{purpose}` cho partial/composite indexes

**Constraints:**

-   `chk_{table_name}_{constraint_purpose}`
-   `fk_{table_name}_{referenced_table}`
-   `uk_{table_name}_{column_name}`

**Functions:**

-   `{action}_{table_name}_{purpose}`
-   Ví dụ: `cleanup_user_sessions`, `update_user_preferences`

### 2.2 Standard Columns

Mọi table chính nên có các columns sau:

```sql
-- Primary key
id UUID PRIMARY KEY,

-- Audit fields
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP,

-- Soft delete (if needed)
is_deleted BOOLEAN DEFAULT false,
deleted_at TIMESTAMP,

-- Status tracking (if applicable)
is_active BOOLEAN DEFAULT true,
```

### 2.3 Index Strategy

1. **Primary indexes:** Foreign keys, commonly queried columns
2. **Partial indexes:** For active/non-deleted records
3. **Composite indexes:** For complex queries
4. **JSONB indexes:** Sử dụng GIN indexes cho JSONB columns

### 2.4 Security Considerations

1. **No sensitive data in comments**
2. **Proper foreign key constraints**
3. **Input validation via check constraints**
4. **Audit logging for sensitive operations**

### 2.5 Performance Considerations

1. **ANALYZE tables after creation**
2. **Use appropriate data types**
3. **Index frequently queried columns**
4. **Consider partitioning for large tables**

## 3. Migration Checklist

Trước khi apply migration:

-   [ ] Kiểm tra tên file migration theo convention
-   [ ] Version number tăng dần và không conflict
-   [ ] Tất cả foreign keys đều có indexes
-   [ ] Các constraints hợp lý và cần thiết
-   [ ] Comments đầy đủ cho tables và columns quan trọng
-   [ ] Test migration trên database development
-   [ ] Backup database trước khi apply lên production
-   [ ] Có rollback plan nếu cần

## 4. Rollback Template

```sql
-- Rollback script for V{version}__{description}.sql
-- This script should undo all changes made in the migration

-- Drop views first
DROP VIEW IF EXISTS {view_name};

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_{table_name}_updated_at ON {table_name};

-- Drop functions
DROP FUNCTION IF EXISTS update_{table_name}_updated_at();
DROP FUNCTION IF EXISTS soft_delete_{table_name}(UUID, UUID);

-- Drop indexes
DROP INDEX IF EXISTS idx_{table_name}_user_id;
-- ... other indexes

-- Drop tables (be careful!)
DROP TABLE IF EXISTS {table_name};
```

## 5. Common Patterns

### 5.1 Junction Tables (Many-to-Many)

```sql
CREATE TABLE {table1}_{table2} (
    {table1}_id UUID NOT NULL,
    {table2}_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID,
    PRIMARY KEY ({table1}_id, {table2}_id),
    FOREIGN KEY ({table1}_id) REFERENCES {table1}(id) ON DELETE CASCADE,
    FOREIGN KEY ({table2}_id) REFERENCES {table2}(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 5.2 Audit/History Tables

```sql
CREATE TABLE {table_name}_history (
    id UUID PRIMARY KEY,
    {table_name}_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ({table_name}_id) REFERENCES {table_name}(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 5.3 Settings/Configuration Tables

```sql
CREATE TABLE {entity}_settings (
    id UUID PRIMARY KEY,
    {entity}_id UUID NOT NULL UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    FOREIGN KEY ({entity}_id) REFERENCES {entity}(id) ON DELETE CASCADE
);

-- Index for JSONB queries
CREATE INDEX idx_{entity}_settings_gin ON {entity}_settings USING GIN (settings);
```

Đây là template đầy đủ dựa trên best practices từ các file migration của user service trong dự án ECommerce!
