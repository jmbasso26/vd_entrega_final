// using d3 for convenience
let main = d3.select("main");
let scrolly = main.select("#scrolly");
let $figure = scrolly.select("figure");
let wChart = 1200
let hChart = wChart * 0.5;
let dataChart = [];
let $step;

// initialize the scrollama
let scroller = scrollama();

// fetch data
d3.csv("./data/datos_canciones.csv", d3.autoType).then(function (data) {
  dataChart = data;
  // kick things off
  init();
});

function handleStepExit(response) {
  // if ($step) {
  console.count("classed");
  d3.select(response.element).classed("is-active", false);
  // }
}

// scrollama event handlers
function handleStepEnter(response) {
  // console.log(response);
  $step = d3.select(response.element);

  // add color to current step only
  // if ($step) {
  $step.classed("is-active", true);
  console.count("classed");
  // }

  $step.style("background", "transparent");

  // create new chart
  const key = $step.attr("data-step");

  // console.log("response.element", response.element);
  // console.log("$step", $step);
  // console.log("key", key);

  createChart(key);
}

function handleStepProgress(response) {
  // console.log(response);
  // $figure.style("opacity", response.progress);
  // $step = d3.select(response.element);
  // console.log($step.attr("data-step"));
  $step.select(".progress").text(d3.format(".1%")(response.progress));
}

function init() {
  // 1. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 2. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.33,
      debug: false,
      progress: true,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress(handleStepProgress);
}



/* DataViz */
function createChart(key) {
  let chart = Plot.plot({
    width: wChart,
    height: hChart,
    grid: true,
    marginTop: 50,
    marginBottom: 100,
    marginLeft: 50,
    marginRight: 50,
    x: {
      ticks: 15,
      label: key,
      axis: "top",
    },
    // y: {
    //   label: "Modo menor = Azul \n Modo mayor = Naranja",
    // },
    // label: "Modo menor = Azul \n Modo mayor = Naranja",
    // // legend: true,
    marks: [
      Plot.dot(
        dataChart,
        Plot.dodgeY({
          x: key,
          padding: 20,
          r: 20,
          stroke: "black",
          anchor: "middle",
          dy: 20,
          fill: d => (d.mode === 1 ? 'orange' : 'blue'),
          // title: d => d.artista
        })
      ),
      // Plot.image(
      //   dataChart,
      //   Plot.dodgeY({
      //     x: key,
      //     padding: 10,
      //     r: 15,
      //     anchor: "middle",
      //     fill: d => (d.mode === 1 ? 'orange' : 'blue'),
      //     width: 30,
      //     title: (d) => `${d.nombre}\n${d.anio} años`,
      //   })
      // ),
      Plot.text(
        dataChart,
        Plot.dodgeY({
          x: key,
          padding: 20,
          r: 20,
          dy: 20,
          anchor: "middle",
          text: d => (d.nombre.length<15? d.nombre :""),
          width: 30,
        })
      ),
    ],
  });



  d3.select("#scrolly figure svg").remove();
  d3.select("#scrolly figure").append(() => chart);

}
