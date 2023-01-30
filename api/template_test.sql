DROP DATABASE IF EXISTS lesvoyageursdureve;
CREATE DATABASE lesvoyageursdureve;
USE lesvoyageursdureve;

CREATE TABLE `places` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `adresse` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `gameType` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `color` VARCHAR(8) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `games` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `game_type_id` INT unsigned NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `users` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `discord_id` VARCHAR(30) NOT NULL DEFAULT "0" UNIQUE,
    `discord_username` VARCHAR(100) NOT NULL DEFAULT "",
    `discord_avatar` VARCHAR(100) NOT NULL DEFAULT "",
    `permission_id` INT unsigned NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `comments` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `event_id` INT unsigned NOT NULL,
    `user_id` INT unsigned NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `events` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(5000) NOT NULL,
    `place_id` INT NOT NULL,
    `place_custom` VARCHAR(1000) NOT NULL,
    `game_id` INT NOT NULL,
    `game_custom` VARCHAR(1000) NOT NULL,
    `game_type_id` INT NOT NULL,
    `game_type_custom` VARCHAR(1000) NOT NULL,
    `admin_user_id` INT unsigned NOT NULL,
    `user_registered_array` VARCHAR(1000) NOT NULL DEFAULT "[]",
    `register_max` INT unsigned NOT NULL,
    `date_start` DATETIME NOT NULL,
    `date_end` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- create place
INSERT INTO places(name, city, adresse) VALUES("Epitech", "Mulhouse", "30 rue francois Spoerry");


-- create gameType
INSERT INTO gameType(name, color) VALUES("BloodBowl", "#ffc857");
INSERT INTO gameType(name, color) VALUES("Jeu de plateau", "#e9724c");
INSERT INTO gameType(name, color) VALUES("Jeu de figurines", "#c5283d");
INSERT INTO gameType(name, color) VALUES("Jeu de société", "#481d24");
INSERT INTO gameType(name, color) VALUES("Jeu de cartes", "#255f85");

-- create game
INSERT INTO games(name, game_type_id) VALUES("ligue du gateau equipe", 1);
INSERT INTO games(name, game_type_id) VALUES("zombicide", 2);
INSERT INTO games(name, game_type_id) VALUES("les aventuriers du rail", 2);
INSERT INTO games(name, game_type_id) VALUES("renature", 2);
INSERT INTO games(name, game_type_id) VALUES("santorini", 2);
INSERT INTO games(name, game_type_id) VALUES("dragonlance", 3);
INSERT INTO games(name, game_type_id) VALUES("fallout", 3);
INSERT INTO games(name, game_type_id) VALUES("métal-adventure", 3);

-- semaine 1
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Bienvenue", "Bienvenue sur le nouveau site les Voyageurs du rêve. N'hésitez pas à vous créer un compte afin d'ajouter de nouveaux événements.", 1, "Bienvenue", -1, "Bienvenue", -1, "Bienvenue", 1, "[]", 3, "2023-01-30 14:00:00", "2023-02-05 23:42:00");


--  create comment
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 1, 1, "Vous pouvez également discuter via un espace forum sur chaque événement", "2023-01-02 20:10:00");

GRANT ALL ON lesvoyageursdureve.* to WEBSITE@'%' IDENTIFIED BY 'password-db';
