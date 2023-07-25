

$(document).ready(function () {

    setTimeout(function () {
        // Load the Google Charts API and draw the chart when the page loads
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(initializeDrawChart)

    }, 3000)

    $(document).on('click', ".dd-container a", function () {
        changeLanguage()
    })

    $(document).on('click', ".dd-container", function () {
        changeLanguage()
    })

    waitForWrapperRenderForLang()

})

function translateToEnglish() {
  
    $("[name='Sidebar']").css('right', '')
    $("[name='Sidebar']").css('left', '0')
    $(".form").css('right', '')
    $(".form").css('left', '22%')
    $('.taskDD').css('left', '76%')
    $('.taskDD a').css('flex-direction', 'row')
    $('.task-details p').css({
        'text-align': 'left',
        'direction': 'rtl'
    })
    $(".task-details h4").css("text-align", "left")
}

function translateToArabic() {
    $("[name='Sidebar']").css('left', '')
    $("[name='Sidebar']").css('right', '0')
    $(".form").css('left', '')
    $(".form").css('right', '21%')
    $('.taskDD').css('left', '19%')
    $('.taskDD a').css('flex-direction', 'row-reverse')
    $('.task-details p').css({
        'text-align': 'right',
        'direction': 'ltr'
    })
    $(".task-details h4").css("text-align", "right")
}


function waitForWrapperRenderForLang() {
    var s = $('.dd-container');
    if (s.length > 0) {
        $('.dd-container').trigger("click")
    } else {
        setTimeout(waitForWrapperRenderForLang, 300);
    }
}

function initializeDrawChart() {

    fetchVacancies()
        .then(function (data) {
            waitForReportsWrapperRender(data)
        })
        .catch(function (error) {
            console.error(error);
        });

}

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
    drawVacanciesByYearsOfExperienceChart(data)
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
    var jsonResponse = data

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
        hAxis: { title: 'Number of Vacancies', minValue: 0 },
        vAxis: { title: 'Job Title' }
    };

    // Add the vacanciesByJobTitle chart container
    $('#vacancy-reports').append(`<div class='report-wrapper'>
    <p class='reportTitle'> Vacancies By Job Title </p>
    <div id="vacanciesByJobTitle"></div>
    </div>`);

    var chart = new google.visualization.BarChart(document.getElementById('vacanciesByJobTitle'));
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
        chartArea: { width: '90%', height: '90%' }, // Increase the chart area to make the whole chart larger
        colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC'], // Change the colors as needed
        pieHole: 0.4, // Make a donut chart by setting the pieHole option (0.4 creates a small hole in the middle)
        pieSliceText: 'percentage', // Show the percentage of each slice on the chart
        legend: { position: 'right', textStyle: { fontSize: 14 } } // Position the legend on the right side of the chart and increase its font size
    };

    // Add the vacanciesStatus chart container
    $('#vacancy-reports-doublecardwrapper').append(`<div class='report-wrapper'>
      <p class='reportTitle'> Vacancy Status </p>
      <div id="vacanciesStatus"></div>
      </div>`);

    var chart = new google.visualization.PieChart(document.getElementById('vacanciesStatus'));
    chart.draw(data, options);
}

function drawVacanciesByYearsOfExperienceChart(data) {
    var jsonResponse = data

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Years of Experience');
    data.addColumn('number', 'Percentage');

    var expYearsCount = {};
    var totalVacancies = jsonResponse.value.length;

    jsonResponse.value.forEach(vacancy => {
        var expYears = vacancy.ExpertiseYears;
        expYearsCount[expYears] = expYearsCount[expYears] ? expYearsCount[expYears] + 1 : 1;
    });

    Object.keys(expYearsCount).forEach(expYears => {
        var percentage = (expYearsCount[expYears] / totalVacancies) * 100;
        data.addRow([expYears + ' years', percentage]);
    });

    var options = {
        chartArea: { width: '90%', height: '90%' },
        legend: { position: 'right' },
        pieSliceText: 'percentage',
        pieStartAngle: 100,
        slices: {
            0: { color: '#3366cc' },
            1: { color: '#dc3912' },
            2: { color: '#ff9900' },
            3: { color: '#109618' },
            4: { color: '#990099' },
            5: { color: '#0099c6' },
            6: { color: '#dd4477' },
            7: { color: '#66aa00' },
            8: { color: '#b82e2e' },
            9: { color: '#316395' }
        }
    };

    // Add the vacanciesStatus chart container
    $('#vacancy-reports-doublecardwrapper').append(`<div class='report-wrapper'>
     <p class='reportTitle'> Years of Experience </p>
     <div id="vacanciesYOE"></div>
     </div>`);


    var chart = new google.visualization.PieChart(document.getElementById('vacanciesYOE'));
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
