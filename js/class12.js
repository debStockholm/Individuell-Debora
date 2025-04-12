
addMdToPage(`
**Class12 analysis**

_Class12_ is the degree where mostly of the students are depressed compared to the total Degree attendees;
According to query, of 6068 Class12 attendees, 71% of them have Depression against 29% which don't have it.
`)

let class12 = await dbQuery(`
  SELECT 
   count(*) as Total_students_degree,
    COUNT(CASE WHEN Depression = 0 THEN 1 END) AS count_noDep,
    ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*)) AS p_noDep,
    COUNT(CASE WHEN Depression = 1 THEN 1 END) AS count_withDep,
    ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*)) AS p_withDep
FROM 
    Depression_study_fix
WHERE 
    Age <= 34 AND Degree = 'Class12' 
    `)
console.log(class12)
tableFromData({
  data: class12,
  columnNames: ['Degree_TS', 'CountNODepression', '%_NODep', 'countWITHDperession', '%_withDep']
})

addMdToPage(`
I'll check first the school related parameters of the class12 students.\n
Students of 'Class 12' with NO depression gets those results:
  `)

let class12_school_noDepression = await dbQuery(`
 select count(*) Total_students, 
round(avg(Age),1) as Avg_Age, 
round(avg(CGPA),2) as Academy_performance, 
round(avg(SleepDuration),1) as Avg_sleep, 
round(avg(AcademiPressure),1) as Avg_AcademicPressure, 
round(avg(StudySatisfaction),1) as Study_satisfaction 
from Study_India
where Degree='Class12' and Depression = 0
  `)

tableFromData({
  data: class12_school_noDepression,
  columnNames: ['Total_students_NO_D', 'avg_Age', 'CGPA', 'Sleep_Duration', 'Academic_Pressure', 'Study_Satisfaction']
});

let class12_school_withDepression = await dbQuery(`
select count(*) Total_students, 
round(avg(Age),1) as Avg_Age, 
round(avg(CGPA),2) as Academy_performance, 
round(avg(SleepDuration),1) as Avg_sleep, 
round(avg(AcademiPressure),1) as Avg_AcademicPressure, 
round(avg(StudySatisfaction),1) as Study_satisfaction 
from Study_India
where Degree='Class12' and Depression = 1
  `)


tableFromData({
  data: class12_school_withDepression,
  columnNames: ['Total_students_WITH_D', 'avg_Age', 'CGPA', 'Sleep_Duration', 'Academic_Pressure', 'Study_Satisfaction']
});


addMdToPage(` 
**Results**: \n
According to filters, there are many similarities among students attending the same Degree \n
_SleepDuration_: according to classification (look at Documentation) an average SleepDuration of 1.4 (with depression) , 1.5 (no depression) means that students 
have average sleephours which lays beetween 5-6 hours sleep and 7-8 hour sleep. 
So around 6.5hours sleep per night.
They also show same values in CGPA performance indicator.\n
Differences we can consider:
* Average Age: the Average age of the students without depression in a unit greater than the the ones with depression; are older students more 'chill'?
* AcademicPressure: there is significant difference in those values. Students without depression feels a lower academic pressure than the counterpart;
* StudySatisfaction: students without Depression looks more satified than the counterpart about the overall studies` )

let depression = (await dbQuery(`
  select Distinct Depression from Study_india`
)).map(x => x.Depression);
console.log('query', depression)
let Class_Depression = addDropdown('Depression', depression);



drawGoogleChart({
  type: 'ColumnCharts',
  data: makeChartFriendly(dataForChart, 'Age',),
  options: {
    height: 500,
    chartArea: { left: 50, right: 0 },
    curveType: 'function',
    pointSize: 5,
    pointShape: 'circle',
    vAxis: { format: '# °C' },
    title: `Medeltemperatur per månad i Malmö, jämförelse mellan år ${year1} och ${year2} (°C)`
  }
});