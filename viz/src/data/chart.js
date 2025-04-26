import * as d3 from "d3";
import { data } from "./data.json.js"; // Observable Framework supports this!

export function createChart(){
  displayData = data; // Modify this if you need to filter or transform the data
  const width = 900, height = 600, margin = { top: 80, right: 50, bottom: 120, left: 50 };
  const r = 8; // Fixed radius
  
  const svg = d3.create("svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#F0F0F0");
  
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  const xScale = d3.scaleLinear()
    .domain([0, displayData.length - 1])
    .range([0, width - margin.left - margin.right]);
  
  const yScale = d3.scaleLinear()
    .range([height - margin.top - margin.bottom, 0]);
  
  const yTargets = displayData.map(() => Math.random() * (height - margin.top - margin.bottom));
  
  const simulation = d3.forceSimulation(displayData)
    .force("x", d3.forceX((d, i) => xScale(i)).strength(0.05))
    .force("y", d3.forceY((d, i) => yTargets[i]).strength(0.05))
    .force("collide", d3.forceCollide(r + 4))
    .force("charge", d3.forceManyBody().strength(2))
    .stop();
  
  for (let i = 0; i < 200; ++i) simulation.tick();
  
  const circles = g.selectAll("circle")
    .data(displayData, (d, i) => i);
  
  circles.enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", r * 1.5)
    .attr("fill", d =>
      d.newEntry ? "#4A90E2" : (d.Depression.toLowerCase() === "yes" ? "#D81B60" : "none")
    )
    .attr("stroke", "#9C1C6C")
    .attr("stroke-width", 1.2)
    .attr("opacity", 0)
    .transition()
    .duration(800)
    .attr("opacity", 1)
    .attr("r", r);
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .text("All Data Points");
  
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "10px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "8px")
    .style("pointer-events", "none")
    .style("font-size", "12px")
    .style("color", "#333")
    .style("box-shadow", "0px 2px 8px rgba(0,0,0,0.15)")
    .style("opacity", 0);
  
  g.selectAll("circle")
    .on("mouseover", function (event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.95);
  
      tooltip.html(`
        <strong>Gender:</strong> ${d.Gender}<br/>
        <strong>Age:</strong> ${d.Age}<br/>
        <strong>Academic Pressure:</strong> ${d["Study Satisfaction"]}<br/>
        <strong>Sleep Duration:</strong> ${d["Sleep Duration"]}<br/>
        <strong>Dietary Habits:</strong> ${d["Dietary Habits"]}<br/>
        <strong>Suicidal Thoughts:</strong> ${d["Have you ever had suicidal thoughts ?"]}<br/>
        <strong>Study Hours:</strong> ${d["Study Hours"]}<br/>
        <strong>Financial Stress:</strong> ${d["Financial Stress"]}<br/>
        <strong>Family History:</strong> ${d["Family History of Mental Illness"]}<br/>
        <strong>Depression:</strong> ${d.Depression}
      `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function () {
      tooltip.transition()
        .duration(300)
        .style("opacity", 0);
    });
  
  return svg.node();
}