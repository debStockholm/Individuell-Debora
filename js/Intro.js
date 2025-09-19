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
For this reason, I tried to see if there was another pattern to follow: is there a correlation which the age and depression? Does the place you live in influence students wellbeing?

I made different graphs for each sorting, in order to find the most relevant pattern... not sure if it makes sense. At the end of the analysis, probably Age would have been the most interesting factor to group things, but I liked the Degree parameters as well, so I left it somewhere\n

**_Let's also see how the statistics look like when data is sorted by the Age of the respondents or by the city they live in:_**\n

* Sorted by Age: _is Age correlated to depression?_`)

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
        title: 'Average',
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
addMdToPage(`* Sorted by City: _is the City you live in correlated to developing depression?_`)

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
      }, chartArea: {
        left: '10%',
        top: '15%',
        right: '5%',
        bottom: '25%'
      }
    },
    chartArea: {
      left: '10%'
    }
  });
}

let first_dropdown = addDropdown('Shows Depression in correlation with Age and City', ['Age and Depression', 'City and Depression'])

if (first_dropdown === 'Age and Depression') { age_sorted() };
if (first_dropdown === 'City and Depression') { city_sorted() };



addMdToPage(`

What the graphs tell us:\n 
_**Is there a correlation between the age of the respondents and depression?**_\n
According to the graph, _yes_: the older you get, the lowest depression rate you get. But age does not cause depression, so it's just correlation.\n Something really interesting, when researching the web, is common ground about
the age group where people experience depression the most: looks like late teenagers/young adults (18 - 27+) are the ones which experience depression the most, all accross the world. So this data truly 'makes sense'.
Read more in _'about Depression'_.\n
_**Is there a correlation between the city where the respondents live and depression?**_\n
Good question. There are so many factors which should be considered to underatand why some of the city have bigger gap between the respondents with and without depression: size of the city, poverty, climate and such.
I, honestly, prompted AI to make some logical consideration according to climate, urban areas and such, and got this back:\n

"1._**Urban vs. Smaller Cities**_:\n
Urban stress in large cities like Hyderabad, Ahmedabad, and Patna may be contributing to the higher depression rates. In bigger cities, people often face higher levels of stress related to work, commute, housing costs, and social isolation despite the high population.
These cities also tend to have better mental health awareness and infrastructure, which could mean depression rates are more accurately reported or more likely to be treated, leading to higher recognition of depression.
Smaller cities like Rajkot, Bhopal, and Vadodara may have less access to mental health care and stigma around mental health, making depression rates seem lower, but this could be due to underreporting or lack of care.

2. _**Poverty & Economic Disparities**_\n
Cities with higher poverty (e.g., Patna, Bhopal) may have more vulnerable populations that are more susceptible to depression. Economic challenges, unemployment, lack of social mobility, and insecurity often correlate with higher depression rates.
Higher income cities like Hyderabad and Ahmedabad still have significant depression rates, but it could be due to the pressures of city life, income inequality, and social isolation.\n

3. _**Healthcare Access**_:\n
Better access to mental health care in cities like Hyderabad and Ahmedabad could result in more people seeking help and thus a higher number of diagnosed depression cases. In smaller cities, access may be limited, leading to underreporting or fewer individuals receiving a diagnosis.

4. _**Social and Cultural Factors**_:\n
In large cities, there’s often a greater sense of anonymity and social disconnection, which can increase the likelihood of mental health struggles.
Smaller cities may have stronger community networks and family ties, which could help reduce the feeling of isolation and, in turn, reduce the prevalence of depression.

5. _**Climate & Environmental Factors**_:\n
Cities like Hyderabad and Ahmedabad have hotter climates, which may also contribute to mental health challenges (e.g., heat stress, sleep disturbances, and reduced outdoor activities).
Air pollution (which is often higher in big cities) could also play a role in increasing depression. Studies show that higher levels of pollution correlate with increased mental health issues in urban areas."
\n
\n
**I personally wouldn't say there is a correlation by living in a specific city and having depression,I would say there is a higher chance of depression when the city you lives in has specific characteristics**
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
  _An important correlation:_
  **The _mode Age_ and the _mean Age_ for 'Class 12' students is respectively _${mode_class12}_ and _${avg_class12.toFixed(1)}_.**\n
  Why is this important?\n
  We have seen that 'Class 12' students are the ones which the biggest percent of Depression among all the degree groups. We have also seen
  that Depression rates seem lowering the older you get. Being *20* the mode age of Class 12 students, and *20.1* the average age, means
  that Class 12 higher depression rates may depend on the youngest respondents making the biggest part of the data of this group.\n

  Another important consideration: Class 12 degree. In India, Class 12 can be compared to the last year of gymnasiet in Sweden.\n
  Students attending Class12 should be 17-18 y.o. . In our dataset, there are **6068** students attending ('pursuing') Class 12, of which **4503** are older than 18 y.o. (which should the age of 'studenten').\n
  According to Kaggle, the Degrees mentioned are the ones students are pursuing. I do actually think there may been a mistake considering the ages and stress, which means the Degree names would be the titles already atteinted.
  But I worked accordingly to Kaggles information.

  `)


/*queries Students age Class12:
  
select count(*) as class12_but_older
from Study_India
where Degree = 'Class12' and Profession = 'Student' and Age > 18;     

select count(*) as Total_class_12
from Study_India
where Degree = 'Class12' and Profession = 'Student' and Age >= 18 and Age <= 34   
//why 34? See documentation. */