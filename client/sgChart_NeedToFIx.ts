
/// <reXference path="..//jquery/JQueryStatic.d.ts" />
import {Chart} from './javascript/Chart.js' 
//import $ from "./node_modules/@types/jquery/index";
//import {SgResponse} from '../../util/nightScout'



export class Person {

  constructor(name:string)
	{
		this.name=name;
	}
	name: string;
}

function greeter (person:Person){
	return "hallo "+person.name;
}

export var person=new Person("bert");
//export default 42;

export function foo() {
 console.log('xxx1');
}

export interface Config{
  zoom: Boolean,
  colour : string
}

//Need to share this with NS module
export interface SgResponse
  {
    timeStamps: number[],
    sgSamples: number[],
    mean: number,
    lastTimestamp: number,
    lastSg: number
  }


// $(function(){ 
//   alert('Hello'); 
// });
// function drawSgChart(target: string, config: Config) {
//   //const $ =  require("jquery")(window)
//   //const ctx =  document.getElementById(target).getContext("2d");
//   $.ajax({
//     url: '/ns/sgData',
//     dataType: 'json',
//   }).done(

export class SensorGlucoseChart {

	readonly ctx: any;
	readonly config: Config;
	constructor(ctx:any, config:Config)
	{
		this.ctx = ctx
		this.config = config
	}

	// drawSgChart(target: string, config: Config) {
	// 	  //const $ =  require("jquery")(window)
	// 	  //const ctx =  document.getElementById(target).getContext("2d");
	// 	  $.ajax({
	// 	    url: '/ns/sgData',
	// 	    dataType: 'json',
	// 	  }).done( 
	// 		render()
	// }
	
	
	foo(){ return "goo"}
	
  
	render (sgData: SgResponse) {
		const minY = (this.config.zoom) ? sgData.sgSamples.reduce((p, v) => Math.min(p, v)) : 2;// * 0.90;
		const maxY = (this.config.zoom) ? sgData.sgSamples.reduce((p, v) => Math.max(p, v)) : 22;// * 1.10;
		const possibleTicks = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
		var smallTicks = possibleTicks.filter(x => x <= minY)
		smallTicks.splice(-1, 1);
		var largeTicks = possibleTicks.filter(x => x >= maxY)
		largeTicks.splice(0, 1);
		const ticksToRemove = new Set(smallTicks.concat(largeTicks));
		const ticksY = possibleTicks.filter(x => !ticksToRemove.has(x))
		const actualMinY = ticksY[0];
		const actualMaxY = ticksY[ticksY.length - 1];
		const realData = Array.from(sgData.sgSamples.entries(), pair => ({ x: sgData.timeStamps[pair[0]], y: pair[1] }));
		const colours = sgData.sgSamples.map(x => (x > 10) ? "red" : "green");
		const myChart = new Chart(this.ctx, {
			type: 'line',
			data: {
				labels: [sgData.timeStamps.toString()], //.map(x =>timeString(new Date(x))),
				datasets: [{
				label: 'Sensor Glucuse mmol/L',
				data: realData, //sgData.sgSamples.entries().map(v => {x: sgData.timeStamps(v.)}),
				//borderColor: config.colour,
				pointBackgroundColor: colours, //["red", "red", "red", "red", "green", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red"],
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
					stepSize: 15
					},
					distribution: 'linear',
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
					min: actualMinY,
					max: actualMaxY,
					callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
						return Number(value.toString());//pass tick values as a string into Number function
					}
					},
					afterBuildTicks: function (pckBarChart) {
					pckBarChart.ticks = ticksY;
					}
				}]
				}
			},
			//   plugins: [{
			//     beforeRender:  (x : Chart, options)  => {
			//       const c = x.chart
			//       var dataset = x.data.datasets[0];
			//       var yScale = x.scales['y-axis-0'];
			//       //boundary point
			//       var yPos = yScale.getPixelForValue(10);

			//       var gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
			//       gradientFill.addColorStop(0, 'green');
			//       gradientFill.addColorStop(yPos / c.height - 0.01, 'red');
			//       gradientFill.addColorStop(yPos / c.height + 0.01, 'green');
			//       gradientFill.addColorStop(1, 'red');
			//       var model = x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model;
			//       model.borderColor = gradientFill;
			//     }
			//   }]
			})
		//);
		return myChart;
	}
}