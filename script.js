const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const w = 800;
const h = 400;
const xPadding = 100;
const yPadding = 50;


window.onload = () => {
  fetch(resource)
    .then(response => response.json())
    .then(data => {
      createCanvas(data);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
};


function createCanvas(data) {
  const svg = d3.select('#svg_container')
                .append('svg')
                .attr('width', w + 2 * xPadding)
                .attr('height', h + 2 * yPadding)
                .append('g')
                .attr('transform', `translate(${xPadding}, ${yPadding / 2})`);

  createCircles(svg, data);
}  // End createCanvas()


function createCircles(svg, data) {
  let xScale = d3.scaleTime()
                 .domain([
                   d3.min(data, d => new Date(`${d.Year - 1} 00:00`)),
                   d3.max(data, d => new Date(`${d.Year + 1} 00:00`))
                 ])
                 .range([0, w]);
}  // End createCircles()
