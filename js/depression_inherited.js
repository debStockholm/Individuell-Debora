addMdToPage(`
## Is there a correlation between Mental health issues running through the family and the outcome in our students?

Here a table which shows the % of Depression in students when they have reported Mental Health issues within the family.\n
Table explained:
* **Dep + MhH**: _**with**_ Depression and _**with**_ Mental health issues  in the family;
* **Dep + no_MhH**: _**with**_ Depression and _**without**_ Mental health issues  in the family;
* **no_Dep + MhH**: _**without**_  Depression and _**with**_  Mental health issues  in the family;
* **no_Dep + no_MhH**: _**without**_  Depression and _**without**_ Mental health issues  in the family
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

tableFromData({
  data: dep_and_inheritance,
  columnNames: ['Dep + MhH', '%', 'no_Dep + MhH', '%', 'Dep + no_MhH', '%', 'no_Dep + no_MhH', '%']
})

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
history in the family than the other group, but if we compare Depression + MhH and Depression + no_MhH, the % are quite similar - 30% and 29%. \n 
Depression is a multi-factorial 'illness' which cannot depend only on genetics\n

Please read more in 'About Depression'
  `)

addMdToPage(`
  ## Is there a correlation between Depression and Dietary habits? \n
  Students _**with**_ Depression have the following eating habits:
  `)

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

tableFromData({
  data: dep_and_dietaryhabits,
  columnNames: ['Total_students_with_Depression', 'Healthy_%', 'Moderate_%', 'Unhealthy_%']
})

addMdToPage(` 
  Students _**without**_ Depression have the following eating habits:
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
Age <= 34 and Degree != 'Others' AND Profession = 'Student' and Depression= 0
`)

tableFromData({
  data: dep_and_dietaryhabits_2,
  columnNames: ['Total_students_withOUT_Depression', 'Healthy_%', 'Moderate_%', 'Unhealthy_%']
})



let data_dietary_Depression = [
  ['Type', '%', { role: 'tooltip' }],
  ['Healthy', 21, 'Healthy'],
  ['Moderate', 34, 'Moderate'],
  ['Unhealthy', 45, 'Unhealthy']
];


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

let data_dietary_No_Depression = [
  ['Type', ' % ', { role: 'tooltip' }],
  ['Healthy', 36, 'Healthy'],
  ['Moderate', 38, 'Moderate'],
  ['Unhealthy', 26, 'Unhealthy']
]

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

