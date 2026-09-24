CREATE TABLE IF NOT EXISTS study_progress (
    hub_name VARCHAR(50) PRIMARY KEY,
    progress JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW()
);
