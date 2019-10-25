



function drawSgChart(target, config){
  const ctx = document.getElementById(target);
  $.ajax({
      url: '/ns/sgData',
      dataType: 'json',
    }).done(function (sgData) {
      const minY = (config.zoom) ? sgData.sgSamples.reduce((p, v) => Math.min(p, v)) : 2;// * 0.90;
      const maxY = (config.zoom) ? sgData.sgSamples.reduce((p, v) => Math.max(p, v)) : 22;// * 1.10;
      const possibleTicks = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
      var smallTicks = possibleTicks.filter(x => x<=minY)
      smallTicks.splice(-1,1);
      var largeTicks = possibleTicks.filter(x => x>=maxY)
      largeTicks.splice(0,1);
      const ticksToRemove = new Set(smallTicks.concat(largeTicks));
      const ticksY = possibleTicks.filter(x => !ticksToRemove.has(x))
      const actualMinY = ticksY[0];
      const actualMaxY = ticksY[ticksY.length-1];
      const realData = Array.from(sgData.sgSamples.entries(), pair => ({x:sgData.timeStamps[pair[0]], y:pair[1] })) ;
      const myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: sgData.timeStamps, //.map(x =>timeString(new Date(x))),
              datasets: [{
                  label: 'Sensor Glucuse mmol/L',
                  data: realData, //sgData.sgSamples.entries().map(v => {x: sgData.timeStamps(v.)}),
                  borderColor: config.colour,
                  backgroundColor: config.colour,
                  borderWidth: 1,
                  fill: false,
                  pointRadius: 6,
                  borderDash: [6,3]
              }]
          },
          options: {
            animation:{
              duration :0
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
                  lineWidth : 1
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
                  lineWidth : 1
                },
                ticks: {
                  fontSize: 25,
                  fontColor: 'rgba(255, 255, 255, 1.0)',
                  min: actualMinY,
                  max: actualMaxY,
                    callback: function(value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                        return Number(value.toString());//pass tick values as a string into Number function
                    }
                },
                afterBuildTicks: function(pckBarChart) {
                  pckBarChart.ticks = ticksY;
                  }
      				}]
            }
          }
      }
    );
  });
};
