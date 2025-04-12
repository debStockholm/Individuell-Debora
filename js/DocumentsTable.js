import addMdtoPage from './libs/addMdToPage.js'

addMdtoPage(`
The total dataset includes **27901** rows.\n
But: There are _only_ 49 students are older than 34y.o., which in a 27k rows dataset can be considered 
out of the normal. Also, there is an handful of respondents whose Profession is not 'Student', which I deem
not relevant for the data. So I sorted them out.\n
**Students up to 34 y.o.** :
`)

let TotalStunderAge35 = await dbQuery(`
select count(*) as Total_students,
count(case when Gender='Female' then 1 end) as Female_students,
count(case when Gender='Male' then 1 end) as Male_students
FROM Depression_study_fix
where Age <= 34 and Profession = 'Student'
`)
tableFromData({
  data: TotalStunderAge35,
  columnNames: ['Total students', 'Ladies', 'Gentlemen']
})


addMdtoPage(`
In some cases, I wanna analyze according to the degree the students are pursuing. If there is no known degree in the dataset, 
the involved students are removed as well.\n
**Students up to 34 y.o. and with known Degree**:
`)


let TotalStunderAge35andNodegree = await dbQuery(`
select count(*) as Total_students,
count(case when Gender='Female' then 1 end) as Female_students,
count(case when Gender='Male' then 1 end) as Male_students
FROM Depression_study_fix
where Age <= 34 and Profession = 'Student' and Degree != 'Others'`)

tableFromData({
  data: TotalStunderAge35andNodegree,
  columnNames: ['Total students', 'Ladies', 'Gentlemen']
})
