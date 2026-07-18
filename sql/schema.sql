-- Blog 技术博客 MySQL 结构（项目目录 D:\blog）
-- 字符集 utf8mb4

CREATE DATABASE IF NOT EXISTS `blog`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `blog`;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(120) NOT NULL COMMENT 'URL 唯一标识',
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(500) NOT NULL DEFAULT '',
  `content` MEDIUMTEXT NOT NULL COMMENT 'Markdown 正文',
  `date` DATE NOT NULL,
  `tags` JSON NOT NULL COMMENT '标签数组',
  `cover` VARCHAR(500) NULL DEFAULT NULL,
  `series` VARCHAR(120) NULL DEFAULT NULL COMMENT '系列名，如 Next.js 实战',
  `series_order` INT NOT NULL DEFAULT 0 COMMENT '系列内序号',
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `draft` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_posts_slug` (`slug`),
  KEY `idx_posts_date` (`date`),
  KEY `idx_posts_draft_featured` (`draft`, `featured`),
  KEY `idx_posts_series` (`series`, `series_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
