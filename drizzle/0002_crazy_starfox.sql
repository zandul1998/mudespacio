CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`role` text DEFAULT 'team' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_members_email` ON `team_members` (`email`);--> statement-breakpoint
CREATE INDEX `team_members_access` ON `team_members` (`active`,`role`);