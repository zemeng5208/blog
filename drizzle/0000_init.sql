CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`content` text NOT NULL,
	`date` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`cover` text,
	`series` text,
	`series_order` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`draft` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uk_posts_slug` ON `posts` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_posts_date` ON `posts` (`date`);
--> statement-breakpoint
CREATE INDEX `idx_posts_draft_featured` ON `posts` (`draft`,`featured`);
--> statement-breakpoint
CREATE INDEX `idx_posts_series` ON `posts` (`series`,`series_order`);
