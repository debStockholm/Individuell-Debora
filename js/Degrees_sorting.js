addMdToPage(`
# Analysing students \n

Here a table which represents the number of students for each Degree, sorted by 
the ones without Depression and the ones with Depression, in number and % values:
  `)

let depression_percent = await dbQuery(`
  select Degree,
  count(*) Total_Students,
  COUNT(CASE WHEN Depression = 0 THEN 1 END) AS without_Depression,
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*)) AS percent_no_Dep,
  COUNT(CASE WHEN Depression = 1 THEN 1 END) AS with_Depression,
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*)) AS percent_with_Dep
FROM 
    Study_India
WHERE Age <= 34 AND Degree != 'Others' and Profession = 'Student'
group by Degree
order by Degree asc`)

//console.log('datapercent', depression_percent)

tableFromData({
  data: depression_percent,
  columnNames: ['Degree', 'Number of students', 'without depression', '%', 'with depression', '%']
})


addMdToPage(`

Considerations:
* _Bachelors_ are the most represented group in the dataset;
* _Class12_ are the group with the largest gap between Students with diagnosed Depression and the ones without Depression;
* _Master_, _Bachelors_ and _PhD_ students show a more balanced Depression/noDepression statistics with very similar values in %.
______________________________


## Education and depression: academic related data

Is there a pattern between having depression and school performance? \n
Let's make a graph comparing averages of answers among the students with declared depression and the ones without declared depression.
\n

Value scales of the different parameters:
* **Academic performance**: 0 - 10
* **Academic pressure**: 0-5
* **Study satisfaction**: 0- 5
* **Daily hours of study**: 0 - 12

`)

let students_AVG_no_dep = await dbQuery(`
  select Degree,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 0 and Degree != 'Others' and Profession = 'Student' and Age <= 34
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
where Depression = 1 and Degree != 'Others' and Profession = 'Student' and Age <= 34
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
_**What does the graph tell us:**_

* CGPA (students overall performance) is quite similar in both students with depressions and the one without depression, and it's alos similar among the different degrees;
* Academic Pressure: on average, students _with depression feels a higher_ Acedemic pressure than the counterpart, all over the degrees;
* Daily hours of study:  on average, students _with depression have more_ study hours than the counterpart, all over the degrees;
* Study Satisfaction: on average, students _with depression fells a lower_ study satisfaction than the counterpart, all over the degree

______________________________

## Is there a correlation between perceiving financial stress and experiencing depression?
Results are on a scale from 0 to 5:
  `)

let students_avg_fs_dep = await dbQuery(`select 
  Degree,
  round(avg(CASE WHEN Depression = 1 THEN FinancialStress END), 1) as 'With Depression',
  round(avg(CASE WHEN Depression = 0 THEN FinancialStress END), 1) as 'Without Depression'
from Study_India
where Degree != 'Others' 
  and Profession = 'Student' and Age <= 34
group by Degree `)

tableFromData({
  data: students_avg_fs_dep,
  columnNames: ['Degree', 'with depression', 'without depression']
})

addMdToPage(`
It looks like there is no difference about students feeling more or else financial stress when pursuing a specific degree; 
on the contrary, there is a huge gap showing that students _with depression experience higher_ financial concern thn the counterpart.\n
Those stats can be studied more: is there a connection about Age and financial stress?
  `)

let students_age_fs = await dbQuery(`select 
 cast(Age as char) as Age,
  round(avg(CASE WHEN Depression = 1 THEN FinancialStress END), 1) as 'With Depression',
  round(avg(CASE WHEN Depression = 0 THEN FinancialStress END), 1) as 'Without Depression'
from Study_India 
  where Profession = 'Student' and Age <= 34
  group by Age
order by Age asc `)

tableFromData({
  data: students_age_fs,
  columnNames: ['Age', 'with depression', 'without depression']
})

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(students_age_fs),
  options: {
    height: 300,
    title: 'Financial stress according to Age',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#88c999', '#f4b183'],
    vAxis: {
      title: 'Average'
    },
    hAxis: {
      title: 'Ages',
      showTextEvery: 1,
      slantedText: false,
      gridlines: { count: -1 },
    },
    seriesType: 'bars'
  },
  chartArea: { left: '10%' }
})

let citystats = await dbQuery(`select 
 City,
  round(avg(CASE WHEN Depression = 1 THEN FinancialStress END), 1) as 'With Depression',
  round(avg(CASE WHEN Depression = 0 THEN FinancialStress END), 1) as 'Without Depression'
from Study_India 
  where Profession = 'Student' and Degree != 'Others' and Age <= 34 
  group by City
  having count(*) > 50
order by City asc `)


drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(citystats),
  options: {
    height: 500,
    width: 1300,
    title: 'Average Financial Stress by City',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#88c999', '#f4b183'],
    vAxis: {
      title: 'Financial Stress',
      minValue: 0
    },
    hAxis: {
      title: 'Cities',
      slantedText: true,
      slantedTextAngle: 45
    },
    seriesType: 'bars'
  },
  chartArea: { left: '10%' }
});


addMdToPage(`
  ## Behavioural factors and depression: sleep and dietary related information

Is there a pattern between having depression and behavioral patterns such ad sleep and dietary habits?\n
Let's make a graph comparing averages of answers among the students with declared depression and the ones without declared depression.
\n

**Is there a correlation between Depression and Dietary habits ?**\n
  Students **with**  Depression have the following eating habits: `)

let dep_and_dietaryhabits = await dbQuery(`select count(*) as Total_with_Depression,
  ROUND(COUNT(CASE WHEN DietaryHabits = 'Healthy' AND Depression = 1 THEN 1 END) * 100.0 /
    (SELECT COUNT(*) FROM Study_India WHERE Depression = 1)) AS Healthy,
      ROUND(COUNT(CASE WHEN DietaryHabits = 'Moderate' AND Depression = 1 THEN 1 END) * 100.0 /
        (SELECT COUNT(*) FROM Study_India WHERE Depression = 1)) AS Moderate,
          ROUND(COUNT(CASE WHEN DietaryHabits = 'Unhealthy' AND Depression = 1 THEN 1 END) * 100.0 /
            (SELECT COUNT(*) FROM Study_India WHERE Depression = 1)) AS UnHealthy
from Study_India
where
Age <= 34 and Degree != 'Others' AND Profession = 'Student' and Depression = 1
  `)

let data_dietary_Depression = [
  ['Type', '%', { role: 'tooltip' }],
  ['Healthy', 21, 'Healthy'],
  ['Moderate', 34, 'Moderate'],
  ['Unhealthy', 45, 'Unhealthy']
]

let Dietary_habits_depression =
  drawGoogleChart({
    type: 'PieChart',
    data: data_dietary_Depression,
    options: {
      title: 'Dietary of students WITH depression',
      height: 500,
      legend: { position: 'top' },
      chartArea: { left: '10%' },
      tooltip: { isHtml: true },
      colors: ['#05ab2c', '#edad21', '#a11008']
    }
  });

addMdToPage(` 
  Students  **without** Depression have the following eating habits:
`)

let dep_and_dietaryhabits_2 = await dbQuery(`select 
  count(*) as Total_without_Depression,
  ROUND(COUNT(CASE WHEN DietaryHabits = 'Healthy' AND Depression = 0 THEN 1 END) * 100.0 /
    (SELECT COUNT(*) FROM Study_India WHERE Depression = 0)) AS Healthy,
  ROUND(COUNT(CASE WHEN DietaryHabits = 'Moderate' AND Depression = 0 THEN 1 END) * 100.0 /
    (SELECT COUNT(*) FROM Study_India WHERE Depression = 0)) AS Moderate,
      ROUND(COUNT(CASE WHEN DietaryHabits = 'Unhealthy' AND Depression = 0 THEN 1 END) * 100.0 /
        (SELECT COUNT(*) FROM Study_India WHERE Depression = 0)) AS Unhealthy
FROM
Study_India
WHERE
Age <= 34 and Degree != 'Others' AND Profession = 'Student' and Depression = 0
`)

let data_dietary_No_Depression = [
  ['Type', ' % ', { role: 'tooltip' }],
  ['Healthy', 36, 'Healthy'],
  ['Moderate', 38, 'Moderate'],
  ['Unhealthy', 26, 'Unhealthy']
]

let Dietary_habits_no_depression =
  drawGoogleChart({
    type: 'PieChart',
    data: data_dietary_No_Depression,
    options: {
      title: 'Dietary of students WITHOUT depression',
      height: 500,
      legend: { position: 'top' },
      chartArea: { left: '10%' },
      tooltip: { isHtml: true },
      colors: ['#05ab2c', '#edad21', '#a11008']
    }
  });












/*let City_NODepress = await dbQuery(`
  select * from (select
  City,
  count(*) Total_students,
  round(avg(CASE WHEN Depression = 1 THEN FinancialStress END), 1) as 'With Depression',
  round(avg(CASE WHEN Depression = 0 THEN FinancialStress END), 1) as 'Without Depression'
from Study_India
where Age <= 34 and Degree != 'Others' 
  group by City) as city_grouped
  where Total_students >=50
  order by Total_students desc`)






/*

let students_avg_without_Depression = await dbQuery(`
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
  data: students_avg_without_Depression,
  columnNames: ['Degree', 'Total_students', 'avg_Age', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})

console.log(students_avg_without_Depression)


addMdToPage(`
## Students _with Depression_: statistics
Average statistic for students where Depression = 1  -> with diagnosed depression:
  `)


let students_avg_with_Depression = await dbQuery(`
  select Degree, count(*) Total_students,
  round(avg(Age), 1) as Avg_Age,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Depression = 1 and Degree != 'Others'and Profession = 'Student'
  group by Degree
    order by Total_students desc
  `)






tableFromData({
  data: students_avg_with_Depression,
  columnNames: ['Degree', 'Total_students', 'avg_Age', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})

/*addMdToPage(`
  ___________________________________
## Students _with Depression_: does sorting by Age make sense?
Average statistic for students sorted by Age; \n
All students taken into account:
  `)
let Age_degree_TOTAL = await dbQuery(`
  select Age, 
  count(*) Total_students,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Age <= 34 and Degree != 'Others' and Profession = 'Student'
  group by Age
    order by Age asc
  `)

tableFromData({
  data: Age_degree_TOTAL,
  columnNames: ['Age', 'Total_students', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})

addMdToPage(`
  ___________________________________
## Age AND _with_ Depression
Average statistic for students sorted by Age and with diagnosed Depression:
  `)
let Age_withDepression = await dbQuery(`
  select Age, 
  count(*) Total_students,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Age <= 34 and Degree != 'Others' and Profession = 'Student' and Depression = 1 
  group by Age
    order by Age asc
  `)

tableFromData({
  data: Age_withDepression,
  columnNames: ['Age', 'Total_students', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})



addMdToPage(`
  ___________________________________
## Age AND _without_ Depression
Average statistic for students sorted by Age and without diagnosed Depression:
  `)

let Age_withoutDepression = await dbQuery(`
  select Age, 
  count(*) Total_students,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Age <= 34 and Degree != 'Others' and Profession = 'Student' and Depression = 0
  group by Age
    order by Age asc
  `)

tableFromData({
  data: Age_withoutDepression,
  columnNames: ['Age', 'Total_students', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})

addMdToPage(`
  ___________________________________
## City AND _without_ Depression
Average statistic for students sorted by City and without diagnosed Depression:
  `)
let City_NODepress = await dbQuery(`
  select * from (select
  City,
  count(*) Total_students,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Age <= 34 and Degree != 'Others' and Depression = 0 
  group by City) as city_grouped
  where Total_students >=50
  order by Total_students desc
  limit 5
  `)


tableFromData({
  data: City_NODepress,
  columnNames: ['City', 'Total_students', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})



addMdToPage(`
  ___________________________________
## City AND _with_ Depression
Average statistic for students sorted by City and with diagnosed Depression:
  `)
let City_withDepress = await dbQuery(`
  select * from 
  (select 
  City,
  count(*) Total_students,
  round(avg(CGPA), 2) as Academy_performance,
  round(avg(SleepDuration), 1) as Avg_sleep,
  round(avg(AcademiPressure), 1) as Avg_AcademicPressure,
  round(avg(StudySatisfaction), 1) as Study_satisfaction,
  round(avg(FinancialStress), 1) as Financial_stress,
  round(avg(WorkStudyhours), 1) as Hours_study_daily
from Study_India
where Age <= 34 and Degree != 'Others' and Depression = 1 
  group by City ) as city_grouped
  where Total_students >= 50
  order by Total_students desc
  limit 5
  `)


tableFromData({
  data: City_withDepress,
  columnNames: ['City', 'Total_students', 'CGPA', 'Sleep', 'Academic_Pressure', 'Study_Satisfaction', 'Financial_stress', 'Avg_study_hours']
})

addMdToPage(`
  ___________________________________
## Considerations:
* it can be seen that people without depression have apprently less financial stress, feel less academin pressure and are more satified than the cunter part about their studies,

overall classification which is not dipendent by the City they live in, the degree they are pursuing or their Age.
I think depression is correlated to  the study satisfaciton, meanshile financial stress and academic pressure may contribute to students depression 
  `)*/