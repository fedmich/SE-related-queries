CREATE TABLE `queries` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`query_text` VARCHAR(255) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT '',
	PRIMARY KEY (`id`),
	UNIQUE INDEX `query_text` (`query_text`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;




CREATE TABLE `related_queries` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`query_id` INT(11) NOT NULL,
	`related_query_text` VARCHAR(255) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT '',
	PRIMARY KEY (`id`),
	INDEX `query_id` (`query_id`),
	CONSTRAINT `related_queries_ibfk_1` FOREIGN KEY (`query_id`) REFERENCES `queries` (`id`) ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
