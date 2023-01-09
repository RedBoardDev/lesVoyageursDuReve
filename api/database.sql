DROP DATABASE IF EXISTS lesvoyageursdereve;
CREATE DATABASE lesvoyageursdereve;
USE lesvoyageursdereve;

CREATE TABLE `comments` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `event_id` INT unsigned NOT NULL,
    `user_id` INT unsigned NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `places` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `permissions` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `perm_type` VARCHAR(100) NOT NULL,
    `level` INT unsigned NOT NULL AUTO_INCREMENT,
    `color` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `gameType` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `perm_type` VARCHAR(100) NOT NULL,
    `user` VARCHAR(100) NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `games` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `game_type_id` INT unsigned NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `users` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `identifiant` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `discord_id` VARCHAR(30) NOT NULL DEFAULT "0",
    `permission_id` INT unsigned NOT NULL,
    `new_user` INT unsigned NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `events` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `place_id` INT unsigned NOT NULL,
    `game_id` INT unsigned NOT NULL,
    `game_title_id` INT unsigned NOT NULL,
    `admin_user_id` INT unsigned NOT NUL
    `message` VARCHAR(1000) NOT NULL,
    `user_registered_array` VARCHAR(1000) NOT NULL,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
