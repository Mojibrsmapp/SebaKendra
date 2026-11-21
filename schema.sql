-- SebaKendra MySQL Database Schema
-- Database: seba_kendra
-- User: seba_kendra / Password: seba_kendra

CREATE DATABASE IF NOT EXISTS `seba_kendra` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `seba_kendra`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) UNIQUE NOT NULL,
  `email` VARCHAR(150) NULL,
  `password_hash` VARCHAR(255) NULL,
  `role` ENUM('super_admin','admin','service_manager','finance_manager','support_agent','entrepreneur','citizen','business_user') DEFAULT 'citizen',
  `plan` VARCHAR(50) DEFAULT 'free',
  `ai_credits` INT DEFAULT 100,
  `district` VARCHAR(100) NULL,
  `upazila` VARCHAR(100) NULL,
  `shop_name` VARCHAR(150) NULL,
  `status` ENUM('active','pending','suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Services Catalogue Table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `name_bn` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `days` VARCHAR(50) DEFAULT '১-৩ দিন',
  `icon` VARCHAR(50) DEFAULT '🏛️',
  `desc_bn` TEXT,
  `docs_json` JSON,
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` INT NULL,
  `service_slug` VARCHAR(100) NOT NULL,
  `service_name` VARCHAR(255) NOT NULL,
  `fee` DECIMAL(10,2) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `customer_email` VARCHAR(150) NULL,
  `customer_district` VARCHAR(100) NULL,
  `customer_upazila` VARCHAR(100) NULL,
  `form_data` JSON,
  `status` ENUM('pending','processing','completed','cancelled','refunded') DEFAULT 'processing',
  `payment_id` VARCHAR(100) NULL,
  `trx_id` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_phone` (`customer_phone`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. bKash Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` VARCHAR(100) PRIMARY KEY,
  `order_id` VARCHAR(50) NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'BDT',
  `trx_id` VARCHAR(100) NULL,
  `customer_phone` VARCHAR(30) NULL,
  `customer_name` VARCHAR(150) NULL,
  `purpose` VARCHAR(255) NULL,
  `mode` ENUM('sandbox','live') DEFAULT 'sandbox',
  `status` ENUM('pending','completed','failed','expired','refunded') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `executed_at` TIMESTAMP NULL,
  INDEX `idx_payments_trx` (`trx_id`),
  INDEX `idx_payments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Immutable Financial Ledger (Append-only)
CREATE TABLE IF NOT EXISTS `ledger_entries` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` INT NULL,
  `type` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `reference_id` VARCHAR(100) NULL,
  `description` VARCHAR(255) NULL,
  `balance_after` DECIMAL(10,2) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ledger_type` (`type`),
  INDEX `idx_ledger_ref` (`reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Job Circulars Table
CREATE TABLE IF NOT EXISTS `job_circulars` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) NOT NULL,
  `category` ENUM('Govt','Private','Bank','Railway','Autonomous') DEFAULT 'Govt',
  `posts` VARCHAR(100) NOT NULL,
  `deadline` VARCHAR(100) NOT NULL,
  `start_date` VARCHAR(100) NULL,
  `end_date` VARCHAR(100) NULL,
  `remaining_text` VARCHAR(100) NULL,
  `apply_url` VARCHAR(255) NULL,
  `details_url` VARCHAR(255) NULL,
  `status` ENUM('active','expired') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Important Links Table (114+ official links)
CREATE TABLE IF NOT EXISTS `important_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `url` VARCHAR(255) NOT NULL,
  `click_count` INT DEFAULT 0,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. IT Shop Members Table
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL,
  `shop_name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `badge` VARCHAR(50) DEFAULT 'PRO',
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
