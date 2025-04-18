/*let students_AVG = await dbQuery(`
  select Degree, count(*) Total_students,
  round(avg(Age), 1) as Avg_Age,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Depression = 0 and Degree != 'Others' and Profession = 'Student'
  group by Degree
    order by Total_students desc
  `)

tableFromData({
  data: students_AVG,
  columnNames: ['Degree', 'Total_students', 'avg_Age', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})
//___________________________

function transposeToFitChart(originalData) {
  const categories = [
    'CGPA',
    'Sleep',
    'Academic_Pressure',
    'Study_Satisfaction',
    'Financial_stress',
    'Avg_study_hours'
  ];

  // Create an array of objects like { Degree: 'CGPA', Bachelor: 7.63, Master: 7.61, ... }
  const result = categories.map(cat => {
    const row = { Degree: cat };
    originalData.forEach(degreeData => {
      const degree = degreeData.Degree.trim();
      row[degree] = parseFloat(String(degreeData[cat]).replace(',', '.'));
    });
    return row;
  });

  return result;
}

const transposedData = transposeToFitChart(students_AVG);

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(transposedData, 'example'),
  options: {
    title: 'Student Metrics by Degree',
    height: 500,
    legend: { position: 'top' },
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45
    },
    chartArea: { left: '10%' }
  }
});*/


/*EDUCSTIOION RELATED STATS*/

addMdToPage(`
## Students statistics :  school related data
 
Is there a pattern between having depression and school performance? \n
Let's make a graph comparing averages of answers among the students with declared depression and the ones without declared depression.
\n

Value scales of the different parameters:
* **Academic performance**: 0 - 10
* **Academic pressure**: 0-5
* **Study satisfaction**: 0- 5 
* **Daily hours of study**: 0 - 12


`)

let mapping_acadpress = s.max('AcademiPressure')

let students_AVG_no_dep = await dbQuery(`
  select Degree,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 0 and Degree != 'Others' and Profession = 'Student'
  group by Degree`)


drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(students_AVG_no_dep),
  options: {
    height: 500,
    title: 'School related statistics of students WITHOUT DEPRESSION',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#43a047', '#26a69a', '#00acc1', '#29b6f6'],
    vAxis: { title: 'Average*' },
    hAxis: { title: 'Degree' },
    seriesType: 'bars',
    slantedText: true,
    slantedTextAngle: 45
  },
  chartArea: { left: '10%' }
});
addMdToPage(`
  ______________________
  `)
let students_AVG_with_dep = await dbQuery(`
  select Degree,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 1 and Degree != 'Others' and Profession = 'Student'
  group by Degree`)

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(students_AVG_with_dep),
  options: {
    height: 500,
    title: 'School-related statistics of students WITH DEPRESSION',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#f06292', '#f48fb1', '#ffeb3b', '#ffa726'],
    vAxis: {
      title: 'Average*'
    },
    hAxis: { title: 'Degree' },
    seriesType: 'bars',
    slantedText: true,
    slantedTextAngle: 45
  },
  chartArea: { left: '10%' }
});



addMdToPage(`
_____________________
_**What do the graph tell us:**_

* CGPA (students overall performance) is quite similar in both students with depressions and the one without depression, and it's alos similar among the different degrees;
* Academic Pressure: on average, students _with depression feels a higher_ Acedemic pressure than the counterpart, all over the degrees;
* Daily hours of study:  on average, students _with depression have more_ study hours than the counterpart, all over the degrees;
* Study Satisfaction: on average, students _with depression fells a lower_ study satisfaction than the counterpart, all over the degree

  
  
  
  
  `)