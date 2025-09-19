createMenu('Statistics Template JS', [
  { name: 'Documentation to understand Data', script: 'Documentation.js' },
  { name: 'About Depression', script: 'om_depression.js' },
  {
    name: 'Depression analysis', sub: [
      { name: 'Intro', script: 'Intro.js' },
      { name: 'Enviromental factors', script: 'Enviromental_factors.js' },
      { name: 'Biological and genetic factors', script: 'Genetic_behavioural_factors.js' }]
  },
  { name: 'Tester', script: 'tester.js' },
  { name: 'Conclusion', script: 'avslut.js' }
]);