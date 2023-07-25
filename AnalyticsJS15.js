

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
    drawVacancyByDepartmentChart(data)
    drawVacancyStatusChart(data)
}


function drawVacancyByDepartmentChart(data) {
    // Assuming jsonResponse is already defined with your JSON data
    var jsonResponse = data;

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

    // Create the data table with flipped axes
    var flippedData = data.map(row => [row[1], row[0]]); // Interchange x and y values
    var dataTable = google.visualization.arrayToDataTable(flippedData);

    // Set chart options with flipped axes and no legend
    var options = {
      chartArea: { width: '50%' },
      hAxis: { title: 'Number of Vacancies', minValue: 0 }, // Flipped: Number of Vacancies as x-axis
      vAxis: { title: 'Department' }, // Flipped: Department as y-axis
      legend: 'none' // Remove the legend
    };

      var chart = new google.visualization.BarChart(document.getElementById('vacanciesByDepartment'));
      chart.draw(dataTable, options);
 
  }


  function drawVacancyStatusChart(data) {
    // Assuming jsonResponse is already defined with your JSON data
    var jsonResponse = data;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Count');

    var statusCount = {};
    jsonResponse.value.forEach(vacancy => {
      var status = vacancy.Status;
      statusCount[status] = statusCount[status] ? statusCount[status] + 1 : 1;
    });

    Object.keys(statusCount).forEach(status => {
      data.addRow([status, statusCount[status]]);
    });

    var options = {
      title: 'Vacancy Status Distribution',
      pieHole: 0.4, // Set the pie hole size to create a donut chart
    };

    // Add the donut chart container
    $('#vacancy-reports').append(`<div class='report-wrapper'>
    <p class='reportTitle'> Vacancy Status </p>
    <div id="vacanciesStatus"></div>
    </div>`);

    var chart = new google.visualization.PieChart(document.getElementById('vacanciesStatus'));
    chart.draw(data, options);
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
