// molly implementation of button change: animations and buttons are still out of sync
document.getElementById("age-input-container")         .append(ageInput);
   document.getElementById("gender-input-container")      .append(genderInput);
   document.getElementById("academic-input-container")    .append(academicPressureInput);
   document.getElementById("sleep-input-container")       .append(sleepInput);
   document.getElementById("satisfaction-input-container").append(studySatisfactionInput);
   document.getElementById("financial-input-container")   .append(financialStressInput);
   document.getElementById("studyhours-input-container")  .append(studyHoursInput);
   // 2) Mount buttons
   document.getElementById("age-btn-container")           .append(startAge);
   document.getElementById("gender-btn-container")        .append(startGender);
   document.getElementById("academic-btn-container")      .append(startAcademic);
   document.getElementById("sleep-btn-container")         .append(startSleep);
   document.getElementById("satisfaction-btn-container")  .append(startSatisfaction);
   document.getElementById("financial-btn-container")     .append(startFinancialStress);
   document.getElementById("studyhours-btn-container")    .append(startStudyHours);
   // 3) Click handlers
   startAge.addEventListener("click",() => {
     const w = document.getElementById("age-chart-container");
     w.innerHTML="";
     w.append(chart("Age"));
   });
   startGender.addEventListener("click",() => {
     const w = document.getElementById("gender-chart-container");
     w.innerHTML="";
     w.append(chart("Gender"));
   });
   startAcademic.addEventListener("click",() => {
     const w = document.getElementById("academic-chart-container");
     w.innerHTML="";
     w.append(chart("Academic Pressure"));
   });
   startSleep.addEventListener("click",() => {
     const w = document.getElementById("sleep-chart-container");
     w.innerHTML="";
     w.append(chart("Sleep Duration"));
   });
   startSatisfaction.addEventListener("click",() => {
     const w = document.getElementById("satisfaction-chart-container");
     w.innerHTML="";
     w.append(chart("Study Satisfaction"));
   });
   startFinancialStress.addEventListener("click",() => {
     const w = document.getElementById("financial-chart-container");
     w.innerHTML="";
     w.append(chart("Financial Stress"));
   });
   startStudyHours.addEventListener("click",() => {
     const w = document.getElementById("studyhours-chart-container");
     w.innerHTML="";
     w.append(chart("Study Hours"));
   });
   // 4) Initial render into each container
   const chartContainers = {
     "Age":               "age-chart-container",
     "Gender":            "gender-chart-container",
     "Academic Pressure": "academic-chart-container",
     "Sleep Duration":    "sleep-chart-container",
     "Study Satisfaction":"satisfaction-chart-container",
     "Financial Stress":  "financial-chart-container",
     "Study Hours":       "studyhours-chart-container"
   };
   for (const [cat, id] of Object.entries(chartContainers)) {
     const wrap = document.getElementById(id);
     if (wrap) wrap.append(chart(cat));
   }
