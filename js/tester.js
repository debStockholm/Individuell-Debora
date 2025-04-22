addMdToPage(`
## Tests for the dataset: Shapiro and T-test

**First test, ShapiroWilk: is my data normally distributed?**

I'll test different columns: `)


let dataforShapiro = await csvLoad('student_depression_dataset.csv')
//console.log('data check', dataforShapiro)

let dataforShapiro_filtered = dataforShapiro.filter(x => x.Age <= 34) //Why this? Please see documentation
//console.log('data fitrerat', dataforShapiro_filtered)

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
* **_test Financial stress column_**\n
_Noll hypotes_: my data is normally distributed: p.value > 0.05;\n
_Alternativ hypotes_: my data is NOT normally distributed: p.value <= 0.05 `)
let dataforShapiro_3 = dataforShapiro_filtered.map(x => x['Financial Stress']);
//console.log('Slutgiltig data = Financial stress', dataforShapiro_3)
let result_3 = stdLib.stats.shapiroWilkTest(dataforShapiro_3)
let pValue_3 = result_3.p
//console.log(result_1)

addMdToPage(` 
Results for CGPA values: _w.value_ = **${result_3.w.toFixed(5)}**, _p.value_= **${result_3.p.toFixed(2)}**.
**OBS** Datatest doesn't work with this range of values`)