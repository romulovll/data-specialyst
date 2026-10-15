CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_progress (
    hub_name VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    progress JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (hub_name, user_id)
);

CREATE TABLE IF NOT EXISTS newsletter_issues (
    id SERIAL PRIMARY KEY,
    date VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tldr TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    certs TEXT[] NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    email VARCHAR(255) PRIMARY KEY,
    subscribed_at TIMESTAMP DEFAULT NOW()
);
