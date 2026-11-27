-- MySQL Database Schema for Personal Portfolio Website
-- Compatible with MySQL 8.0+ and MariaDB 10.4+

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- 1. Portfolio Profile & Settings (Hero, About, Links)
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  professional_title VARCHAR(200) NOT NULL,
  availability_badge VARCHAR(120) NOT NULL DEFAULT 'Available for Opportunities',
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  short_intro TEXT NOT NULL,
  about_intro TEXT NOT NULL,
  development_journey TEXT NOT NULL,
  education_summary TEXT NOT NULL,
  areas_of_interest TEXT NOT NULL,
  career_goals TEXT NOT NULL,
  github_url VARCHAR(255) NOT NULL DEFAULT '',
  linkedin_url VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(150) NOT NULL DEFAULT '',
  location VARCHAR(120) NOT NULL DEFAULT '',
  resume_url VARCHAR(255) NOT NULL DEFAULT '/api/profile/resume',
  profile_image VARCHAR(255) NOT NULL DEFAULT '/images/hero-developer.png',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(60) NOT NULL DEFAULT 'code',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_skills_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(160) NOT NULL,
  title VARCHAR(200) NOT NULL,
  short_description VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(180) NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT '/images/codegen-cover.png',
  screenshots LONGTEXT NULL,
  technologies LONGTEXT NOT NULL,
  features LONGTEXT NULL,
  problem_statement TEXT NULL,
  proposed_solution TEXT NULL,
  objectives LONGTEXT NULL,
  future_enhancements LONGTEXT NULL,
  github_url VARCHAR(255) NOT NULL DEFAULT '',
  demo_url VARCHAR(255) NOT NULL DEFAULT '',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_slug (slug),
  KEY idx_projects_featured (is_featured, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Experience, Education, Certifications & Achievements
CREATE TABLE IF NOT EXISTS timeline_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_type ENUM('education', 'internship', 'work', 'certification', 'achievement') NOT NULL,
  title VARCHAR(200) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  period VARCHAR(100) NOT NULL,
  location VARCHAR(120) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  highlights LONGTEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_timeline_section (section_type, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(64) NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Admin Users Table (Passwords stored strictly as bcrypt hashes)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_username (username),
  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Portfolio Likes Counter (replaces Firebase counter with MySQL persistence)
CREATE TABLE IF NOT EXISTS portfolio_likes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  likes_count INT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
