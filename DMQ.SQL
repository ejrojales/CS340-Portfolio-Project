-- CUSTOMER SECTION

-- get all Customer IDs and Names 
SELECT customer_id, cst_first_name, cst_last_name FROM Customers

-- Add a new Customer
INSERT INTO Customers (cst_first_name, cst_last_name, active, email) VALUES (:cst_first_nameInput, :cst_last_nameInput, 1, :emailInput)

-- get all customers IDs, names, membership type, and active status for purposes of member inventory
SELECT customer_id, cst_first_name, cst_last_name, membership_id, active FROM Customers 

-- get a single customers's data for either information purposes or data updating purposes
SELECT customer_id, cst_first_name, cst_last_name, active, email, membership_id FROM Customers WHERE customer_id = :customer_ID_selected_from_customers_page

-- Inactivate a Customer
UPDATE Customers SET active = :activeInput WHERE customer_id= :customer_ID_selected_from_customers_page

-- Update Customer Information
UPDATE Customers SET cst_frst_name = :cst_first_nameInput, cst_last_name = :cst_last_nameInput, email = :emailInput WHERE customer_id= :customer_ID_selected_from_customers_page


-- MEMBERSHIP SECTION

-- get all Membership IDs, names, description, duration
SELECT membership_id, membership_name, description, duration FROM Memberships

-- Add a new Membership
INSERT INTO Memberships (membership_name, description, duration) VALUES (:membership_nameInput, :descriptionInput, :durationInput)




-- LOCATION SECTION

-- get all Location IDs, operating hours, phone numbers, and addresses
SELECT location_id, operating_hours, phone_number, address FROM Locations

-- Add a new Location
INSERT INTO Locations (operating_hours, phone_number, address) VALUES (:operating_hoursInput, :phone_numberInput, :addressInput)




-- PERSONAL TRAINER SECTION

-- get all Personal Trainer IDs, first names, last names, phone numbers, and assigned locations
SELECT trainer_id, pt_first_name, pt_last_name, phone_number, assigned_location FROM Personal_Trainers

-- Populate locations dropdown for adding new PT
SELECT location_id FROM Locations

-- Add a new Personal Trainer
INSERT INTO Personal_Trainers (pt_first_name, pt_last_name, phone_number, assigned_location) VALUES (:pt_first_nameInput, :pt_last_nameInput, phone_numberInput, :assigned_location_from_dropdown_Input)

-- Get Customer names for purpose of dropdown list
SELECT customer_id, cst_first_name, cst_last_name FROM Customers

-- Get Trainer names for purpose of dropdown list
SELECT trainer_id, pt_first_name, pt_last_name FROM Personal_Trainers

-- Populate trainer dropdown for Trainer_Customer
SELECT trainer_id FROM Trainer_Customer

-- Associate a Customer with a Personal Trainer
INSERT INTO Trainer_Customer (customer_id, trainer_id) VALUES (:customer_id_from_dropdown_Input, :trainer_id_from_dropdown_Input)

-- Dissassociate a Customer with a Personal Trainer
DELETE FROM Trainer_Customer WHERE id = :customer_id_from_dropdown_Input



-- CLASS SCHEDULE SECTION

-- Get All Class Schedules
SELECT schedule_id, time, location_id, class_id, trainer_id FROM Class_Schedule

-- Get Location id for purpose of Class Schedule
SELECT location_id FROM Locations
-- Get Class id for purpose of Class Schedule
SELECT class_id, class_name FROM Fitness_Classes
-- Get Trainer id for purpose of Class Schedule
SELECT trainer_id, pt_first_name, pt_last_name FROM Personal_Trainers

-- Create a New Class Schedule
INSERT INTO Class_Schedule (time, location_id, class_id, trainer_id) VALUES (:timeInput, location_id_from_dropdownInput, class_id_from_dropdownInput, :trainer_id_from_dropdownInput)



-- FITNESS CLASS SECTION

-- Get All Fitness Classes
SELECT class_id, class_name FROM Fitness_Classes

-- Create a new Fitness Class
INSERT INTO Fitness_Classes (class_name) VALUES (:class_nameInput)



-- MEMBERSHIP LOCATION SECTION

-- Get All Membership Locations
SELECT membership_location_id, membership_id, location_id FROM Membership_Location

-- Get membership id for purpose of dropdown
SELECT membership_id, membership_name FROM Memberships
-- Get Location id for purpose of dropdown
SELECT location_id FROM Locations

-- Associate a Membership with a Location
INSERT INTO Membership_Location (membership_id, location_id) VALUES (:membership_id_from_dropdown_Input, :location_id_from_dropdown_Input);
