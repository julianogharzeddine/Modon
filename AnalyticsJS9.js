

$(document).ready(function () {

    setTimeout(function(){
        // Load the Google Charts API and draw the chart when the page loads
       google.charts.load('current', { 'packages': ['corechart'] });
       google.charts.setOnLoadCallback(initializeDrawChart)
     
    } , 3000)
  
})

function initializeDrawChart(){


    fetchVacancies()
    .then(function (data) {
        waitForReportsWrapperRender(data)
    })
    .catch(function (error) {
        console.error(error);
    });

}

// Wait for the Card Wrapper

function waitForReportsWrapperRender(data) {
    if ($('#vacancy-reports').length > 0) {

        renderReports(data);
    } else {
        setTimeout(waitForReportsWrapperRender, 500);
    }
}

function renderReports(data) {
    drawChart(data)
}


function drawChart(data) {
    // Parse the JSON response (replace this with your actual JSON response)
    var jsonResponse = data

    // Extract data from the JSON and organize it into an array of arrays
    var data = [['Department', 'Number of Vacancies']];
    jsonResponse.value.forEach(vacancy => {
        var deptName = vacancy.DeptName;
        var vacancyCount = 1; // Assuming each vacancy is counted once
        var existingIndex = data.findIndex(row => row[0] === deptName);
        if (existingIndex !== -1) {
            data[existingIndex][1] += vacancyCount;
        } else {
            data.push([deptName, vacancyCount]);
        }
    });

    // Create the data table
    var dataTable = google.visualization.arrayToDataTable(data);

    // Set chart options
    var options = {
        title: 'Vacancies by Department',
        chartArea: { width: '50%' },
        hAxis: { title: 'Number of Vacancies', minValue: 0 },
        vAxis: { title: 'Department' }
    };

    // Instantiate and draw the chart, passing in the data and options
    var chart = new google.visualization.BarChart(document.getElementById('vacancy-reports'));
    chart.draw(dataTable, options);
}





function fetchVacancies() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/Recruitment_GetVacancies`,
            dataType: 'json',
            crossDomain: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent("sp_admin" + ':' + "P@ssw0rd"))));
                xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            },
            success: function (json_data) {
                resolve(json_data);
            },
            error: function () {
                reject('Failed to Load Investigations!');
            }
        });
    });
}
