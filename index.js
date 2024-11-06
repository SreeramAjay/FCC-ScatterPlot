const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const margin = { top: 30, right: 100, bottom: 30, left: 30 };
const width = 700 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const tooltip = d3.select('body').append("div").attr("class", "tooltip");

const secondsToMinutes = s => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([0, height]);
const color = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.json(dataUrl).then(data => {
    const zeroTime = data[0].Seconds;

    data.forEach(d => {
        d.Seconds -= zeroTime;
        d.Place = +d.Place;
        d.legend = d.Doping ? "Doping allegations" : "No doping allegations";
    });

    x.domain([200, 0]);
    y.domain([1, 36]);

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.legend))
        .attr("cx", d => x(d.Seconds))
        .attr("cy", d => y(d.Place))
        .on("mouseover", d => {
            tooltip.style('display', 'block')
                .html(`${d.Name}, ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br>${d.Doping}`)
                .style('left', `${d3.event.pageX + 10}px`)
                .style('top', `${d3.event.pageY + 10}px`);
        })
        .on("mouseout", () => tooltip.style('display', 'none'));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(secondsToMinutes));

    svg.append("text")
        .attr("y", height - 20)
        .attr("x", width - 210)
        .attr("dy", "1em")
        .text("Minutes Behind Fastest Time");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(90)")
        .attr("y", -20)
        .attr("x", 0)
        .attr("dy", "1em")
        .text("Rank");

    const legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(400,${i * 20 + 300})`);

    legend.append('circle')
        .attr('r', 5)
        .style('fill', color);

    legend.append('text')
        .attr('x', 10)
        .attr('y', 5)
        .text(d => d);
});
