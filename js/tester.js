// _________SHAPIRO______________________________
addMdToPage(`
## Tests for the dataset: Shapiro and T-test

**First test, ShapiroWilk: is my data normally distributed?**

I'll test different columns: `)


let dataforShapiro = await csvLoad('student_depression_dataset.csv')
//console.log('data check', dataforShapiro)

let dataforShapiro_filtered = dataforShapiro.filter(x => x.Age <= 34) //Why this? Please see documentation!
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

//______________________________________TTEST______________________________________________

let dataforTTEST = await csvLoad('student_depression_dataset.csv')

let datafiltering_1female = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Female' && x.Depression === 1)
//console.log('Female depression', datafiltering_1female)
let datafiltering_2female = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Female' && x.Depression === 0)
//console.log('Female without depression', datafiltering_2female)  
let datafiltering_1male = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Male' && x.Depression === 1)
//console.log('Male depression', datafiltering_1male)   funkar
let datafiltering_2male = dataforTTEST.filter(x => x.Age <= 34 && x.Gender === 'Male' && x.Depression === 0)
//console.log('Male without depression', datafiltering_2male)

// hur ska dettafunka?

let female_with_depression = datafiltering_1female.map(x => x.Bachelor); // Adjust 'CGPA' to the actual column name you're working with
let male_with_depression = datafiltering_1male.map(x => x.Bachelor)

let result_ttest = stdLib.stats.ttest2(female_with_depression, male_with_depression)
console.log('test', result_ttest)




/*let grupp_1 = await dbQuery(`select Gender, 
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*),1) as 'Female Students with Depression',
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*),1) as 'Female Students without Depression'
  from Study_India
  where Profession='Student'and Degree='Bachelor' and Age <= 34 and Gender='Female'
  `)
console.log('Female students with Depression', grupp_1)

let grupp_2 = await dbQuery(`select Gender, 
  ROUND(COUNT(CASE WHEN Depression = 1 THEN 1 END) * 100.0 / COUNT(*),1) as 'Male Students with Depression',
  ROUND(COUNT(CASE WHEN Depression = 0 THEN 1 END) * 100.0 / COUNT(*),1) as 'Male Students without Depression'
  from Study_India
  where Profession='Student'and Degree='Bachelor' and Age <= 34 and Gender='Male'
  `)
console.log('Male students with Depression', grupp_2)


let result = stdLib.stats.ttest2(grupp_1, grupp_2);*/
/*addMdToPage('## Tvåsidigt T-test');
let showExplanation = addDropdown('Visa förklaring', ['Ja', 'Nej'], 'Nej');

if (showExplanation === 'Ja') {
  addMdToPage(` 
  Ett [tvåsidigt T-test](https://sv.wikipedia.org/wiki/T-test) (**two-sample t-test**) jämför om medelvärdet på en variabel mätt i två olika populationer (eller i vårt fall om två olika strata/grupper från ett stickprov) är lika. 
  * Vår **nollhypotes** är att de är lika, dvs. *ingen statistiskt säkerställd skillnad* existerar mellan grupperna.
  * Vår **alternativhypotes** är att det finns en skillnad mellan grupperna.
  * Om **p-värdet** från T-testet är mindre än [signifikansnivån](https://www.statistiskordbok.se/ord/signifikansniva) (som vi valt att sätta till  α = 0.05), så förkastar vi nollhypotesen. (**p < α**) 
  * Har vi förkastat **nollhypotesen** är alternativhypotesen sann, dvs. vi har en **statistiskt signifikant skillnad**!
  
  I detta fall kan vi uttrycka våra två hypoteser så här:
  * *Nollhypotes* - det finns ingen statistiskt säkerställd skillnad i självskattad allmänhälsa mellan grupperna.
  * *Alternativhypotes* - nollhypotesen är falsk, dvs. det finns en statistiskt säkerställd skillnad mellan självskattad allmänhälsa i de två grupperna.
  * Vi kan också gå längre och ha en alternativhypotes där vi förutspår åt vilket håll skillnaden ska ligga (t.ex. anta att medelvärdet för självskattad hälsa ska vara högre hos icke-rökare). I så fall måste vi kolla att riktningen stämmer!
  
  **Notera**: För att T-test ska vara tillförlitliga behöver de utföras på normalfördelat material!
`);
}

// Dropdowns for choice of group + filtering of outliers
addMdToPage('### Välj två grupper att jämföra:');
let filtered1 = helpers.chooseGroupPlusOutlierFiltering(
  'Grupp 1', groups, 'rökare (för närvarande)', 'Nej, ta bort mer än ± 3 x standardavvikelse'
);
let filtered2 = helpers.chooseGroupPlusOutlierFiltering(
  'Grupp 2', groups, 'icke-rökare (aldrig rökt)', 'Nej, ta bort mer än ± 3 x standardavvikelse'
);
let nonNormalDist = (filtered1.normalDist ? 0 : 1) + (filtered2.normalDist ? 0 : 1);
let healthGroup1 = filtered1.data;
let healthGroup2 = filtered2.data;

// Perform T-test
let result = stdLib.stats.ttest2(healthGroup1, healthGroup2);

// Calculate some additional meauserements
let stdDev1 = s.sampleStandardDeviation(healthGroup1);
let stdDev2 = s.sampleStandardDeviation(healthGroup2);
let jointMean = s.mean([...healthGroup1, ...healthGroup2]);
let jointStdDev = s.sampleStandardDeviation([...healthGroup1, ...healthGroup2]);

// Create a table showing comparison data
tableFromData({
  data: [{
    'T-värde': result.statistic,
    'p-värde': result.pValue,
    'Signifikant skillnad': result.rejected ? `Ja, grupp ${result.xmean > result.ymean ? 1 : 2} mår lite bättre.` : 'Nej',
    'Normalfördelat?': nonNormalDist == 0 ? 'Ja' : 'Nej, bör ej T-testas.',
    'Grupp&nbsp;1, medel': result.xmean.toFixed(1) + ' ± ' + stdDev1.toFixed(1),
    'Grupp&nbsp;2, medel': result.ymean.toFixed(1) + ' ± ' + stdDev2.toFixed(1)
  }]
});

console.log(nonNormalDist == 0 ? '' : nonNormalDist + ' ej normalfördelade urval')

// Min & max for gauges, the joint mean for the two groups +/i 2 * stdDev, 
// covers 95% of respondents
let min = Math.round(jointMean - jointStdDev * 2);
let max = Math.round(jointMean + jointStdDev * 2);

drawGoogleChart({
  type: 'Gauge',
  data: makeChartFriendly(
    [{ x: result.xmean, y: result.ymean }], 'Grupp 1', 'Grupp 2'
  ),
  options: {
    height: 300,
    min,
    max,
    redFrom: min, redTo: min + jointStdDev,
    yellowFrom: min + jointStdDev, yellowTo: jointMean - 0.1 * jointStdDev,
    greenFrom: jointMean - 0.1 * jointStdDev, greenTo: max
  }
});*/