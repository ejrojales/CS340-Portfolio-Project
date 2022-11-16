function deleteTrainer(trainerID) {
    let data = {
        id: trainerID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-trainer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log("Received 204 status");

            // Add the new data to the table
            deleteRow(trainerID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(trainerID) {
    let table = document.getElementById("trainers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {

        if (table.rows[i].cells[0].innerHTML == trainerID.toString()) {
            table.deleteRow(i);
            break;
        }
    }
};