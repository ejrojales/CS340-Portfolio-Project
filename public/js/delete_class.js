function deleteClass(classID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: classID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log("Received 204 status");

            deleteRow(classID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(classID) {
    let table = document.getElementById("classes-table");
    for (let i = 0, row; row = table.rows[i]; i++) {

        if (table.rows[i].cells[0].innerHTML == classID.toString()) {
            table.deleteRow(i);
            break;
        }
    }
}