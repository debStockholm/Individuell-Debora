addMdToPage(`
# Analysing students - sort by Degree\n

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
  columnNames: ['Degree', 'Number_of_students', 'CountWITHOUTDepression', '%_without_Dep', 'countWITHDepression', '%_with_Dep']
})


addMdToPage(`

Considerations:
* _Bachelors_ are the most represented group in the dataset;
* _Class12_ are the group with the largest gap between Students with diagnosed Depression and the ones without Depression;
* _Master_, _Bachelors_ and _PhD_ students show a more balanced Depression/noDepression statistics with very similar values in %.
______________________________


## Students _without Depression_: statistics

Average statistic for students where Depression = 0   -> No diagnosed depression:
  `)

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

addMdToPage(`
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
* it can be seen that people without depression have apprently less financialstress, feel less academin pressure and are more satified than the cunter part about their studies,

overall classification which is not dipendent by the City they live in, the degree they are pursuing or their Age.
I think depression is correlated to  the study satisfaciton, meanshile financial stress and academic pressure may contribute to students depression 
  `)