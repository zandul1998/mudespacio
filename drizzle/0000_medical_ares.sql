CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` integer,
	`variants` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'order' NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `products_visibility_order` ON `products` (`published`,`sort`);