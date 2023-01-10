DROP DATABASE IF EXISTS lesvoyageursdureve;
CREATE DATABASE lesvoyageursdureve;
USE lesvoyageursdureve;

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
    `city` VARCHAR(100) NOT NULL UNIQUE,
    `adresse` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `gameType` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `discord_id` VARCHAR(30) NOT NULL DEFAULT "0",
    `permission_id` INT unsigned NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `events` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `place_id` INT unsigned NOT NULL,
    `game_id` INT unsigned NOT NULL,
    `game_title_id` INT unsigned NOT NULL,
    `admin_user_id` INT unsigned NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `user_registered_array` VARCHAR(1000) NOT NULL,
    `date` DATETIME NOT NULL,
    `duration` INT unsigned NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL ON lesvoyageursdureve.* to WEBSITE@'%' IDENTIFIED BY 'password-db';