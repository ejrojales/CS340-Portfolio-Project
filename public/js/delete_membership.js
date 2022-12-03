// Citation for the following code:
// Date: 12/05/2022
// Copied from: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteMembership(membershipID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: membershipID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-membership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log("Received 204 status");

            deleteRow(membershipID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(membershipID) {
    let table = document.getElementById("memberships-table");
    for (let i = 0, row; row = table.rows[i]; i++) {

        if (table.rows[i].cells[0].innerHTML == membershipID.toString()) {
            table.deleteRow(i);
            break;
        }
    }
}