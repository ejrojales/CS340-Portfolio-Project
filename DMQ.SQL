-- Group 49, CS 340
-- Members: Aaron Wheaton, Emmanuel Rojales
-- This Data Manipulation Query file corresponds to Group 49's CS340 final project deliverables.

-- CUSTOMER SECTION

-- get all Customer IDs and Names 
SELECT customer_id as ID, cst_first_name as First_Name, cst_last_name as Last_Name, active as Active, email as Email, membership_id FROM Customers

-- get Customer IDs and Names, Inner Join with Membership for dropdown list
SELECT customer_id as ID, cst_first_name as First_Name, cst_last_name as Last_Name, active as Active, email as Email, Memberships.membership_name as Membership FROM Customers INNER JOIN Memberships on Memberships.membership_id = Customers.membership_id;

-- Add a new Customer
INSERT INTO Customers (cst_first_name, cst_last_name, active, email, membership_id) VALUES (:cst_first_nameInput, :cst_last_nameInput, 1, :emailInput, :membership_idInput)

-- get all customers IDs, names, membership type, and active status for purposes of member inventory
SELECT customer_id, cst_first_name, cst_last_name, membership_id, active FROM Customers 

-- get a single customers's data for either information purposes or data updating purposes
SELECT customer_id, cst_first_name, cst_last_name, active, email, membership_id FROM Customers WHERE customer_id = :customer_ID_selected_from_customers_page

-- Inactivate a Customer
UPDATE Customers SET active = :activeInput WHERE customer_id= :customer_ID_selected_from_customers_page

-- Update Customer Information
UPDATE Customers SET cst_frst_name = :cst_first_nameInput, cst_last_name = :cst_last_nameInput, email = :emailInput WHERE customer_id= :customer_ID_selected_from_customers_page

-- Get Customer names for purpose of dropdown list
SELECT customer_id, cst_first_name, cst_last_name FROM Customers

-- Delete a customer from the customers table based off customer id
DELETE FROM Customers WHERE id = :customer_id_from_dropdown_Input


-- MEMBERSHIP SECTION

-- get all Membership IDs, names, description, duration
SELECT membership_id, membership_name, description, duration FROM Memberships

-- Add a new Membership
INSERT INTO Memberships (membership_name, description, duration) VALUES (:membership_nameInput, :descriptionInput, :durationInput)

-- Get membership id, membership name, and description for dropdown
SELECT membership_id, membership_name, description FROM Memberships

-- Delete a membership from the membership table based off id from dropdown
DELETE FROM Memberships WHERE id = :membership_id_from_dropdown_Input


-- LOCATION SECTION

-- get all Location IDs, operating hours, phone numbers, and addresses
SELECT location_id, operating_hours, phone_number, address FROM Locations

--SELECT query with aliases for location page
SELECT location_id as ID, operating_hours as 'Operating Hours', phone_number as 'Phone Number', address as Address FROM Locations

-- Add a new Location
INSERT INTO Locations (operating_hours, phone_number, address) VALUES (:operating_hoursInput, :phone_numberInput, :addressInput)

-- Get location id and address for dropdown
SELECT location_id, address FROM Locations

-- Delete a location based off the location_id
DELETE FROM Locations WHERE id = :location_id_from_dropdown_Input




-- PERSONAL TRAINER SECTION

-- get all Personal Trainer IDs, first names, last names, phone numbers, and assigned locations
SELECT trainer_id, pt_first_name, pt_last_name, phone_number, assigned_location FROM Personal_Trainers

-- Select query for trainers with Aliases
SELECT trainer_id as ID, pt_first_name as 'First Name', pt_last_name as 'Last Name', phone_number as 'Phone Number' FROM Personal_Trainers

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

-- Select query for Trainer_Customer with Alises and concatenation
SELECT tc_id as ID, Concat(Customers.cst_first_name, " ", Customers.cst_last_name) as "Customer", Concat(Personal_Trainers.pt_first_name, " ", Personal_Trainers.pt_last_name) as "Personal Trainer" from Trainer_Customer INNER JOIN Customers on Customers.customer_id = Trainer_Customer.customer_id INNER JOIN Personal_Trainers on Personal_Trainers.trainer_id = Trainer_Customer.trainer_id

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

-- Get class id, trainer id, and location id from class schedules
SELECT class_id, trainer_id, location_id FROM Class_Schedule

-- Delete a class from the class schedule
DELETE FROM Class_Schedule WHERE id = :class_id_from_dropdown_Input


-- FITNESS CLASS SECTION

-- Get All Fitness Classes
SELECT class_id, class_name FROM Fitness_Classes

-- Create a new Fitness Class
INSERT INTO Fitness_Classes (class_name) VALUES (:class_nameInput)

-- Get Class id and name from Fitness Classes
SELECT class_id, class_name FROM Fitness_Classes

-- Select query with Aliases for classes
SELECT class_id as ID, class_name as 'Class Name' FROM Fitness_Classes

-- Delete a class from the fitness classes table
DELETE FROM Fitness_Classes WHERE id = :class_id_from_dropdown_Input


-- MEMBERSHIP LOCATION SECTION

-- Get All Membership Locations
SELECT membership_location_id, membership_id, location_id FROM Membership_Location

-- Get membership id for purpose of dropdown
SELECT membership_id, membership_name FROM Memberships
-- Get Location id for purpose of dropdown
SELECT location_id FROM Locations

-- Associate a Membership with a Location
INSERT INTO Membership_Location (membership_id, location_id) VALUES (:membership_id_from_dropdown_Input, :location_id_from_dropdown_Input);

-- Get Membership location id, membership id, and location id for dropdown
SELECT membership_location_id, membership_id, location_id FROM Membership_Location

-- Delete a value from Membership Location table
DELETE FROM Membership_Location WHERE id = :membership_location_id_from_dropdown_Input
