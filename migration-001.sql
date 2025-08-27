CREATE DATABASE `votejus`;

use `votejus`;

CREATE TABLE `candidate` (
  `candidate_id` int NOT NULL AUTO_INCREMENT,
  `election_id` int NOT NULL,
  `candidate_name` varchar(255) NOT NULL,
  `candidate_votes` int NOT NULL,
  PRIMARY KEY (`candidate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=738 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `election` (
  `election_id` int NOT NULL AUTO_INCREMENT,
  `election_name` varchar(255) NOT NULL,
  `election_administrator_email` varchar(45) NOT NULL,
  `election_start` datetime DEFAULT NULL,
  `election_end` datetime DEFAULT NULL,
  `numero_selecoes_permitidas` int DEFAULT NULL,
  `embaralhar_candidatos` bit(1) DEFAULT NULL,
  `ocultar_eleitores` bit(1) DEFAULT b'0',
  PRIMARY KEY (`election_id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `voter` (
  `voter_id` int NOT NULL AUTO_INCREMENT,
  `election_id` int NOT NULL,
  `voter_name` varchar(255) NOT NULL,
  `voter_email` varchar(255) NOT NULL,
  `voter_vote_datetime` datetime DEFAULT NULL,
  `voter_vote_ip` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`voter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4687 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `voto` (
  `id` varchar(100) NOT NULL,
  `eleicao` int NOT NULL,
  `voto` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eleicao` (`eleicao`),
  CONSTRAINT `voto_ibfk_1` FOREIGN KEY (`eleicao`) REFERENCES `election` (`election_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
