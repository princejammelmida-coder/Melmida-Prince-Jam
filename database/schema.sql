
CREATE DATABASE IF NOT EXISTS esports_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE esports_system;


CREATE TABLE IF NOT EXISTS teams (
    team_id INT(11) NOT NULL AUTO_INCREMENT,
    team_name VARCHAR(100) NOT NULL,
    captain_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    game VARCHAR(50) NOT NULL,
    team_logo VARCHAR(255) DEFAULT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (team_id),
    UNIQUE KEY unique_team_name (team_name),
    UNIQUE KEY unique_team_email (email),
    INDEX idx_game (game),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS players (
    player_id INT(11) NOT NULL AUTO_INCREMENT,
    team_id INT(11) DEFAULT NULL,
    player_name VARCHAR(100) NOT NULL,
    game_username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    role VARCHAR(50) DEFAULT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id),
    INDEX idx_team_id (team_id),
    INDEX idx_email (email),
    CONSTRAINT fk_players_team 
        FOREIGN KEY (team_id) 
        REFERENCES teams(team_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS matches (
    match_id INT(11) NOT NULL AUTO_INCREMENT,
    match_name VARCHAR(100) NOT NULL,
    game VARCHAR(50) NOT NULL,
    match_date DATETIME NOT NULL,
    venue VARCHAR(255) DEFAULT NULL,
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (match_id),
    INDEX idx_match_date (match_date),
    INDEX idx_game (game),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS match_lineups (
    lineup_id INT(11) NOT NULL AUTO_INCREMENT,
    match_id INT(11) NOT NULL,
    team_id INT(11) NOT NULL,
    player_id INT(11) NOT NULL,
    position VARCHAR(50) DEFAULT NULL,
    is_substitute TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lineup_id),
    UNIQUE KEY unique_lineup (match_id, team_id, player_id),
    INDEX idx_match_id (match_id),
    INDEX idx_team_id (team_id),
    INDEX idx_player_id (player_id),
    CONSTRAINT fk_lineup_match 
        FOREIGN KEY (match_id) 
        REFERENCES matches(match_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_lineup_team 
        FOREIGN KEY (team_id) 
        REFERENCES teams(team_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_lineup_player 
        FOREIGN KEY (player_id) 
        REFERENCES players(player_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS users (
    user_id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'team_captain', 'player') NOT NULL DEFAULT 'player',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY unique_username (username),
    UNIQUE KEY unique_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO teams (team_name, captain_name, email, game, status) VALUES
('Phoenix Legends', 'John Doe', 'john@phoenix.com', 'Valorant', 'approved'),
('Dragon Warriors', 'Jane Smith', 'jane@dragon.com', 'League of Legends', 'approved'),
('Thunder Strike', 'Alex Johnson', 'alex@thunder.com', 'CS:GO', 'pending'),
('Shadow Ninjas', 'Mike Chen', 'mike@shadow.com', 'Dota 2', 'approved');

INSERT INTO players (team_id, player_name, game_username, email, phone, role) VALUES
(1, 'John Doe', 'PhoenixJohn', 'john@phoenix.com', '1234567890', 'Captain'),
(1, 'Mike Johnson', 'PhoenixMike', 'mike@phoenix.com', '1234567891', 'Duelist'),
(1, 'Sarah Williams', 'PhoenixSarah', 'sarah@phoenix.com', '1234567892', 'Controller'),
(1, 'Tom Anderson', 'PhoenixTom', 'tom@phoenix.com', '1234567893', 'Sentinel'),
(1, 'Lisa Brown', 'PhoenixLisa', 'lisa@phoenix.com', '1234567894', 'Initiator'),

(2, 'Jane Smith', 'DragonJane', 'jane@dragon.com', '1234567895', 'Captain'),
(2, 'Tom Brown', 'DragonTom', 'tom@dragon.com', '1234567896', 'Mid Laner'),
(2, 'Emma Davis', 'DragonEmma', 'emma@dragon.com', '1234567897', 'ADC'),
(2, 'Chris Wilson', 'DragonChris', 'chris@dragon.com', '1234567898', 'Support'),
(2, 'Ryan Taylor', 'DragonRyan', 'ryan@dragon.com', '1234567899', 'Top Laner'),

(3, 'Alex Johnson', 'ThunderAlex', 'alex@thunder.com', '1234567800', 'Captain/AWPer'),
(3, 'Kevin Lee', 'ThunderKevin', 'kevin@thunder.com', '1234567801', 'Entry Fragger'),
(3, 'David Park', 'ThunderDavid', 'david@thunder.com', '1234567802', 'Rifler'),

(4, 'Mike Chen', 'ShadowMike', 'mike@shadow.com', '1234567803', 'Captain/Position 1'),
(4, 'Steven Wang', 'ShadowSteven', 'steven@shadow.com', '1234567804', 'Position 2'),
(4, 'James Liu', 'ShadowJames', 'james@shadow.com', '1234567805', 'Position 3');

INSERT INTO matches (match_name, game, match_date, venue, status) VALUES
('Spring Championship Finals', 'Valorant', '2024-04-15 18:00:00', 'Online', 'scheduled'),
('League Cup Semifinals', 'League of Legends', '2024-04-20 20:00:00', 'Gaming Arena, Manila', 'scheduled'),
('CS:GO Masters', 'CS:GO', '2024-04-10 15:00:00', 'Online', 'completed'),
('Dota 2 Pro League', 'Dota 2', '2024-04-25 19:00:00', 'Esports Stadium', 'scheduled');

INSERT INTO match_lineups (match_id, team_id, player_id, position, is_substitute) VALUES
(1, 1, 1, 'Captain', 0),
(1, 1, 2, 'Duelist', 0),
(1, 1, 3, 'Controller', 0),
(1, 1, 4, 'Sentinel', 0),
(1, 1, 5, 'Initiator', 0),

(2, 2, 6, 'Captain', 0),
(2, 2, 7, 'Mid Lane', 0),
(2, 2, 8, 'ADC', 0),
(2, 2, 9, 'Support', 0),
(2, 2, 10, 'Top Lane', 0);
