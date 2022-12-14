// Citation for the following code:
// Date: 12/05/2022
// Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputMembership = document.getElementById("input-membership-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let membershipValue = inputMembership.value;
    let data;
    let membershipName;

    // If the membershipValue is an object: use JSON.parse and extract the membership name and value
    // else None option was selected: Convert empty string to Null in put route in app.js
    if (membershipValue != "") {
        let membershipinfo = JSON.parse(membershipValue);
        membershipName = Object.values(membershipinfo)[0]

        // Put our data we want to send in a javascript object
        data = {
            fullname: fullNameValue,
            membership: Object.keys(membershipinfo)[0]
        };
    } else {
        membershipName = membershipValue;
        data = {
            fullname: fullNameValue,
            membership: membershipValue,
        };
    }



    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(fullNameValue, membershipName);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(personID, membershipName) {
    let table = document.getElementById("customers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].cells[0].innerHTML == personID.toString()) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of membership
            let td = updateRowIndex.getElementsByTagName("td")[5];

            td.innerHTML = membershipName;
        }
    }
}
