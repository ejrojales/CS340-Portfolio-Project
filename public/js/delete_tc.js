function deleteTrainerCustomer(tcID) {
    let data = {
        id: tcID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-trainercustomer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log("Received 204 status");

            // Add the new data to the table
            deleteRow(tcID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(tcID) {
    let table = document.getElementById("trainercustomer-table");
    for (let i = 0, row; row = table.rows[i]; i++) {

        if (table.rows[i].cells[0].innerHTML == tcID.toString()) {
            table.deleteRow(i);
            break;
        }
    }
};