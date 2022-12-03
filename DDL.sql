-- MySQL Workbench Forward Engineering

-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Group 49, CS 340
-- Members: Aaron Wheaton, Emmanuel Rojales
-- This Data Definition Query file corresponds to Group 49's CS340 final project deliverables.

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table Memberships`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Memberships` (
  `membership_id` INT NOT NULL AUTO_INCREMENT,
  `membership_name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `duration` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`membership_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Customers` (
  `customer_id` INT NOT NULL AUTO_INCREMENT,
  `cst_first_name` VARCHAR(45) NOT NULL,
  `cst_last_name` VARCHAR(45) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `email` VARCHAR(45),
  `membership_id` INT,
  PRIMARY KEY (`customer_id`),
  INDEX `fk_Customers_Memberships1_idx` (`membership_id` ASC) VISIBLE,
  CONSTRAINT `fk_Customers_Memberships1`
    FOREIGN KEY (`membership_id`)
    REFERENCES `Memberships` (`membership_id`)
    ON DELETE SET NULL
    )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Locations` (
  `location_id` INT NOT NULL AUTO_INCREMENT,
  `operating_hours` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`location_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Personal_Trainers`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Personal_Trainers` (
  `trainer_id` INT NOT NULL AUTO_INCREMENT,
  `pt_first_name` VARCHAR(45) NOT NULL,
  `pt_last_name` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `assigned_location` INT NOT NULL,
  PRIMARY KEY (`trainer_id`),
  INDEX `fk_Personal_Trainers_Locations1_idx` (`assigned_location` ASC) VISIBLE,
  CONSTRAINT `fk_Personal_Trainers_Locations1`
    FOREIGN KEY (`assigned_location`)
    REFERENCES `Locations` (`location_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Trainer_Customer`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Trainer_Customer` (
  `tc_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `trainer_id` INT NOT NULL,
  UNIQUE (`customer_id`, `trainer_id`),
  PRIMARY KEY (`tc_id`),
  INDEX `fk_Trainer_Customer_Customers1_idx` (`customer_id` ASC) VISIBLE,
  INDEX `fk_Trainer_Customer_Personal_Trainers1_idx` (`trainer_id` ASC) VISIBLE,
  CONSTRAINT `fk_Trainer_Customer_Customers1`
    FOREIGN KEY (`customer_id`)
    REFERENCES `Customers` (`customer_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Trainer_Customer_Personal_Trainers1`
    FOREIGN KEY (`trainer_id`)
    REFERENCES `Personal_Trainers` (`trainer_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Membership_Location`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Membership_Location` (
  `membership_location_id` INT NOT NULL AUTO_INCREMENT,
  `membership_id` INT,
  `location_id` INT,
  PRIMARY KEY (`membership_location_id`),
  INDEX `fk_Membership_Location_Memberships1_idx` (`membership_id` ASC) VISIBLE,
  INDEX `fk_Membership_Location_Locations1_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_Membership_Location_Memberships1`
    FOREIGN KEY (`membership_id`)
    REFERENCES `Memberships` (`membership_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Membership_Location_Locations1`
    FOREIGN KEY (`location_id`)
    REFERENCES `Locations` (`location_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Fitness_Classes`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Fitness_Classes` (
  `class_id` INT NOT NULL AUTO_INCREMENT,
  `class_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`class_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Class_Schedule`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `Class_Schedule` (
  `schedule_id` INT NOT NULL AUTO_INCREMENT,
  `time` VARCHAR(45) NOT NULL,
  `location_id` INT,
  `class_id` INT,
  `trainer_id` INT,
  PRIMARY KEY (`schedule_id`),
  INDEX `fk_Class_Schedule_Locations1_idx` (`location_id` ASC) VISIBLE,
  INDEX `fk_Class_Schedule_Fitness_Classes1_idx` (`class_id` ASC) VISIBLE,
  INDEX `fk_Class_Schedule_Personal_Trainers1_idx` (`trainer_id` ASC) VISIBLE,
  CONSTRAINT `fk_Class_Schedule_Locations1`
    FOREIGN KEY (`location_id`)
    REFERENCES `Locations` (`location_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Class_Schedule_Fitness_Classes1`
    FOREIGN KEY (`class_id`)
    REFERENCES `Fitness_Classes` (`class_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Class_Schedule_Personal_Trainers1`
    FOREIGN KEY (`trainer_id`)
    REFERENCES `Personal_Trainers` (`trainer_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


INSERT INTO `Memberships` (`membership_name`, `description`, `duration`) VALUES ('General - 60', 'Access to locations 1 & 2', '60 Days');
INSERT INTO `Memberships` (`membership_name`, `description`, `duration`) VALUES ('General - 365', 'Access to locations 1 & 2', '365 Days');
INSERT INTO `Memberships` (`membership_name`, `description`, `duration`) VALUES ('Premium - 365', 'All access', '365 days');

INSERT INTO `Customers` (`cst_first_name`, `cst_last_name`, `email`, `membership_id`) VALUES ('John', 'Smith', 'johnsmith@gmail.com', '1');
INSERT INTO `Customers` (`cst_first_name`, `cst_last_name`, `email`, `membership_id`) VALUES ('Sarah', 'Jane', 'sarahjane@yahoo.com', '2');
INSERT INTO `Customers` (`cst_first_name`, `cst_last_name`, `email`, `membership_id`) VALUES ('Kyle', 'Jones', 'kylejones@yahoo.com', '3');

INSERT INTO `Fitness_Classes` (`class_name`) VALUES ('Yoga');
INSERT INTO `Fitness_Classes` (`class_name`) VALUES ('Zumba');
INSERT INTO `Fitness_Classes` (`class_name`) VALUES ('Pilates');

INSERT INTO `Locations` (`operating_hours`, `phone_number`, `address`) VALUES ('8:00 - 21:00', '123-456-8910', '7292 Dictum Av.');
INSERT INTO `Locations` (`operating_hours`, `phone_number`, `address`) VALUES ('8:00 - 21:00', '123-563-7401', '5587 Nunc. Avenue');
INSERT INTO `Locations` (`operating_hours`, `phone_number`, `address`) VALUES ('5:00 - 23:00', '123-686-2121', '5037 Diam Rd.');

INSERT INTO `Personal_Trainers` (`pt_first_name`, `pt_last_name`, `phone_number`, `assigned_location`) VALUES ('Chris', 'Bumstead', '123-421-0091', '1');
INSERT INTO `Personal_Trainers` (`pt_first_name`, `pt_last_name`, `phone_number`, `assigned_location`) VALUES ('Ronnie', 'Coleman', '123-543-1212', '2');
INSERT INTO `Personal_Trainers` (`pt_first_name`, `pt_last_name`, `phone_number`, `assigned_location`) VALUES ('Manny', 'Pacquiao', '123-988-0912', '3');

INSERT INTO `Class_Schedule` (`time`, `location_id`, `class_id`, `trainer_id`) VALUES ('10:00 - 11:00', '1', '1', '1');
INSERT INTO `Class_Schedule` (`time`, `location_id`, `class_id`, `trainer_id`) VALUES ('8:00 - 9:00', '2', '2', '2');
INSERT INTO `Class_Schedule` (`time`, `location_id`, `class_id`, `trainer_id`) VALUES ('18:00 - 19:00', '3', '3', '3');

INSERT INTO `Trainer_Customer` (`customer_id`, `trainer_id`) VALUES ('1', '2');
INSERT INTO `Trainer_Customer` (`customer_id`, `trainer_id`) VALUES ('2', '1');
INSERT INTO `Trainer_Customer` (`customer_id`, `trainer_id`) VALUES ('3', '3');

INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('1', '1');
INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('1', '2');
INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('2', '1');
INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('2', '2');
INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('3', '1');
INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('3', '2');
INSERT INTO `Membership_Location` (`membership_id`, `location_id`) VALUES ('3', '3');


SET FOREIGN_KEY_CHECKS=1;
COMMIT;

-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

