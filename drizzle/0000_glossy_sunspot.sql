CREATE TABLE `user_activity` (
	`user_id` text PRIMARY KEY NOT NULL,
	`last_activity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`actual_rank` text NOT NULL,
	`arrival_date` text NOT NULL,
	`discord_id` text,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_discord_id_unique` ON `user` (`discord_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);