---
theme: dashboard
title: Skeleton for Final Viz 
toc: false
sidebar: false
pager: false
footer:
---


<!-- # Depression Viz  -->
<!-- ```js
const clicks = view(Inputs.button("Click 🙁me"));
```

You have clicked ${clicks} times
 -->

<!-- Load and transform the data -->

<!-- A shared color scale for consistency, sorted by the number of launches -->
<style>
.no-max-width {
    font-size: 50px;
    max-width: none;
}

.large-data-card{
    background: var(--theme-background-alt);
    border: solid 1px var(--theme-foreground-faintest);
    border-radius: 0.75rem;
    padding: 1rem;
    font: 14px var(--sans-serif);
    grid-row: span 6;
}

body{
  max-width: 100vw;
  overflow: hidden; /* Prevent body-level scrolling */
}
.section {
  position: absolute;
  width: 100vw; /* Full width of the viewport */
  height: 100vh;
  max-width: 100%; /* Prevent overflow */
  margin: 0 auto; /* Center the content */
  margin-bottom: 20vh;
  padding: 1rem; /* Add some padding for spacing */
  box-sizing: border-box; /* Include padding in width calculation */
  overflow-y: auto; /* Allow section-level scrolling */
  padding: 40px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease;
  z-index: 0;
}

.section.active {
      opacity: 1;
      visibility: visible;
      z-index: 1;
    }

.section-content {
      margin: 0 auto;
    }

.scroll-button {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 30px;
      font-size: 1rem;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      z-index: 10;
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    .scroll-button:hover {
      background-color: #0056b3;
    }

    .scroll-button.hidden {
      opacity: 0;
      pointer-events: none;
    }

    #scroll-down {
      bottom: 20px;
    }

    #scroll-up {
      top: 20px;
    }
</style>

<!-- >
```js 
// animating the pages upon scrolling
view(Inputs.button("Click 🙁me"));

const featureCards = document.querySelectorAll(".section");

const animateOnScroll = () => {
  featureCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      card.classList.add("animate");
    } else {
      card.classList.remove("animate");
    }
  });
};

const animateOnKeyPress = (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    featureCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        card.classList.add("animate");
      } else {
        card.classList.remove("animate");
      }
    });
  }
};

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("keydown", animateOnKeyPress);

featureCards;
```
<!-- -->

```js
// pulling in the JSON created from the csv 
const data = FileAttachment("./data/data.json").json();
```

```js
// displaying the json created from the depression data csv
// display(data);

// displaying the d3 svg node created from the depression data
function createChart(){
  const displayData = data; // Modify this if you need to filter or transform the data
  const width = 500, height = 600, margin = { top: 80, right: 50, bottom: 120, left: 50 };
  const r = 8; // Fixed radius
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    // .style("background-color", "#F0F0F0");
  
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
        <strong>Academic Pressure:</strong> ${d["StudySatisfaction"]}<br/>
        <strong>Sleep Duration:</strong> ${d["SleepDuration"]}<br/>
        <strong>Dietary Habits:</strong> ${d["DietaryHabits"]}<br/>
        <strong>Suicidal Thoughts:</strong> ${d["SuicidalThoughts"]}<br/>
        <strong>Study Hours:</strong> ${d["StudyHours"]}<br/>
        <strong>Financial Stress:</strong> ${d["FinancialStress"]}<br/>
        <strong>Family History:</strong> ${d["FamilyHistory"]}<br/>
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
```

<!-- Feature Cards: template  -->

<body>
<div class="section active" id="section-0">
<div class = "section-content">

<div class="grid grid-cols-2">

  <!-- Page Title div -->
  <div class="card grid-colspan-4 grid-rowspan-1" style="display: flex; justify-content: center; align-items: center; text-align: center;">
      <h1 class="no-max-width">
        What Does Your [Feature] Say?
      </h1>
  </div>

  <!-- Insight div -->
  <div class="card grid-rowspan-3">
    <h1>Insight for this feature</h1>
    Our interactive tool lets you explore which lifestyle factors impact depression among students – and see how your habits compare.
  </div>

  <!-- Data div -->
  <div class="large-data-card" id="chart-container" style="display: flex; justify-content:center; flex-wrap: wrap;">
    <h1>Data title goes here</h1>
    ${display(createChart())}
      
  </div>

  <!-- User Interaction Div -->
  <div class="card grid-colspan-1 grid-rowspan-3">
    <h1 style="font-size: 15px;">Curious where you fit in?</h1>
    <p> should go here </p>
  </div>
</div>

</div>
</div>

<!-- Next Feature -->
<div class="section" id="section-1">
<div class = "section-content">
<div class="grid grid-cols-2">

  <!-- Page Title div -->
  <div class="card grid-colspan-4 grid-rowspan-1" style="display: flex; justify-content: center; align-items: center; text-align: center;">
      <h1 class="no-max-width">
        What Does Your [Feature2] Say?
      </h1>
  </div>

  <!-- Insight div -->
  <div class="card grid-rowspan-3">
    <h1>Insight for this feature</h1>
    Our interactive tool lets you explore which lifestyle factors impact depression among students – and see how your habits compare.
  </div>

  <!-- Data div -->
  <div class="large-data-card">
    <h1>Data title goes here</h1>
  </div>

  <!-- User Interaction Div -->
  <div class="card grid-colspan-1 grid-rowspan-3">
    <h1 style="font-size: 15px;">Curious where you fit in?</h1>
    <p> should go here </p>
  </div>
</div>

</div>
</div>


<button id="scroll-up" class="scroll-button hidden" onclick="scrollToPrevious()">↑ Up</button>
<button id="scroll-down" class="scroll-button" onclick="scrollToNext()">↓ Down</button>
<script>
  const sections = document.querySelectorAll('.section');
    const btnUp = document.getElementById('scroll-up');
    const btnDown = document.getElementById('scroll-down');
    let currentIndex = 0;
    let isTransitioning = false;

    function updateButtons() {
      btnUp.classList.toggle('hidden', currentIndex === 0);
      btnDown.classList.toggle('hidden', currentIndex === sections.length - 1);
    }

    function transitionToSection(index) {
      if (isTransitioning || index === currentIndex || index < 0 || index >= sections.length) return;
      isTransitioning = true;

      const current = sections[currentIndex];
      const next = sections[index];

      current.classList.remove('active');

      // Wait for fade out, then show new section
      setTimeout(() => {
        next.scrollTop = 0; // Reset scroll position
        next.classList.add('active');
        currentIndex = index;
        updateButtons();
        isTransitioning = false;
      }, 250); // Must match CSS transition time
    }

    function scrollToNext() {
      transitionToSection(currentIndex + 1);
    }

    function scrollToPrevious() {
      transitionToSection(currentIndex - 1);
    }

    // Prevent manual section switching
    window.addEventListener('keydown', e => {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    });

    updateButtons();
</script>
</body>
