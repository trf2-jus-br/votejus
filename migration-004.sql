CREATE TABLE voto (
	id INT NOT NULL AUTO_INCREMENT,
    eleicao INT NOT NULL,
    voto VARCHAR(128) NOT NULL,
    
    PRIMARY KEY(id),
    FOREIGN KEY(eleicao) REFERENCES election(election_id)
);
