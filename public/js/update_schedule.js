// Get the objects we need to modify
let updateScheduleForm = document.getElementById('update-schedule-form-ajax');

// Modify the objects we need
updateScheduleForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSchedule = document.getElementById("input-schedule-update");
    let inputTime = document.getElementById("input-time-update");
    let inputLocation = document.getElementById("input-location-update");
    let inputClass = document.getElementById("input-class-update");
    let inputInstructor = document.getElementById("input-instructor-update");

    // Get the values from the form fields
    let scheduleValue = inputSchedule.value;
    let timeValue = inputTime.value;
    let locationValue = inputLocation.value;
    let classValue = inputClass.value;
    let instructorValue = inputInstructor.value;

    let data = {
        scheduleID: scheduleValue,
        time: timeValue,
        location: locationValue,
        class: classValue,
        instructor: instructorValue
    };




    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-schedule-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(scheduleValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(scheduleID,) {
    let table = document.getElementById("customers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].cells[0].innerHTML == scheduleID.toString()) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            console.log(updateRowIndex);

            // Get td of membership
            let td = updateRowIndex.getElementsByTagName("td")[3];
            console.log(td);
            console.log(td.innerHTML)

            //td.innerHTML = membershipName;
        }
    }
}
