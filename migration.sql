CREATE DATABASE votejus;

CREATE TABLE `votejus`.`election` (
  `election_id` INT NOT NULL AUTO_INCREMENT,
  `election_name` VARCHAR(255) NOT NULL,
  `election_administrator_email` VARCHAR(45) NOT NULL,
  `election_start` DATETIME NULL,
  `election_end` DATETIME NULL,
  PRIMARY KEY (`election_id`));

CREATE TABLE `votejus`.`voter` (
  `voter_id` INT NOT NULL AUTO_INCREMENT,
  `election_id` INT NOT NULL,
  `voter_name` VARCHAR(255) NOT NULL,
  `voter_email` VARCHAR(255) NOT NULL,
  `voter_vote_datetime` DATETIME NULL,
  `voter_vote_ip` VARCHAR(45) NULL,
  PRIMARY KEY (`voter_id`));

CREATE TABLE `votejus`.`candidate` (
  `candidate_id` INT NOT NULL AUTO_INCREMENT,
  `election_id` INT NOT NULL,
  `candidate_name` VARCHAR(255) NOT NULL,
  `candidate_votes` INT NOT NULL,
  PRIMARY KEY (`candidate_id`));

