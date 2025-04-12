import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';

addMdToPage(`
  The lowest age of recorded data is 18 year old, and these students do all have atteinted Class '12, which means they are
  attending some Undergraduate program, which can be 3, 4 o 5 years long depending of the field of study.
  They are the biggest group of studnets with depression. Can it be that starting bachelors is seen stressfull?


  `)



addMdToPage(`
  ## Nytt i version 5 av mallen
  Nytt i version 5 av mallen är bl.a. att vi kan visa och läsa av dropdowns med hjälp av funktionen **addDropdown**.

  Detta kan t.ex. användas för att filtrera data på olika sätt och därmed ge en mer interaktiv visning av data.
  
  ### Ett exempel
`);

let gender = addDropdown('Kön', ['samtliga', 'kvinnor', 'män']);

if (gender == 'samtliga') {
  addMdToPage(`Här hade vi kunnat visa data om samtliga respondenter i en undersökning.`);
}
else if (gender == 'kvinnor') {
  addMdToPage(`Här hade vi kunnat visa data om endast kvinnor.`);
}
else {
  addMdToPage(`Här hade vi kunnat visa data om endast män.`);
}

addMdToPage(`
  ### Titta på övriga sidor genom att välja dem i menyn!
  På övriga sidor har vi fler exempel på hur dropdown ka användas.

  Där används de för att låta användaren filtrera på år i data om temperaturer i Malmö!
`);