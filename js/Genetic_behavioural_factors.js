
addMdToPage(`
  ## Behavioural/genetic factors and depression: 'heredity', sleep and dietary related information

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
Age <= 34 and Degree != 'Others' AND Profession = 'Student' and Depression = 1 and DietaryHabits != 'Others'
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
Age <= 34 and Degree != 'Others' AND Profession = 'Student' and Depression = 0 and DietaryHabits != 'Others'
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

addMdToPage(`
_What do the graphs tell us:_
Looks like the students which are affected by depression tend to have worse dietary habits than the counterpart; it's also a kind of a chicken-and-egg situation: your diet can contribute to worsen your health, but depression can influence your eating habits.
Read more on 'about Depression'.

**Extra: how do students eat through the Ages?**

We have observed that younger students tend to experiment depression more.\n
In the first pie graph we see that almost half of the students having depression eats unhealthy, and only around 20% eats healthy.\n
In the second pie graph, we see that only about 25% of the students eats unhealthy, and more than 35% eats healthy. \n
So I was curious to see if the Age was a factor to determine experiencing depression linked to dietary habits. \n
Meaning: _Are the youngest students, which experience depression the most, the ones that eat mostly unhealthy?_\n
Here the graph: 
  `)

let data_dietary_table = await dbQuery(`select Age,
  round(100.0 * sum(case when DietaryHabits = 'Healthy' then 1 else 0 end)/count(*), 1) as eatHealthy,
  round(100.0 * sum(case when DietaryHabits = 'Moderate' then 1 else 0 end)/count(*), 1) as eatModerate,
  round(100.0 * sum(case when DietaryHabits = 'Unhealthy' then 1 else 0 end)/count(*), 1) as eatUnhealthy
  from Study_India 
where Age <= 34  and Degree != 'Others' AND Profession = 'Student' and DietaryHabits != 'Others'
group by Age
order by eatUnhealthy desc`)

/*tableFromData({
  data: data_dietary_table,
  columnNames: ['Age', '% eat healthy', '% eat moderate', '% eat unhealthy']
})
*/

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(data_dietary_table),
  options: {
    height: 500,
    width: 1200,
    title: 'Dietary and Age',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#66c2a5', '#fc8d62', '#8da0cb'],
    vAxis: {
      title: 'Average',
      format: '#\'%\'',
      minValue: 0
    },
    hAxis: {
      title: 'Ages',
      ticks: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
      seriesType: 'bars',
      slantedText: true,
      slantedTextAngle: 45
    },
    trendlines: {
      0: { color: '#1b7e2b' },
      1: { color: '#cc5500' },
      2: { color: '#1426b3' }
    },
    chartArea: {
      left: '5%', top: '10%', right: '5%', bottom: '15%'
    },
    tooltip: { trigger: 'focus' },
  },
  chartArea: { left: '10%' }
});


addMdToPage(`
So yes, apperently we can see a kind  of connection: youngest students, which experience depression the most, are the ones with the 'worst' eating habits.\n
Also, we can see that eating habits get better when getting older.
_____________________________________________
______________________________________________
 `)


//_________________________

addMdToPage(`
## Is there a correlation between sleeping habits and depression?

_**Dataset columns explained**_:

*  **SleepDuration** values, associated:
    * 0 = less than 5 hours sleep
    * 1 = 5-6 hours sleep
    * 2 = 7-8 hours sleep
    * 3 = more then 8 hours sleep
    * 4 = others, not specified 
  `)

let sleeping_habit_tab = await dbQuery(`select Degree, 
round(avg(case when Depression = 1 then SleepDuration end), 1) as avg_with_depression,
round(avg(case when Depression = 0 then SleepDuration end), 1) as avg_no_depression
from Study_India
where Age <= 34  and Degree != 'Others' AND Profession = 'Student' 
group by Degree
  `)

tableFromData({
  data: sleeping_habit_tab,
  columnNames: ['Degree', 'Sleep avg with depression', 'Sleep avg without depression']
})

addMdToPage(`without grouping, it looks like:`)

let sleeping_habit_tab_nogroup = await dbQuery(`select 
round(avg(case when Depression = 1 then SleepDuration end), 1) as avg_with_depression,
round(avg(case when Depression = 0 then SleepDuration end), 1) as avg_no_depression
from Study_India
where Age <= 34  and Degree != 'Others' AND Profession = 'Student' 
  `)

tableFromData({
  data: sleeping_habit_tab_nogroup,
  columnNames: ['Sleep avg with depression', 'Sleep avg without depression']
})

addMdToPage(`
_What does the tables tell us:_\n
The average Sleeping duration of studets with Depression is 1.3 , meaning most of the students has between 5-6 hours sleep and 
7-8 hours sleep per night. Same for the ones without depression, which got on average of 1.5. The values with 0 are taken into account when calculating the mean.
Sleep duration can be an important factor correlated with depression; it can contribute to the illness, but can also be caused by it.`)





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
_What does the  graphs tell us:_\n
According to our dataset it's hard to affirm a correlation/causality between 
having a Mental health issues history running in the family and the current depression study.\n
It's true that the % of students with depression in higher among students with recorded Mental Health
history in the family than the other group, but if we compare Depression and familiar mental health history and Depression eithout familiar mental health history, the % are quite similar - 30% and 29%. \n 


Please read more in 'About Depression'
  `)
