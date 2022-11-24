
/*
    SETUP
*/
// Express
var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
PORT = 8300;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

app.get('/', function (req, res) {
    res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});

app.get('/customers', function (req, res) {
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.lname === undefined) {
        query1 = "SELECT customer_id as ID, cst_first_name as 'First Name', cst_last_name as 'Last Name', active as Active, email as Email, Memberships.membership_name as Membership FROM Customers inner join Memberships on Memberships.membership_id = Customers.membership_id";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT customer_id as ID, cst_first_name as 'First Name', cst_last_name as 'Last Name', active as Active, email as Email, Memberships.membership_name as Membership FROM Customers inner join Memberships on Memberships.membership_id = Customers.membership_id WHERE cst_last_name LIKE "${req.query.lname}%"`
    }

    let query2 = "SELECT * FROM Memberships;";  // Query for dynamic dropdown menu to display memberships

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let customers = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let memberships = rows
            res.render('customers', { data: customers, memberships: memberships });
        })

    })
});

app.post('/add-customer-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (cst_first_name, cst_last_name, email, membership_id) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-email']}', '${data['input-membership-id']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/customers');
        }
    })
})

app.delete('/delete-person-ajax/', function (req, res, next) {
    let data = req.body;
    let personID = parseInt(data.id);
    let deleteTrainer_Customer = `DELETE FROM Trainer_Customer WHERE customer_id = ?`;
    let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;
    // Run the 1st query
    db.pool.query(deleteTrainer_Customer, [personID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteCustomer, [personID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.put('/put-person-ajax', function (req, res, next) {
    let data = req.body;
    let email = data.email;
    let person = parseInt(data.fullname);


    let queryUpdateEmail = `UPDATE Customers SET email = ? WHERE Customers.customer_id = ?`;
    let selectCustomer = `SELECT * FROM Customers WHERE customer_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateEmail, [email, person], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectCustomer, [person], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/memberships', function (req, res) {
    query1 = "SELECT membership_id as ID, membership_name as Membership_Name, description as Description, duration as Duration FROM Memberships";
    db.pool.query(query1, function (error, rows, fields) {
        let memberships = rows;
        res.render('memberships', { data: memberships });
    })
});

app.post('/add-membership-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Memberships (membership_name, description, duration) VALUES ('${data['input-membershipname']}', '${data['input-description']}', '${data['input-duration']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/memberships');
        }
    })
})

app.delete('/delete-membership-ajax/', function (req, res, next) {
    let data = req.body;
    let membershipID = parseInt(data.id);
    let deleteMembership_Location = `DELETE FROM Membership_Location WHERE membership_id = ?`;
    let deleteMembership = `DELETE FROM Memberships WHERE membership_id = ?`;
    // Run the 1st query
    db.pool.query(deleteMembership_Location, [membershipID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteMembership, [membershipID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.get('/locations', function (req, res) {
    query1 = "SELECT location_id as ID, operating_hours as 'Operating Hours', phone_number as 'Phone Number', address as Address FROM Locations";
    db.pool.query(query1, function (error, rows, fields) {
        let locations = rows;
        res.render('locations', { data: locations });
    })
});

app.post('/add-location-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Locations (operating_hours, phone_number, address) VALUES ('${data['input-operatinghours']}', '${data['input-phonenumber']}', '${data['input-address']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/locations');
        }
    })
});

app.delete('/delete-location-ajax/', function (req, res, next) {
    let data = req.body;
    let locationID = parseInt(data.id);
    let deleteMembership_Location = `DELETE FROM Membership_Location WHERE location_id = ?`;
    let deleteLocation = `DELETE FROM Locations WHERE location_id = ?`;
    // Run the 1st query
    db.pool.query(deleteMembership_Location, [locationID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteLocation, [locationID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.get('/fitness_classes', function (req, res) {
    query1 = "SELECT class_id as ID, class_name as 'Class Name' FROM Fitness_Classes";
    db.pool.query(query1, function (error, rows, fields) {
        let classes = rows;
        res.render('fitness_classes', { data: classes });
    })
});

app.post('/add-class-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Fitness_Classes (class_name) VALUES ('${data['input-classname']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/fitness_classes');
        }
    })
});

app.delete('/delete-class-ajax/', function (req, res, next) {
    let data = req.body;
    let classID = parseInt(data.id);
    let deleteClass_Schedule = `DELETE FROM Class_Schedule WHERE class_id = ?`;
    let deleteClass = `DELETE FROM Fitness_Classes WHERE class_id = ?`;
    // Run the 1st query
    db.pool.query(deleteClass_Schedule, [classID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }

        else {
            db.pool.query(deleteClass, [classID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.get('/personal_trainers', function (req, res) {
    query1 = "SELECT trainer_id as ID, pt_first_name as 'First Name', pt_last_name as 'Last Name', phone_number as 'Phone Number', assigned_location as 'Assigned Location' FROM Personal_Trainers";
    db.pool.query(query1, function (error, rows, fields) {
        let trainers = rows;
        res.render('personal_trainers', { data: trainers });
    })
});

app.post('/add-trainer-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Personal_Trainers (pt_first_name, pt_last_name, phone_number) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-phonenumber']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/personal_trainers');
        }
    })
});

app.delete('/delete-trainer-ajax/', function (req, res, next) {
    let data = req.body;
    let trainerID = parseInt(data.id);
    let deleteTrainer_Customer = `DELETE FROM Trainer_Customer WHERE trainer_id = ?`;
    let deleteTrainer = `DELETE FROM Personal_Trainers WHERE trainer_id = ?`;
    // Run the 1st query
    db.pool.query(deleteTrainer_Customer, [trainerID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteTrainer, [trainerID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.get('/trainer_customer', function (req, res) {
    let query1 = 'SELECT tc_id as ID, Concat(Customers.cst_first_name, " ", Customers.cst_last_name) as "Customer", Concat(Personal_Trainers.pt_first_name, " ", Personal_Trainers.pt_last_name) as "Personal Trainer" from Trainer_Customer inner join Customers on Customers.customer_id = Trainer_Customer.customer_id inner join Personal_Trainers on Personal_Trainers.trainer_id = Trainer_Customer.trainer_id';
    let query2 = "SELECT * FROM Customers;";
    let query3 = "SELECT * FROM Personal_Trainers;";

    db.pool.query(query1, function (error, rows, fields) {
        let trainer_customer = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let customers = rows

            db.pool.query(query3, (error, rows, fields) => {
                let trainers = rows
                res.render('trainer_customer', { data: trainer_customer, customers: customers, trainers: trainers });
            })
        })

    })
});

app.post('/add-trainercustomer-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Trainer_Customer (customer_id, trainer_id) VALUES ('${data['input-customer']}', '${data['input-trainer']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/trainer_customer');
        }
    })
});

app.delete('/delete-trainercustomer-ajax/', function (req, res, next) {
    let data = req.body;
    let tcID = parseInt(data.id);
    let deleteTrainer_Customer = `DELETE FROM Trainer_Customer WHERE tc_id = ?`;

    db.pool.query(deleteTrainer_Customer, [tcID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.get('/class_schedule', function (req, res) {
    let query1 = "SELECT schedule_id as 'Schedule ID', time as Time, Locations.address as Location, Fitness_Classes.class_name as Class, Concat(Personal_Trainers.pt_first_name, ' ', Personal_Trainers.pt_last_name) as Instructor FROM Class_Schedule inner join Locations on Locations.location_id = Class_Schedule.location_id inner join Fitness_Classes on Fitness_Classes.class_id = Class_Schedule.class_id inner join Personal_Trainers on Personal_Trainers.trainer_id = Class_Schedule.trainer_id";
    let query2 = "Select * from Personal_Trainers";
    let query3 = "Select * from Fitness_Classes"
    let query4 = "Select * from Locations"

    db.pool.query(query1, function (error, rows, fields) {
        let schedule = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let instructors = rows

            db.pool.query(query3, (error, rows, fields) => {
                let classes = rows

                db.pool.query(query4, (error, rows, fields) => {
                    let locations = rows;
                    res.render('class_schedule', { data: schedule, instructors: instructors, classes: classes, locations: locations });

                })
            })
        })

    })
});

app.post('/add-schedule-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Class_Schedule (time, location_id, class_id, trainer_id) VALUES ('${data['input-time']}', '${data['input-location']}', '${data['input-class']}', '${data['input-instructor']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/class_schedule');
        }
    })
});

app.delete('/delete-schedule-ajax/', function (req, res, next) {
    let data = req.body;
    let scheduleID = parseInt(data.id);
    let deleteClass_Schedule = `DELETE FROM Class_Schedule WHERE schedule_id = ?`;

    db.pool.query(deleteClass_Schedule, [scheduleID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.get('/membership_location', function (req, res) {
    let query1 = "Select membership_location_id as ID, Memberships.membership_name as 'Membership Name', Locations.address as 'Location Access' from Membership_Location inner join Memberships on Memberships.membership_id = Membership_Location.membership_id inner join Locations on Locations.location_id = Membership_Location.location_id";
    let query2 = "Select * from Memberships";
    let query3 = "Select * from Locations";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let membership_location = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let memberships = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let locations = rows;
                res.render('membership_location', { data: membership_location, memberships: memberships, locations: locations });
            })
        })

    })
});

app.post('/add-membershiplocation-form', function (req, res) {
    let data = req.body;

    query1 = `INSERT INTO Membership_Location (membership_id, location_id) VALUES ('${data['input-membership']}', '${data['input-location']}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/membership_location');
        }
    })
});

app.delete('/delete-membershiplocation-ajax/', function (req, res, next) {
    let data = req.body;
    let memloc = parseInt(data.id);
    let deleteMembership_Location = `DELETE FROM Membership_Location WHERE membership_location_id = ?`;

    db.pool.query(deleteMembership_Location, [memloc], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});