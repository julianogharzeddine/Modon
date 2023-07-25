 // Function to draw the Google Chart
    function drawChart() {
      // Sample data for the chart
      var data = google.visualization.arrayToDataTable([
        ['Category', 'Value'],
        ['Category 1', 10],
        ['Category 2', 20],
        ['Category 3', 30],
        ['Category 4', 15],
        ['Category 5', 25],
      ]);

      // Chart options
      var options = {
        title: 'Simple Bar Chart',
        vAxis: { title: 'Values' },
        hAxis: { title: 'Categories' },
      };

      // Instantiate and draw the chart
      var chart = new google.visualization.ColumnChart(document.getElementById('vacancy-reports'));
      chart.draw(data, options);
    }


$(document).ready(function(){

    // Load the Google Charts API and draw the chart when the page loads
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart)
  

})
   
