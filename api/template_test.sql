DROP DATABASE IF EXISTS lesvoyageursdureve;
CREATE DATABASE lesvoyageursdureve;
USE lesvoyageursdureve;

CREATE TABLE `places` (
    `id` INT unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `city` VARCHAR(100) NOT NULL,
    `adresse` VARCHAR(100) NOT NULL UNIQUE,
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
    `permission_id` INT unsigned NOT NULL DEFAULT 0,
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
    `description` VARCHAR(100) NOT NULL,
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

-- create some user avec password = Abced68!
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("user 1", "email1@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "617422693008146443", "", "", "0");
INSERT INTO users(username, email, password, discord_id, permission_id)
VALUES("user 2", "email2@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "352787867925348354", "", "", "1");
INSERT INTO users(username, email, password, discord_id, permission_id)
VALUES("user 3", "email3@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "419926802366988292", "RedBoard", "https://cdn.discordapp.com/avatars/419926802366988292/a_b1d9640d5007bb2d528b9e8f952d5900.gif", "2");


-- create place
INSERT INTO places(name, city, adresse) VALUES("place 1", "city 1", "adresse 1");
INSERT INTO places(name, city, adresse) VALUES("place 2", "city 2", "adresse 2");

-- create gameType
INSERT INTO gameType(name, color) VALUES("gameType 1", "#0000FF");
INSERT INTO gameType(name, color) VALUES("gameType 2", "#6666FF");

-- create game
INSERT INTO games(name, game_type_id) VALUES("game 1", 1);
INSERT INTO games(name, game_type_id) VALUES("game 2", 2);

--  create comment
-- un jour mek

-- semaine 1
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 1", "Ceci est une description wuw", 1, "", 1, "", 2, "", 2, "[1, 3]", 2, "2023-01-02 20:00:00", "2023-01-02 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 1", "Ceci est une description wuw", 2, "", 2, "", 1, "", 2, "[1, 2]", 5, "2023-01-03 20:00:00", "2023-01-03 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 1", "Ceci est une description wuw", 1, "", 1, "", 1, "", 3, "[3]", 5, "2023-01-04 20:00:00", "2023-01-04 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 1", "Ceci est une description wuw", 1, "", 2, "", 2, "", 3, "[3, 2]", 9, "2023-01-05 20:00:00", "2023-01-05 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 1", "Ceci est une description wuw", 2, "", 2, "", 1, "", 2, "[]", 15, "2023-01-07 20:00:00", "2023-01-07 22:00:00");

-- -- semaine 2
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 2", "Ceci est une description wuw", 2, "", 1, "", 2, "", 3, "[3, 1]", 3, "2023-01-10 20:00:00", "2023-01-10 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 2", "Ceci est une description wuw", 2, "", 2, "", 2, "", 3, "[1, 3]", 3, "2023-01-11 20:00:00", "2023-01-11 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 2", "Ceci est une description wuw", 1, "", 1, "", 2, "", 3, "[2, 3]", 9, "2023-01-12 20:00:00", "2023-01-12 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 2", "Ceci est une description wuw", 2, "", 2, "", 2, "", 2, "[3, 2, 1]", 6, "2023-01-13 20:00:00", "2023-01-13 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 2", "Ceci est une description wuw", 1, "", 2, "", 1, "", 3, "[2, 1, 3]", 6, "2023-01-14 20:00:00", "2023-01-14 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 2", "Ceci est une description wuw", 2, "", 2, "", 1, "", 2, "[3]", 4, "2023-01-15 20:00:00", "2023-01-15 22:00:00");

-- -- semaine 3
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 3", "Ceci est une description wuw", 1, "", 1, "", 1, "", 2, "[1]", 5, "2023-01-17 20:00:00", "2023-01-17 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 3", "Ceci est une description wuw", 2, "", 2, "", 1, "", 2, "[1]", 8, "2023-01-18 20:00:00", "2023-01-18 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 3", "Ceci est une description wuw", 2, "", 2, "", 2, "", 2, "[1]", 4, "2023-01-20 20:00:00", "2023-01-20 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 3", "Ceci est une description wuw", 1, "", 1, "", 1, "", 3, "[1]", 5, "2023-01-21 20:00:00", "2023-01-21 22:00:00");

-- -- semaine 5
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 1, "", 1, "", 1, "", 3, "[1]", 13, "2023-01-23 20:00:00", "2023-01-23 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 1, "", 2, "", 1, "", 2, "[1]", 7, "2023-01-24 20:00:00", "2023-01-24 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 2, "", 2, "", 2, "", 2, "[1]", 13, "2023-01-25 20:00:00", "2023-01-25 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 1, "", 1, "", 2, "", 3, "[1]", 5, "2023-01-26 20:00:00", "2023-01-26 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 1, "", 2, "", 1, "", 3, "[1]", 13, "2023-01-27 20:00:00", "2023-01-27 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 2, "", 1, "", 2, "", 2, "[1]", 3, "2023-01-28 20:00:00", "2023-01-28 22:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("week 4", "Ceci est une description wuw", 2, "", 2, "", 1, "", 3, "[1]", 9, "2023-01-29 20:00:00", "2023-01-29 22:00:00");
