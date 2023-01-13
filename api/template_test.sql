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

-- create some user with password = Abced68!
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("Douceur", "email1@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "869961454521049098", "Douceur", "https://cdn.discordapp.com/avatars/869961454521049098/24b6b32d6ff0fde8c1e6ac18b8966cf8.png", "0");
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("Kampouse", "email2@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "175665598443945985", "JEEPUPPER", "https://cdn.discordapp.com/avatars/175665598443945985/0369f2ccdad8752e76c0ab6ab276700e.png", "0");
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("CorentinTqp", "email3@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "645683901796319232", "CorentinTqp", "https://cdn.discordapp.com/avatars/645683901796319232/ba8d58c822ec8475df1a0449912d1320.png", "1");
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("Jérémy", "email4@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "400060573364256778", "Jérémy", "https://cdn.discordapp.com/avatars/400060573364256778/6a35df8693566b7365d0948c26ad79b7.png", "1");
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("MrPaper", "email5@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "352787867925348354", "MrPaper", "https://cdn.discordapp.com/avatars/352787867925348354/83995b689eba79dc9722172d4ad8c6c2.png", "1");
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("Mazettt", "email6@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "617422693008146443", "Mazettt", "https://cdn.discordapp.com/avatars/617422693008146443/75dedf64b513b81b25469d17ea273705.png", "2");
INSERT INTO users(username, email, password, discord_id, discord_username, discord_avatar, permission_id)
VALUES("RedBoard", "email7@gmail.com", "$2a$10$KU1XpfVv9jWy3MyVCGOWee/C.4URHVHK/WA2cG4hTjTiW609Bd8VG", "419926802366988292", "RedBoard", "https://cdn.discordapp.com/avatars/419926802366988292/a_b1d9640d5007bb2d528b9e8f952d5900.gif", "2");


-- create place
INSERT INTO places(name, city, adresse) VALUES("QG", "Mulhouse", "6 rue des avions");
INSERT INTO places(name, city, adresse) VALUES("Epitech", "Mulhouse", "30 rue francois Spoerry");
INSERT INTO places(name, city, adresse) VALUES("Mairie", "Mulhouse", "7 rue des pigeons");

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
VALUES("Présentation projet", "Présentation du projet", 2, "", -1, "Pitch", -1, "Présentation", 7, "[5, 6, 7]", 3, "2023-01-13 14:00:00", "2023-01-13 16:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Soirée sans limite", "Suite de la semaine dernière", 1, "", -1, "La tombe de l'annihilation", 3, "", 5, "[1, 3]", 5, "2023-01-13 20:00:00", "2023-01-14 01:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Porte ouverte", "Porte ouverte de l'association", 1, "", -1, "Porte ouverte", -1, "Porte ouverte", 7, "[1, 2, 3, 4, 5]", 10, "2023-01-14 12:50:00", "2023-01-14 18:30:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Découverte", "découverte jeu de carte", 2, "", 8, "", 5, "", 6, "[4, 7, 6]", 5, "2023-01-15 12:00:00", "2023-01-15 13:45:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Découverte", "découverte bloodbowl", 1, "", 4, "", 1, "", 6, "[1, 2, 5, 6]", 4, "2023-01-15 16:00:00", "2023-01-15 19:45:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Soirée entre amis", "soirée chill", 1, "", 3, "", 2, "", 3, "[3, 4, 6, 7]", 8, "2023-01-17 18:15:00", "2023-01-17 23:45:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Rendez-vous annuel", "rendez-vous municipal", 3, "", -1, "rendez-vous", -1, "rendez-vous", 6, "[6, 7]", 9, "2023-01-18 10:00:00", "2023-01-18 12:00:00");
INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, user_registered_array, register_max, date_start, date_end)
VALUES("Journée complète", "journée chill JDR", 1, "", 1, "", 3, "", 4, "[4, 5, 6]", 5, "2023-01-19 20:00:00", "2023-01-19 22:00:00");

--  create comment
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 1, 1, "Hâte de voir le nouveau design !", "2023-01-02 20:10:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 1, 4, "Vive le nouveau site !", "2023-01-02 20:10:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 2, "Allez, je me lance !", "2023-01-02 20:10:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 7, "Potentiellement intéressé.", "2023-01-02 20:50:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 3, "Désolé... Pas participé...", "2023-01-02 20:30:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 1, "Bonne chance à leurs financements !", "2023-01-02 20:25:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 4, "j'ais déjà pledgé Chronicles of wara.", "2023-01-02 20:05:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 3, "Le pledge manager est ouvert ! Tu as trouvé le lien ?", "2023-01-02 20:55:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 2, "tu vas sur le site, tu te connectes, tu cliques sur boutique, puis sur pledge manager, puis tu fais tes choix", "2023-01-02 20:28:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 2, 1, "Ca me tente bien! Mais je connais très peu l'univers", "2023-01-02 20:20:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 3, 2, "je suis bien tenté d essayer un nouvel univers et un nouveau MJ mais j'attends d avoir la date pour confirmer", "2023-01-02 20:30:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 3, 1, "Je me mets en premier sur la liste d'attente...", "2023-01-02 20:37:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 3, 1, "Argh, je sens que je vais encore regretter que les journées n'aient que 24 h...", "2023-01-02 20:25:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 3, 5, "Ça me dit bien  :)", "2023-01-02 20:40:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 3, 6, "Pour une présentation générale des règles, il existe aussi cette vidéo en anglais (dont l'intro met bien en avant le thème historico-politique de la campagne) : https://www.youtube.com/watch?v=rhmOiRa4BNs", "2023-01-02 20:15:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 3, 1, "Désolé, pas possible pour moi, je me suis chopé le virus.", "2023-01-02 20:10:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 4, 6, "Alors attention, le kit de mise à niveau marche dans l'autre sens. Il permet de réutiliser les figurines de la première version avec la nouvelle. ;)", "2023-01-02 20:20:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 4, 3, "Désolé... Pas participé...", "2023-01-02 20:30:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 4, 1, "Bonne chance à leurs financements !", "2023-01-02 20:25:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 5, 4, "j'ais déjà pledgé Chronicles of wara.", "2023-01-02 20:05:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 5, 3, "Le pledge manager est ouvert ! Tu as trouvé le lien ?", "2023-01-02 20:55:00");
INSERT INTO comments(event_id, user_id, message, created_at) VALUES( 5, 2, "tu vas sur le site, tu te connectes, tu cliques sur boutique, puis sur pledge manager, puis tu fais tes choix", "2023-01-02 20:28:00");

GRANT ALL ON lesvoyageursdureve.* to WEBSITE@'%' IDENTIFIED BY 'password-db';
