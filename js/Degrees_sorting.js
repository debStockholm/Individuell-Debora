//_________INTRO: sorting by Degree
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

**_Let's also see how the statistics look like when data is sorted by the Age of the respondents or by the city they live in:_**\n

* Sorted by Age: is Age correlated to depression?`)

let age_1_sort = await dbQuery(`
  select 
 Age,
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*)) AS 'without depression',
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*)) AS 'with depression'
FROM Study_India
WHERE Age <= 34 AND Degree != 'Others' and Profession = 'Student'
group by Age
order by Age asc`)

let age_sorted = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(age_1_sort),
    options: {
      height: 500,
      title: 'Age and %',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#ffcc99', '#1f78b4'],
      vAxis: {
        title: 'Average %',
        format: '#\'%\''
      },
      hAxis: {
        title: 'Age',
        ticks: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
        seriesType: 'bars',
        slantedText: true,
        slantedTextAngle: 45
      },
      tooltip: { trigger: 'focus' },
      trendlines: {
        0: {
          type: 'linear',
          degree: 2,
          color: '#ff9933',
          lineWidth: 2,
          opacity: 0.7,
          showR2: true
        },
        1: {
          type: 'linear',
          degree: 2,
          color: '#3366cc',
          lineWidth: 2,
          opacity: 0.7,
          showR2: true
        }
      }
    },
    chartArea: { left: '10%' }
  });
}


addMdToPage(`* Sorted by City: is the City you live in correlated to depression?`)

let city_1_sort = await dbQuery(`
  select City,
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*)) AS 'without depression',
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*)) AS 'with depression'
FROM Study_India
WHERE Age <= 34 AND Degree != 'Others' and Profession = 'Student'
group by City
having count(*) > 50
order by City asc`)

let city_sorted = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(city_1_sort),
    options: {
      height: 500,
      width: 1300,
      title: 'City and %',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#22c777', '#c4316e'],
      vAxis: { title: 'Average %', format: '#\'%\'' },
      hAxis: { title: 'City' },
      seriesType: 'bars',
      slantedText: true,
      slantedTextAngle: 45,
      tooltip: { trigger: 'focus' },
      trendlines: {
        0: {
          type: 'polynomial',
          degree: 2,
          color: '#088a52',
          lineWidth: 2,
          opacity: 0.7,
          showR2: true
        },
        1: {
          type: 'polynomial',
          degree: 2,
          color: '#3366cc',
          lineWidth: 2,
          opacity: 0.7,
          showR2: true
        }
      }
    },
    chartArea: { left: '10%' }
  });
}

let first_dropdown = addDropdown('Shows Depression in correlation with Age and City', ['Age and Depression', 'City and Depression'])

if (first_dropdown === 'Age and Depression') { age_sorted() };
if (first_dropdown === 'City and Depression') { city_sorted() };



addMdToPage(`

What the graphs tell us:\n 
_Is there a correlation between the age of the respondents and depression?_\n
According to the graph, _yes_: the older you get, the lowest depression rate you get. But this is not enough to stte if there is a causation too!\n
_Is there a correlation between the city where the respondents live and depression?_\n
According to the graph, _no_: There's no clear linear trend across all cities — depression levels are fairly consistent with some variation. Perhaps soem weak pattern, but no strong correlation!
\n
________________


## Education and depression: academic-related data wrapped

_**Is there a pattern between having depression and school performance?**_ \n
Let's make a graph comparing averages of answers among the students with declared depression and the ones without declared depression.
\n

Value scales of the different parameters:
* **Academic performance**: 0 - 10
* **Academic pressure**: 0-5
* **Study satisfaction**: 0- 5
* **Daily hours of study**: 0 - 12 `)

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
  tooltip: { trigger: 'focus' },
  chartArea: { left: '10%' }
});

addMdToPage(`_______________________`)

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
  tooltip: { trigger: 'focus' },
  chartArea: { left: '10%' }
});



addMdToPage(`
_____________________
_**What does the graph tell us:**_

* CGPA (students overall performance) is quite similar in both students with depressions and the one without depression, and it's alos similar among the different degrees;
* Academic Pressure: on average, students _with depression feels a higher_ Acedemic pressure than the counterpart, all over the degrees;
* Daily hours of study:  on average, students _with depression have more_ study hours than the counterpart, all over the degrees;
* Study Satisfaction: on average, students _with depression fells a lower_ study satisfaction than the counterpart, all over the degree
_____________

**Let's try to see if there is any correlation among those academic related values and age/city of the respondent:**
`)

let students_AVG_no_dep_2222 = await dbQuery(`
  select Age,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 0 and Degree != 'Others' and Profession = 'Student' and Age <= 34
  group by Age
  order by Age asc`)

let avg_age_academic = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_AVG_no_dep_2222),
    options: {
      height: 500,
      width: 1200,
      title: 'Academic performace and Age',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#88c999', '#f4b183', '#5aa9e6', '#f28482'],
      vAxis: {
        title: 'Average',
      },
      hAxis: {
        title: 'Age',
        ticks: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
        seriesType: 'bars',
        slantedText: true,
        slantedTextAngle: 45
      },
      chartArea: {
        left: '5%', top: '10%', right: '5%', bottom: '15%'
      },
      tooltip: { trigger: 'focus' },
      trendlines: {
        0: {
          type: 'linear',
          degree: 1,
          color: '#6b9c7d'
        },
        1: {
          type: 'linear',
          degree: 1,
          color: '#e1a45b'
        },
        2: {
          type: 'linear',
          degree: 1,
          color: '#4997c1'
        },
        3: {
          type: 'linear',
          degree: 1,
          color: '#d1686e'
        }
      }
    },
    chartArea: { left: '10%' }
  });
}

//_______________

let students_AVG_dep_221 = await dbQuery(`
  select Age,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 1 and Degree != 'Others' and Profession = 'Student' and Age <= 34
  group by Age
  order by Age asc`)

let avg_age_academic_2 = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_AVG_dep_221),
    options: {
      height: 500,
      width: 1200,
      title: 'Academic performace and Age',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
      vAxis: {
        title: 'Average',
      },
      hAxis: {
        title: 'Age',
        ticks: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
        seriesType: 'bars',
        slantedText: true,
        slantedTextAngle: 45
      },
      chartArea: {
        left: '5%', top: '10%', right: '5%', bottom: '15%'
      },
      tooltip: { trigger: 'focus' },
      trendlines: {
        0: {
          type: 'linear',
          degree: 1,
          color: '#ff9933'
        },
        1: {
          type: 'linear',
          degree: 1,
          color: '#3366cc'
        },
        2: {
          type: 'linear',
          degree: 1,
          color: '#2ca02c'
        },
        3: {
          type: 'linear',
          degree: 1,
          color: '#d62728'
        }
      }
    },
    chartArea: { left: '10%' }
  });
}

let students_avg_city = await dbQuery(`
  select City,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 0 and Degree != 'Others' and Profession = 'Student' and Age <= 34
  group by City
  having count(*) > 50
  order by City asc
  limit 10`)

let avg_city_academic = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_avg_city),
    options: {
      height: 500,
      width: 1200,
      title: 'Academic performace and City',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#f2a800', '#ff5733', '#d85b00', '#ff8e00'],
      vAxis: {
        title: 'Average',
      },
      hAxis: {
        title: 'City',
        seriesType: 'bars',
        slantedText: true,
        slantedTextAngle: 45
      },
      chartArea: {
        left: '5%', top: '10%', right: '5%', bottom: '15%'
      },
      tooltip: { trigger: 'focus' },
    },
    chartArea: { left: '10%' }
  });
}

let students_avg_city_2 = await dbQuery(`
  select City,
  round(avg(CGPA), 2) as 'Academic performance',
  round(avg(AcademiPressure), 1) as 'Academic pressure',
  round(avg(StudySatisfaction), 1) as 'Study satisfaction',
  round(avg(WorkStudyhours), 1) as 'Daily hours of study'
from Study_India
where Depression = 1 and Degree != 'Others' and Profession = 'Student' and Age <= 34
  group by City
  having count(*) > 50
  order by City asc
  limit 10`)

let avg_city_academic_2 = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_avg_city_2),
    options: {
      height: 500,
      width: 1200,
      title: 'Academic performace and City',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#6a5d3f', '#c7b99e', '#8e8b66', '#b49b74'],
      vAxis: {
        title: 'Average',
      },
      hAxis: {
        title: 'City',
        seriesType: 'bars',
        slantedText: true,
        slantedTextAngle: 45
      },
      chartArea: {
        left: '5%', top: '10%', right: '5%', bottom: '15%'
      },
      tooltip: { trigger: 'focus' },
    },
    chartArea: { left: '10%' }
  });
}

let second_dropdown = addDropdown('Shows Academic data in correlation with Age and City', ['Age and no depression', 'Age and with depression', 'City and no depression', 'City and with depression'])

if (second_dropdown === 'Age and no depression') { avg_age_academic() };
if (second_dropdown === 'Age and with depression') { avg_age_academic_2() };
if (second_dropdown === 'City and no depression') { avg_city_academic() };
if (second_dropdown === 'City and with depression') { avg_city_academic_2() };

//_____________________________________WORK SO FAR__________________


addMdToPage(`
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
on the contrary, there is a huge gap showing that students _with depression experience higher_ financial concern than the counterpart.\n
Those stats can be studied more:\n 
**_is there a connection about age and financial stress perceived?_**\n
**_is there a connection between the city students lives in and financial stress perceived?_**`)


//____Age statistics and graph
let students_age_fs = await dbQuery(`select 
 cast(Age as char) as Age,
  round(avg(CASE WHEN Depression = 1 THEN FinancialStress END), 1) as 'With Depression',
  round(avg(CASE WHEN Depression = 0 THEN FinancialStress END), 1) as 'Without Depression'
from Study_India 
  where Profession = 'Student' and Age <= 34
  group by Age
order by Age asc `)

let ages_d = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_age_fs),
    options: {
      height: 300,
      title: 'Financial stress/Age',
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
  });
};

//  City statistics and graph
let citystats = await dbQuery(`select 
 City,
  round(avg(CASE WHEN Depression = 1 THEN FinancialStress END), 1) as 'With Depression',
  round(avg(CASE WHEN Depression = 0 THEN FinancialStress END), 1) as 'Without Depression'
from Study_India 
  where Profession = 'Student' and Degree != 'Others' and Age <= 34 
  group by City
  having count(*) > 50
order by City asc `)


let cities_d = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(citystats),
    options: {
      height: 500,
      width: 1300,
      title: 'Financial Stress/City',
      legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
      colors: ['#88c999', '#f4b183'],
      vAxis: {
        title: 'Average',
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
};





let city_and_age_stats = addDropdown(`Shows Age and City related stats`, ['Age', 'City']);

if (city_and_age_stats === 'Age') { ages_d() };
if (city_and_age_stats === 'City') { cities_d() };


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





//____________SHAPIROKOD!:
// SHAPIROKOD:    let result = stdLib.stats.shapiroWilkTest(data);
//result['Normalfördelning?'] = result.p >= 0.05 ? 'Ja' : 'Nej';






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