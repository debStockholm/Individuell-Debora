/*let depression_percent = await dbQuery(` select Degree,
  COUNT(CASE WHEN Depression = 0 THEN 1 END) AS count_noDep,
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*)) AS p_noDep,
  COUNT(CASE WHEN Depression = 1 THEN 1 END) AS count_withDep,
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*)) AS p_withDep
FROM 
    Study_India
WHERE 
    Age <= 34 AND Degree != 'Others' and Profession='Student'
GROUP BY 
    Degree
  `)

tableFromData({
  data: depression_percent,
  columnNames: []
})


addMdToPage(` 
  _____________________________________
**Results**: \n
According to filters, there are many similarities among students attending the same Degree \n
_SleepDuration_: according to classification (look:Documentation) an average SleepDuration of 1.4 (with depression) , 1.5 (no depression) means that students 
have average sleeping hours laying beetween 5-6 hours sleep and 7-8 hour sleep. 
So around 6.5hours sleep per night.\n
The ideal sleep time for an adult is between 7-9 hours, which means our Class12 students 'lacks' some extra hour of sleep.\n
Going deeper on analysis, we can see that, while the sleeptime of students withOUT Depression is almost equally shared in all the 'sleep duration slots',
for the students with Depression we can see that 32% of them have a sleep schedule of less than 5 hours per night(1378/4303, 32%), which is adjusted by the 26% which sleeps 7-8 hours per night.\n
They also show same values in CGPA performance indicator.\n
Differences we can consider:
* _Average Age_: the Average age of the students without depression in a unit greater (almost a year older) than the the ones with depression; are older students more 'chill'?;
* _AcademicPressure_: there is significant difference in those values. Students _without depression_ feel _**significantly lower**_ academic pressure than the counterpart;
* _StudySatisfaction_: students _without Depression_ looks a _**bit more**_ satified than the counterpart about the overall studies;
* _FinancialStress_: students _with Depression_ shows a _**significantly higher**_ financial stress factor than the counterpart;
* _Average_Study_hours_:  students _with Depression_ dedicate _**more than**_ 1.5 hours to studying, compared to the countepart.
` )


addMdToPage(`
  **Results**: \n
According to filters, there are many similarities among students attending the same Degree: \n
_SleepDuration_: according to classification (look at Documentation) an average SleepDuration of 1.3(with depression) , 1.5 (no depression) means that students
have average sleephours which lays beetween 5-6 hours sleep and 7-8 hour sleep.
So around 6.5hours sleep per night.\n
The ideal sleep time for an adult is between 7-9 hours, which means our Bachelors students also 'lacks' some extra hour of sleep.\n
Going deeper on analysis, we can see that, while the sleeptime of students withOUT Depression is almost equally shared in all the 'sleep durations slots',
for the students with Depression we can see that 33% of them have a sleep schedule of less than 5 hours per night(2409/7094, 33%), which is adjusted by the 26% which sleeps 7-8 hours per night.\n
_Interesting, is almost alike the % we had for Class 12 students!_\n

They also show same values in CGPA performance indicator.\n
Differences we can consider:
* _Average Age_: the Average age of the students without depression in a unit greater (1.5 years older) than the the ones with depression; are older students more 'chill'?;
* _AcademicPressure_: there is significant difference in those values. Students _without depression_ feels _**significantly lower**_ academic pressure than the counterpart;
* _StudySatisfaction_: students _without Depression_ looks _**a bit less**_ satified than the counterpart about the overall studies;
* _FinancialStress_: students _with Depression_ shows a _**significantly higher**_ financial stress factor than the counterpart;
Average_Study_hours_:  students _with Depression_ dedicate _**more than**_ 1.5 hours to studying, compared to the countepart.

` )*/

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


//__________Depression and genetics
addMdToPage(`
## Is there a correlation between Mental health issues running through the family and the outcome in our students?
  `)



let dep_and_inheritance = await dbQuery(`select 
  COUNT(CASE WHEN Depression = 1 and MentalHealthHistory = 'Yes' THEN 1 END) AS YesD_yesMHH,
  ROUND(COUNT(CASE WHEN Depression = 1 and MentalHealthHistory = 'Yes' THEN 1 END) * 100.0 / COUNT(*),1) AS percent1,
  COUNT(CASE WHEN Depression = 0 and MentalHealthHistory = 'Yes' THEN 1 END) AS NoD_yesMHH,
  ROUND(COUNT(CASE WHEN Depression = 0 and MentalHealthHistory = 'Yes' THEN 1 END) * 100.0 / COUNT(*),1) AS percent_3,
  COUNT(CASE WHEN Depression = 1 and MentalHealthHistory = 'No' THEN 1 END) AS YesD_noMHH,
  ROUND(COUNT(CASE WHEN Depression = 1 and MentalHealthHistory = 'No'   THEN 1 END) * 100.0 / COUNT(*),1) AS percent_2,
  COUNT(CASE WHEN Depression = 0 and MentalHealthHistory = 'No' THEN 1 END) NoD_noMHH,
  ROUND(COUNT(CASE WHEN Depression = 0 and MentalHealthHistory = 'No' THEN 1 END) * 100.0 / COUNT(*),1) AS percent4
FROM
Study_India
WHERE
Age <= 34 AND Degree != 'Others' AND Profession = 'Student'
`)

//Data below comes from query!



let data_MhH_and_Depression =
  [
    ['Type', 'percent'],
    ['Depressed and WITH Mental health history in family', 29.6],
    ['Depressed and WITHOUT Mental health history in family', 28.9],
    ['No depression but WITH Mental health history in family', 18.7],
    ['No depression and WITHOUT Mental health history in family', 22.7]
  ]

drawGoogleChart({
  type: 'PieChart',
  data: data_MhH_and_Depression,
  options:
  {
    title: 'Depression and Inheritance',
    height: 500,
    legend: { position: 'right' },
    chartArea: { left: '10%' },
    colors: ['#050180', '#1d0af0', '#6ded42', '#069155']
  }
})

addMdToPage(`
According to our dataset it's hard to affirm a correlation/causality between 
having a Mental health issues history running in the family and the current depression study.\n
It's true that the % of students with depression in higher among students with recorded Mental Health
history in the family than the other group, but if we compare Depression and familiar mental health history and Depression eithout familiar mental health history, the % are quite similar - 30% and 29%. \n 


Please read more in 'About Depression'
  `)
