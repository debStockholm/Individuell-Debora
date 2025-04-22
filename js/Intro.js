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

**_Why sorting by Degree?_** \n
Good question. I thought it would be the most accurate procedure to group students by something they have in common which 
can influence their wellbeing. The choice has fallen among Age, Degree and City they live in, even though we had more parameters. \n
I thought sorting by Degree made
sense because they should imply also a similar Age among the sample -  the range is wider than expected though.
For this reason, I tried to see if there was another pattern to follow: is there a correlation which the age and depression? Does the place you live in influence studnets wellbeing?

I made different graphs for each sorting, in order to find the most relevant pattern. Not sure if it makes sense.\n

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
      vAxis: { title: 'Average', format: '#\'%\'' },
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
According to the graph, _yes_: the older you get, the lowest depression rate you get. But this is not enough to see if there is a causation too!\n
_Is there a correlation between the city where the respondents live and depression?_\n
According to the graph, _no_: There's no clear linear trend across all cities — depression levels are fairly consistent with some variation. Perhaphs some weak pattern, but no strong correlation!
\n
________________`)

let statistics_about_data = await csvLoad('student_depression_dataset.csv')
let data_for_statistics = statistics_about_data.filter(x => x.Age <= 34 && x.Profession === 'Student' && x.Degree != 'Others')
//console.log(data_for_statistics)

let data_for_statistics_class12 = statistics_about_data.filter(x => x.Age <= 34 && x.Profession === 'Student' && x.Degree === 'Class12')
//console.log(data_for_statistics)

let mode_class12 = s.mode(data_for_statistics_class12.map(x => x.Age));
let avg_class12 = s.mean(data_for_statistics_class12.map(x => x.Age))

let students_degree_mode = s.modeFast(data_for_statistics_class12.map(x => x.Degree))
//console.log('modefast', students_degree_mode)


addMdToPage(`
  **The _mode Age_ and the _mean Age_ for 'Class 12' students is respectively _${mode_class12}_ and _${avg_class12.toFixed(1)}_.**
  Why is this important?\n
  We have seen that 'Class 12' students are the ones which the biggest percent of Depression among all the degree groups. We have also seen
  that Depression rates seem lowering the older you get. Being *20* the mode of Class 12 students, and *20.1* the average age, means
  that Class 12 higher depression rates may depend on the youngest respondents making the biggest part of the data.
  `)
/*Vanligaste region: ${ s.mode(data.map(x => x.region)) }
 
 Antal individer från Stockholm: ${ data.filter(x => x.region == 'Stockholm').length }
 Antal individer från Göteborg: ${ data.filter(x => x.region == 'Göteborg').length }
 Antal individer från Malmö: ${ data.filter(x => x.region == 'Malmö').length }


--GOTT OCH BLANDAT ALDER

MedelalderAll: ${ s.mean(data.map(x => x.age)) }
MedianalderAll: ${ s.median(data.map(x => x.age)) }
StAvvikAll: ${ s.standardDeviation(data.map(x => x.age)) }

YoungerPerson: ${ s.min(data.map(x => x.age)) }
oldestPerson: ${ s.max(data.map(x => x.age)) }

--KVINNOR ALDER
 Antal kvinnor:${ data.filter(x => x.gender == "female").length }
YngstaKvinnan: ${ s.min(data.filter(x => x.gender === 'female').map(x => x.age)) }
AldstaKvinnan: ${ s.max(data.filter(x => x.gender === 'female').map(x => x.age)) }

MedelalderKvinnor: ${ s.mean(data.filter(x => x.gender == 'female').map(x => x.age)) }
MedianalderKvinnor: ${ s.median(data.filter(x => x.gender == 'female').map(x => x.age)) }
StAvvik_Kvinnor: ${ s.standardDeviation(data.filter(x => x.gender == 'female').map(x => x.age)) }*/
