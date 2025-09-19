addMdToPage(`
## Education and depression: academic - related data wrapped

**_Is there a correlation between having depression and school performance?_**\n
Let's make a graph comparing averages of answers among the students with declared depression and the ones without declared depression.
\n

Value scales of the different parameters:
* **Academic performance**: 0 - 10
* **Academic pressure**: 0 - 5
* **Study satisfaction**: 0 - 5
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
    height: 450,
    title: 'School related statistics of students WITHOUT DEPRESSION',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#43a047', '#26a69a', '#00acc1', '#29b6f6'],
    vAxis: { title: 'Average' },
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
    height: 450,
    title: 'School-related statistics of students WITH DEPRESSION',
    legend: { position: 'top', textStyle: { color: 'black', fontSize: 14 } },
    colors: ['#f06292', '#f48fb1', '#ffeb3b', '#ffa726'],
    vAxis: {
      title: 'Average'
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

* **CGPA**(students overall performance) is quite similar in both students with depressions and the one without depression, and it's alot similar among the different degrees;
* **Academic Pressure**: on average, students _with depression feels a higher_ Acedemic pressure than the counterpart, all over the degrees;
* **Daily hours of study**:  on average, students _with depression have more_ study hours than the counterpart, all over the degrees;
* **Study Satisfaction**: on average, students _with depression fells a lower_ study satisfaction than the counterpart, all over the degree
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
        left: '10%', top: '15%', right: '10%', bottom: '20%'
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
        left: '10%', top: '15%', right: '10%', bottom: '20%'
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
  having count(*) > 50`)

let avg_city_academic = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_avg_city),
    options: {
      height: 500,
      width: 1350,
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
        left: '5%', top: '15%', right: '5%', bottom: '20%'
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
  having count(*) > 50`)

let avg_city_academic_2 = function () {
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(students_avg_city_2),
    options: {
      height: 500,
      width: 1350,
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
        left: '5%', top: '15%', right: '5%', bottom: '20%'
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

addMdToPage(`
What does the graphs tell us:\n

Age and City doesn't seem to influence the CGPA, the hours you study, the academic stress perceived and your study satisfaction.
Trendlines are quite linear so there's no real correlation between the axis.
`)

//_____________________________________WORK SO FAR__________________






addMdToPage(`

  _______________________________

## Is there a correlation between perceiving financial stress and experiencing depression ?
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
Those stats can be studied more: \n
* **is there a connection about age and financial stress perceived ?**\n
* **is there a connection between the city students lives in and financial stress perceived ?** `)

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
      chartArea: {
        left: '10%', top: '15%', right: '10%', bottom: '20%'
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
_____________________
_**What does the graphs tell us:**_
* **Age** and **City** doesn't seem to influence depression rates. The avg financial stress perceived throught the different ages and the different cities shows is quite linear, so there's no real correlation.\n 
But do we have any causation?\n
This is a tricky question: financial issues can contribuites to develop depression and they're a known triggering factor; but it's often overlooked that it can be also the other way around!
Being depressed can cause to underperform at work/study and perhaphs causing financial issues. Or there can be financial issues in the family. Hard to tell the reason behind the financial stress from this data.
`)