CREATE TABLE `schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`day` integer NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`status` text DEFAULT 'forming' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `schedules_visibility_order` ON `schedules` (`published`,`day`,`sort`);