
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
        query1 = "SELECT customer_id as ID, cst_first_name as First_Name, cst_last_name as Last_Name, active as Active, email as Email, Memberships.membership_name as Membership FROM Customers inner join Memberships on Memberships.membership_id = Customers.membership_id";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT customer_id as ID, cst_first_name as First_Name, cst_last_name as Last_Name, active as Active, email as Email, membership_id as Membership_ID FROM Customers WHERE cst_last_name LIKE "${req.query.lname}%"`
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
    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
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
    res.render('locations');
});

app.get('/fitness_classes', function (req, res) {
    res.render('fitness_classes');
});

app.get('/personal_trainers', function (req, res) {
    res.render('personal_trainers');
});

app.get('/trainer_customer', function (req, res) {
    res.render('trainer_customer');
});

app.get('/class_schedule', function (req, res) {
    res.render('class_schedule');
});

app.get('/membership_location', function (req, res) {
    res.render('membership_location');
});

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});