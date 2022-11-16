function deletePerson(personID) {
    console.log(personID);
    // Put our data we want to send in a javascript object
    let data = {
        id: personID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log("Received 204 status");

            // Add the new data to the table
            deleteRow(personID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    console.log(data);
    console.log(JSON.stringify(data));
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(personID) {
    let table = document.getElementById("customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // getAtt = table.rows[i].cells[0].innerHTML
        // console.log(getAtt)
        if (table.rows[i].cells[0].innerHTML == personID.toString()) {
            table.deleteRow(i);
            deleteDropDownMenu(personID);
            break;
        }
    }
}

function deleteDropDownMenu(personID) {
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(personID)) {
            selectMenu[i].remove();
            break;
        }

    }
}