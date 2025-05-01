---
theme: dashboard
title: Skeleton for Final Viz 
toc: false
sidebar: false
pager: false
footer:
---

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
}
.section {
  width: 100vw; /* Full width of the viewport */
  height: 100vh;
  max-width: 100%; /* Prevent overflow */
  margin: 0 auto; /* Center the content */
  padding: 1rem; /* Add some padding for spacing */
  box-sizing: border-box; /* Include padding in width calculation */
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.section.animate {
  opacity: 1;
  transform: translateY(0);
}
</style>


```js 
// animating the pages upon scrolling
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

<!-- loading chart data-->
```js
// pulling in the JSON created from the csv 
const data = FileAttachment("./data/data.json").json();
```

<!-- chart definition -->
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

<!-- Storing the user's input for the ML predictor -->
```js
let genderInput = Inputs.select([null,"Male","Female","Not Specified"], {label: "Gender"});
let ageInput = Inputs.range([18,35], {value: 18, step: 1, label: "Age"}); // range function
let studySatisfactionInput = Inputs.select(([null,1,2,3,4,5]), {label: "Study Satisifcation", placeholder:""});
let sleepInput = Inputs.select(([null,"Less than 5 hours","5-6 hours","7-8 hours","More than 8 hours"]), {label: "Sleep Duration"});
let dietInput = Inputs.select(([null,"Unhealthy","Moderate","Healthy"]), {label: "Dietary Habits", placeholder:""});
let academicPressureInput = Inputs.select([1,2,3,4,5], {step: 1, label: "Academic Pressure"}); // range function
let suicideThoughtsInput = Inputs.select(([null,"Yes","No"]), {label: "Have you ever had suicidal thoughts?", placeholder:""});
let studyHoursInput = Inputs.range([0,24], {value: 0, step: 1, label: "Study Hours"});
let financialStressInput = Inputs.select(([null,1,2,3,4,5]), {label: "Financial Stress", placeholder:""});
let familyHistory = Inputs.select(([null,"Yes","No"]), {label: "Family History of Mental Illness"});
let realDepression = Inputs.select(([null,"Yes","No"]), {label: "Do you have depression?", placeholder:""});

// Alternative approach with a mutable object and update function
let userProfile = {
  "Gender": null,
  "Age": null,
  "Academic Pressure": null,
  "Study Satisfaction": null,
  "Sleep Duration": null,
  "Dietary Habits": null,
  "Have you ever had suicidal thoughts ?": null, 
  "Study Hours": null,
  "Financial Stress": null,
  "Family History of Mental Illness": null,
  "Actual Depression": null,
};

function updateUserProfile() {
  userProfile["Gender"] = genderInput.value;
  userProfile["Age"] = ageInput.value;
  userProfile["Study Satisfaction"] = studySatisfactionInput.value;
  userProfile["Academic Pressure"] = academicPressureInput.value;
  userProfile["Sleep Duration"] = sleepInput.value;
  userProfile["Dietary Habits"] = dietInput.value;
  userProfile["Have you ever had suicidal thoughts ?"] = suicideThoughtsInput.value;
  userProfile["Study Hours"] = studyHoursInput.value;
  userProfile["Financial Stress"] = financialStressInput.value;
  userProfile["Family History of Mental Illness"] = familyHistory.value;
  userProfile["Actual Depression"] = realDepression.value;
  
  return userProfile;
}
``` 

<!-- writing the userProfile to a json file so the json can be parsed by the ML predictor -->
```js
import confetti from "canvas-confetti";

let predictedDepression = null;
let accuracy = null;

// send the user's profile to be processed by the backend Flask server
// where the classifier model lives 
let submitUserProfile = Inputs.button("Submit Entry", 
  {value: null, 
   reduce: async () => { // Make the reduce function async
     updateUserProfile();
     
     try {
       // Send the POST request
       const response = await fetch("http://localhost:3005/save-profile", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(userProfile),
       });

       // Log the response status
       console.log("Response Status:", response.status);

       // Optionally, parse the response JSON if needed
       const result = await response.json();
       console.log("Response Body:", result); 

       // Update predictedDepression based on the response
       predictedDepression = result["prediction"];
       accuracy = result["probability"][0][predictedDepression];
       console.log("Predicted Depression: ", predictedDepression, " with accuracy: ", accuracy);
     } catch (error) {
       console.error("Error during fetch:", error);
     }

     return true;
   },
   label: "Are you ready to see yourself in the data?"
  });
```

<!-- This is how you view the input interactions-->
<!-- ```js
view(genderInput);
view(ageInput); 
view(studySatisfactionInput); 
view(sleepInput);
view(dietInput);
view(academicPressureInput);
view(suicideThoughtsInput);
view(studyHoursInput);
view(financialStressInput);
view(familyHistory);
view(realDepression);
display(submitUserProfile);
``` -->

<!-- Feature Cards: template  -->
<div class="section.animated" >

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

<!-- Next Feature -->
<div class="section">

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
