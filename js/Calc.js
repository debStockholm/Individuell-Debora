addMdToPage(`
## Total of students taken into account up till 34y.o., sorted by gender`)

let TotalStunderAge35 = await dbQuery(`
select count(*) as Total_students,
count(case when Gender='Female' then 1 end) as Female_students,
count(case when Gender='Male' then 1 end) as Male_students
FROM Depression_study_fix
where Age <= 34 and Profession = 'Student'
`)

tableFromData({
  data: TotalStunderAge35,
  columnNames: ['Total students', 'Girls', 'Guys']
})

//_______________________________________________________________________________________//


addMdToPage(`
## Students sorted by education atteintment AND the average age:
`)

let sorting2 = await dbQuery(`
  SELECT 
  COUNT(*) as Total_Students,
  round(AVG(Age)) as Avg_Age,
    CASE 
        WHEN Degree IN ('B.Ed', 'B.Com', 'B.Arch', 'BCA', 'B.Tech', 'BHM', 'BSc', 'B.Pharm', 'BBA', 'BE', 'LLB', 'BA') THEN 'Bachelors'
        WHEN Degree IN ('ME', 'MHM', 'LLM', 'MA', 'MBA', 'MD', 'M.Pharm', 'MBBS', 'M.Com', 'M.Ed', 'M.Tech', 'MCA', 'MSc') THEN 'Masters'
        WHEN Degree = 'PhD' THEN 'PhD'
        WHEN Degree = 'Class12' THEN 'High schools' 
        ELSE 'Others'
    END AS group_by_category
FROM Depression_study_fix
WHERE Age <= 34
GROUP BY group_by_category
ORDER BY Avg_Age Asc;
  `)

console.log(sorting2)

tableFromData({
  data: sorting2,
  columnNames: ['Total students', 'Average_age', 'Degree atteined']
})



  (`## Sort all students by level of education atteintment AND gender:
`)

let sortingbyDegreeandGender = await dbQuery(`
  SELECT 
    Degree, 
    Gender, 
    Students_with_depression, 
    round((Students_with_depression * 100.0 / (Students_with_depression + Students_without_depression)),1) || '%' AS with_depression,
    Students_without_depression,
    round((Students_without_depression * 100.0 / (Students_with_depression + Students_without_depression)),1) || '%' AS without_depression
FROM Students_sorted_by_education
ORDER BY Degree, Gender
  
`)

tableFromData({
  data: sortingbyDegreeandGender,
  columnNames: ['Education level', 'Gender', 'with depression', '%', 'no depression', '%']
});

//__________________________________________________________________________________//

addMdToPage(`
Sorting first: 
## Sort all students by level of education atteintment, regardless of the gender:
`)

let sortingbyDegree = await dbQuery(`
  select count(*) as Total_students_per_degree, Degree, 
sum(case when Depression=0 then 1 else 0 end) as no_depression,
round((SUM(CASE WHEN Depression = 0 THEN 1 ELSE 0 END) * 100.0/count(*)),1)||'%' AS nd_percent,
sum(case when Depression=1 then 1 else 0 end) as with_depression,
round((SUM(CASE WHEN Depression = 1 THEN 1 ELSE 0 END) * 100.0/count(*)),1) ||'%' AS wd_percent
from Depression_Study 
group by Degree 
order by Total_students_per_degree desc`)
console.log(sortingbyDegree);

tableFromData({
  data: sortingbyDegree,
  columnNames: ['Total students per degree', 'Education level', 'no depression', '%', 'with depression', '%']
});


addMdToPage(`
If we look closer to the stats, we can sort out the groups with the highest depression rates:
`)

let top5 = await dbQuery(`
 SELECT Degree, 
Gender,
with_depression 
from Sorted_by_education
order by with_depression desc
limit 5
 `)


tableFromData({
  data: top5,
  columnNames: ['Education level', 'Gender', 'with depression']
});


let bottom5 = await dbQuery(`
 SELECT Degree, 
Gender,
with_depression 
from Sorted_by_education
order by with_depression asc
limit 5
 `)

tableFromData({
  data: bottom5,
  columnNames: ['Education level', 'Gender', 'with depression']
});






let Top5 = await dbQuery(`
  SELECT Degree, Gender, with_depression, without_depression,
round(abs(with_depression - without_depression),1) as max_percent_gap 
from Sorted_by_education 
order by max_percent_gap desc 
limit 5
`)

tableFromData({
  data: Top5,
  columnNames: ['Education level', 'Gender', 'with depression', 'no depression', 'gap i%']
});
