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

      // Create the data table
      var dataTable = google.visualization.arrayToDataTable(data);

      // Set chart options with reversed axes and no legend
      var options = {
        chartArea: { width: '50%' },
        hAxis: { title: 'Department' }, // Department as x-axis
        vAxis: { title: 'Number of Vacancies', minValue: 0 }, // Number of Vacancies as y-axis
        legend: 'none' // Remove the legend
      };

      // Add the chart container
      $('#vacancy-reports').append(`<div class='report-wrapper'>
      <p class='reportTitle'> Vacancies by Department </p>
      <div id="vacanciesByDepartment"></div>
      </div>`);

      // Instantiate and draw the chart, passing in the data and options
      var chart = new google.visualization.BarChart(document.getElementById('vacanciesByDepartment'));
      chart.draw(dataTable, options);
    }
