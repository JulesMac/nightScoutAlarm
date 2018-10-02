

function drawSgChart(target){
  var ctx = document.getElementById(target);
  $.ajax({
      url: '/ns/sgData',
      dataType: 'json',
    }).done(function (sgData) {
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: sgData.timeStamps.map(x =>timeString(new Date(x))),
              datasets: [{
                  label: 'Sensor Glucuse mmol/L',
                  data: sgData.sgSamples,
                  borderColor: "#3e95cd",
                  borderWidth: 1,
                  fill: true
              }]
          },
          options: {
              animation:{
                duration :0
              },
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }],
                  xAxes: [{
                      ticks: {
                          display: true //this will remove only the label
                      }
                  }]
              }
          }
      }
    );
  });
};
