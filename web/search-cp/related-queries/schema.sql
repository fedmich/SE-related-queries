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