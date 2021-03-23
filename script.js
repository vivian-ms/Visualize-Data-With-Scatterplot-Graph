const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const w = 800;
const h = 400;
const xPadding = 100;
const yPadding = 50;

const convertTime = time => {
  let utc = new Date(Date.UTC(70, 0, 1, 0, time.substr(0, 2), time.substr(3)));
  let offset = utc.getTimezoneOffset();
  utc.setMinutes(utc.getMinutes() + offset);
  return utc;
};


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

  let yScale = d3.scaleTime()
                .domain([
                  d3.min(data, d => convertTime(d.Time)),
                  d3.max(data, d => convertTime(d.Time)),
                ])
                .range([h, 0]);

  let tooltip = d3.select('#svg_container')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('opacity', 0);

  svg.selectAll('circle')
     .data(data)
     .enter()
     .append('circle')
     .attr('cx', d => xScale(new Date(`${d.Year} 00:00`)))
     .attr('cy', d => yScale(convertTime(d.Time)))
     .attr('r', 7)
     .attr('data-xvalue', d => d.Year)
     .attr('data-yvalue', d => convertTime(d.Time))
     .classed('dot', true)
     .on('mouseover', (evt, d) => {
       tooltip.transition()
              .duration('50')
              .style('opacity', 1)
              .style('left', `${evt.x}px`)
              .style('top', `${d3.select(evt.currentTarget).attr('cy')}px`);
       tooltip.attr('data-year', d.Year)
              .html(`<h4>${d.Year}</h4> <p>${d.Name} (${d.Nationality}) - ${d.Time} ${d.Doping ? `</p><br /> <p>${d.Doping}`: ''}</p>`);

     })
     .on('mouseout', (evt, d) => {
       tooltip.transition()
              .duration('50')
              .style('opacity', 0);
     });

  createAxes(svg, xScale, yScale);
}  // End createCircles()


function createAxes(svg, xScale, yScale) {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', `translate(0, ${h})`)
     .call(xAxis);

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  svg.append('g')
     .attr('id', 'y-axis')
     .call(yAxis);
  svg.append('text')
     .attr('id', 'y-label')
     .attr('text-anchor', 'middle')
     .attr('transform', `translate(-50, ${h / 2}) rotate(-90)`)
     .text('Time (in minutes)');
}  // End createAxes()
