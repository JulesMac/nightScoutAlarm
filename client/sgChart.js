


function drawSgChart(target, config) {
  const ctx = document.getElementById(target);
  $.ajax({
    url: '/ns/chartData?zoom=' + config.zoom,
    dataType: 'json',
  }).done(function (sgData) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: sgData.timeStamps, //.map(x =>timeString(new Date(x))),
        datasets: [{
          label: 'Sensor Glucuse mmol/L',
          data: sgData.data, //sgData.sgSamples.entries().map(v => {x: sgData.timeStamps(v.)}),
          borderColor: config.colour,
          backgroundColor: config.colour,
          borderWidth: 1,
          fill: false,
          pointRadius: 6,
          borderDash: [6, 3]
        }]
      },
      options: {
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'minute',
              stepSize: 15,
              distribution: 'linear'
            },
            gridLines: {
              color: 'rgba(128, 128, 128, 1.0)',
              lineWidth: 1
            },
            ticks: {
              source: 'auto',
              maxTicksLimit: 5,
              fontSize: 20,
              fontColor: 'rgba(255, 255, 255, 1.0)',
              display: true //this will remove only the label
            }
          }],
          yAxes: [{
            display: true,
            type: 'logarithmic',
            gridLines: {
              color: 'rgba(128, 128, 128, 1.0)',
              lineWidth: 1
            },
            ticks: {
              fontSize: 25,
              fontColor: 'rgba(255, 255, 255, 1.0)',
              min: sgData.minY,
              max: sgData.maxY,
              callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                return Number(value.toString());//pass tick values as a string into Number function
              }
            },
            afterBuildTicks: function (pckBarChart) {
              pckBarChart.ticks = sgData.ticksY;
            }
          }]
        }
      }
    }
    );
  });
};
