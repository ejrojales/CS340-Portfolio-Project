
/*
    SETUP
*/
// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 8300;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.static('public'));

/*
    ROUTES
*/

app.get('/', function (req, res) {
    res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});

app.get('/customers', function (req, res) {
    let query1 = "SELECT customer_id as ID, cst_first_name as First_Name, cst_last_name as Last_Name, active as Active, email as Email, membership_id as Membership_ID FROM Customers;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('customers', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                            // an object where 'data' is equal to the 'rows' we
});                                                               // received back from the query

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
            res.redirect('/');
        }
    })
})

app.get('/memberships', function (req, res) {
    res.render('memberships');
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