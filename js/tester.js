// _________SHAPIRO______________________________
addMdToPage(`
## Tests for the dataset: Shapiro and T-test

**First test, ShapiroWilk: is my data normally distributed?**

I'll test different columns: `)


let dataforShapiro = await csvLoad('student_depression_dataset.csv')
//console.log('data check', dataforShapiro)

let dataforShapiro_filtered = dataforShapiro.filter(x => x.Age <= 34) //Why this? Please see documentation!


//PS ShapiroTest for Age and CGPA columns works even if I do not limit/filter the Age! See comment below:

/* SHAPIRO UTAN AGE FILTER!   ->
let dataShapiroTest2 = await csvLoad('student_depression_dataset.csv')

let dataforShapiro_045 = dataforShapiro_NO_filtered.map(x => x.Age)
let dataforShapiro_046 = dataforShapiro_NO_filtered.map(x => x.CGPA)
let result_dS045 = stdLib.stats.shapiroWilkTest(dataforShapiro_045)
let result_dS046 = stdLib.stats.shapiroWilkTest(dataforShapiro_046)
let p1Value = result_dS045.p
let p1Value_1 = result_dS046.p
console.log(result_dS045)  / console.log(result_dS046)   */

addMdToPage(`
* **_test CGPA column_**\n
_Noll hypotes_: my data is normally distributed: p.value > 0.05;\n
_Alternativ hypotes_: my data is NOT normally distributed: p.value <= 0.05 `)
let dataforShapiro_1 = dataforShapiro_filtered.map(x => x.CGPA);
//console.log('Slutgiltig data = CGPA', dataforShapiro_1)
let result_1 = stdLib.stats.shapiroWilkTest(dataforShapiro_1)
let pValue = result_1.p
//console.log(result_1)

addMdToPage(` 
Results for CGPA values: _w.value_ = **${result_1.w.toFixed(5)}**, _p.value_= **${result_1.p.toFixed(2)}**.
My data is normally distributed according to CGPA values.`)



addMdToPage(`
* **_test Age column_**\n
_Noll hypotes_: my data is normally distributed: w.value > 0.05;\n
_Alternativ hypotes_: my data is NOT normally distributed: p.value <= 0.05 `)
let dataforShapiro_2 = dataforShapiro_filtered.map(x => x.Age);
//console.log('Slutgiltig data = Age', dataforShapiro_2)
let result_2 = stdLib.stats.shapiroWilkTest(dataforShapiro_2)
let pValue_2 = result_2.p
//console.log(result_2)


addMdToPage(` 
Results for Age values: _w.value_ = **${result_2.w.toFixed(5)}**, _p.value_= **${result_2.p.toFixed(2)}**.
My data is normally distributed according to Age values.`)


addMdToPage(`
* **_test Study hours column_**\n
_Noll hypotes_: my data is normally distributed: w.value > 0.05;\n
_Alternativ hypotes_: my data is NOT normally distributed: p.value <= 0.05 `)
let dataforShapiro_4 = dataforShapiro_filtered.map(x => x.WorkStudyHours);
//console.log('Slutgiltig data = Age', dataforShapiro_2)
let result_4 = stdLib.stats.shapiroWilkTest(dataforShapiro_4)
let pValue_4 = result_4.p
console.log(result_4)


addMdToPage(` 
Results for Study hoursvalues: _w.value_ = **${result_4.w.toFixed(5)}**, _p.value_= **${result_4.p.toFixed(2)}**. FAILED!
**OBS** Datatest doesn't work with this 'poor' range of values`)


addMdToPage(`
* **_test Financial stress column_**\n
_Noll hypotes_: my data is normally distributed: p.value > 0.05;\n
_Alternativ hypotes_: my data is NOT normally distributed: p.value <= 0.05 `)
let dataforShapiro_3 = dataforShapiro_filtered.map(x => x['Financial Stress']);
//console.log('Slutgiltig data = Financial stress', dataforShapiro_3)
let result_3 = stdLib.stats.shapiroWilkTest(dataforShapiro_3)
let pValue_3 = result_3.p
//console.log(result_1)

addMdToPage(` 
Results for Financial Stress values: _w.value_ = **${result_3.w.toFixed(5)}**, _p.value_= **${result_3.p.toFixed(2)}**. FAILED!
**OBS** Datatest doesn't work with this 'poor' range of values\n`)



//______________________________________T-TEST Males VS Females CGPA and Depression________________________

addMdToPage(`____________________________________________
  ______________________________________________________
  _______________________________________________________
  ________________________________________________________
  
  **T-TEST males VS females CGPA and Depression**`)

let dataforTTEST = await csvLoad('student_depression_dataset.csv')

let datafiltering_1female = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Female' && x.Depression === 1)
//console.log('Female depression', datafiltering_1female)
let datafiltering_2female = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Female' && x.Depression === 0)
//console.log('Female without depression', datafiltering_2female)  
let datafiltering_1male = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Male' && x.Depression === 1)
//console.log('Male depression', datafiltering_1male)   funkar
let datafiltering_2male = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Male' && x.Depression === 0)
//console.log('Male without depression', datafiltering_2male)



let female_with_depression = datafiltering_1female.map(x => x.CGPA);
let male_with_depression = datafiltering_1male.map(x => x.CGPA)
let result_ttest = stdLib.stats.ttest2(female_with_depression, male_with_depression)
console.log('Test_1', result_ttest)
let pValue3 = result_ttest.p

let female_without_depression = datafiltering_2female.map(x => x.CGPA);
let male_without_depression = datafiltering_2male.map(x => x.CGPA)
let result_ttest_22 = stdLib.stats.ttest2(female_without_depression, male_without_depression)
console.log('Test 2', result_ttest_22)
let pValue4 = result_ttest_22.p



addMdToPage(`
Both null hyphotesis rejected (see the code, could not link the results...): \n
p- value: ca 0.00036 is less than the typical alpha level of 0.05, we can reject the null hypothesis (male and female with depression)\n
p-value: ca 1.791 -7 is extremely smaller than the alpha level 0.05, we can also reject this; (male and female without depression)\n


A kind of conclusion...\n

For both groups with and without depression, the difference in CGPA between male and female students is statistically significant.
Looks like females, in both cases: with and without depression, tend to have lower CGPAs than males, even though the difference between the max and min values (magnitude?) may vary`)



/*addMdToPage(` **NOT rejected: comparing Age of male and females with depression, but it doesnt really make sense**, I just tried to see if i could det the other result`)
let male_with_depression5 = datafiltering_1male.map(x => x.Age);
let female_with_depression5 = datafiltering_1female.map(x => x.Age)

let result_ttest_3 = stdLib.stats.ttest2(female_with_depression5, male_with_depression5)
console.log('Test_T-test_3', result_ttest_3)*/



/*let grupp_1 = await dbQuery(`SELECT SleepDuration
  FROM Study_India
  WHERE Profession='Student' AND Degree='Bachelor' AND Age <= 34 AND Depression = 1
`);
console.log('Female students with Depression', grupp_1)

let grupp_2 = await dbQuery(`SELECT SleepDuration
  FROM Study_India
  WHERE Profession='Student' AND Degree='Bachelor' AND Age <= 34 AND Depression = 0
`)
console.log('Male students without Depression', grupp_2)

/*let grupp_3 = await dbQuery(`select Gender, 
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*),1) as 'Male Students with Depression'
  from Study_India
  where Profession='Student'and Degree='Bachelor' and Age <= 34 and Gender='Male'
  `)
console.log('Male students with Depression', grupp_3)*/


