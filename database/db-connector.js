// Citation for the following code:
// Date: 12/05/2022
// Copied from: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_rojalese',
    password: '8819',
    database: 'cs340_rojalese'
})

// Export it for use in our application
module.exports.pool = pool;