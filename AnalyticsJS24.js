

$(document).ready(function () {

    setTimeout(function () {
        // Load the Google Charts API and draw the chart when the page loads
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(initializeDrawChart)

    }, 3000)

})

function initializeDrawChart() {


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
    drawVacanciesByQualTypeChart(data)
    drawVacanciesByJobTitleChart(data)
}



function drawVacancyByDepartmentChart(data) {
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
        chartArea: { width: '50%' },
        hAxis: { title: 'Number of Vacancies', minValue: 0 },
        vAxis: { title: 'Department' },
        legend: 'none'
    };


    $('#vacancy-reports').append(`<div class='report-wrapper'>
    <p class='reportTitle'> Vacancies by Department </p>
    <div id="vacanciesByDepartment"></div>
    </div>`)

    // Instantiate and draw the chart, passing in the data and options
    var chart = new google.visualization.BarChart(document.getElementById('vacanciesByDepartment'));
    chart.draw(dataTable, options);
}


function drawVacanciesByJobTitleChart(data) {
    // Assuming jsonResponse is already defined with your JSON data
    var jsonResponse = data;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Job Title');
    data.addColumn('number', 'Number of Vacancies');

    var jobTitleCount = {};
    jsonResponse.value.forEach(vacancy => {
      var jobTitle = vacancy.JobTitle;
      jobTitleCount[jobTitle] = jobTitleCount[jobTitle] ? jobTitleCount[jobTitle] + 1 : 1;
    });

    Object.keys(jobTitleCount).forEach(jobTitle => {
      data.addRow([jobTitle, jobTitleCount[jobTitle]]);
    });

    var options = {
      chartArea: { width: '50%' },
      hAxis: {
        title: 'Number of Vacancies',
        minValue: 0,
        slantedText: true, // Rotate the labels
        slantedTextAngle: 45 // Angle of rotation
      },
      vAxis: { title: 'Job Title' },
      legend: 'none'
    };

    // Add the vacanciesByJobTitle chart container
    $('#vacancy-reports').append(`<div class='report-wrapper'>
    <p class='reportTitle'> Vacancies By Job Title </p>
    <div id="vacanciesByJobTitle"></div>
    </div>`);

    var chart = new google.visualization.ColumnChart(document.getElementById('vacanciesByJobTitle'));
    chart.draw(data, options);
  }





function drawVacanciesByQualTypeChart(data) {
    var jsonResponse = data;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Qualification Type');
    data.addColumn('number', 'Beginner');
    data.addColumn('number', 'Intermediate');
    data.addColumn('number', 'Expert');

    var qualificationData = []; // Store data for each qualification type
    var qualificationCount = { 'دبلوم': 0, 'بكالوريوس': 0, 'ماجستير': 0 };
    jsonResponse.value.forEach(vacancy => {
        var qualificationType = vacancy.QualificationType;
        qualificationCount[qualificationType]++;
    });

    qualificationData.push(['Beginner', qualificationCount['دبلوم'], 0, 0]);
    qualificationData.push(['Intermediate', 0, qualificationCount['بكالوريوس'], 0]);
    qualificationData.push(['Expert', 0, 0, qualificationCount['ماجستير']]);
    data.addRows(qualificationData);

    var options = {
        chartArea: { width: '50%' },
        hAxis: { title: 'Qualification Type' },
        vAxis: { title: 'Number of Vacancies', minValue: 0 },
        isStacked: false, // Set to false to show individual bars for each qualification type
        series: {
            0: { color: '#4285F4' }, // Color for Beginner
            1: { color: '#F4B400' }, // Color for Intermediate
            2: { color: '#0F9D58' }  // Color for Expert
        }
    };

    $('#vacancy-reports').append(`<div class='report-wrapper'>
      <p class='reportTitle'> Vacancies By Qualification Type </p>
      <div id="vacanciesByQualType"></div> <!-- Assign an ID to the chart container -->
      </div>`);

    var chart = new google.visualization.ColumnChart(document.getElementById('vacanciesByQualType')); // Use ColumnChart for a vertical bar chart
    chart.draw(data, options);
}

function drawVacancyStatusChart(data) {

    var jsonResponse = data

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

    var options = {};

    $('#vacancy-reports').append(`<div class='report-wrapper'>
    <p class='reportTitle'> Vacancy Status </p>
    <div id="vacanciesStatus"></div>
    </div>`)

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
