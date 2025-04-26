

addMdToPage(`

# Relevant details to understand the Data analysis

(Why analysis is in 'english': I do not have swedish letters on my laptop so tried to make things easier. My english is not the best, but hope it's understandable. Apologize for typos too)

_**Reading the data according to real life of Indian Students:**_


## Study of depression among students in India
---
The Dataset is based on a survey among indian students of different grades to see if they experiment Depression 
or negative thinking.\n
The dataset contains a few parameters which can be compared such as _Sleep hours, diagnosed depression, school satisfaction, 
level of education they are pursuing, Dietary_ and more.


In India students undergo compulsory education from 6 to 14 years old (Primary stage). 
The Dataset includes students from 18y.o. and upper, which means they are not enrolled anymore in compulsory education.


**"Class12"** degree, which is the lowest _known_ degree of the students in the dataset, can be compared to the Examen year in the swedish gymnasiet. 
According to Kaggles, the degree in the column 'Degree' refers to the title the students are pursuing.
Although it feels a little bit off (Class 12 in India is students of 18y.o., but in the dataset the average age for this degree is 20y.o.) I choose to 
analyze the data according to this information. Class 12 degree can be attended also by older students.

Other represented groups in the dataset are (students who are pursuing):
* Bachelors (undergraduate), different fields, example: _B.Tech, B.Arch, BSc_;
* Master students (postgraduate), different fields, example: _MD, ME, M.Com_;
* PhD doctors
* Others (not specified)

Here can we found other information about enrollement among students: https://www.dataforindia.com/enrolment-in-education/\n
And education in India: https://en.wikipedia.org/wiki/Education_in_India;\n
Dataset from Kaggle: https://www.kaggle.com/datasets/adilshamim8/student-depression-dataset

_______________________________________________


_**Dataset columns explained**_:

*  **SleepDuration** values, associated:
    * 0 = less than 5 hours sleep
    * 1 = 5-6 hours sleep
    * 2 = 7-8 hours sleep
    * 3 = more then 8 hours sleep
    * 4 = others, not specified 

________________________

*  **SuicidalThoughts, Depression** are booleans (_numeric type_ in SQLite):
    * 1 = True
    * 0 = False
______________________________

*  **Degree** values, associated:
I aggregated the different degrees in bigger aggregations to make computations easier.
In the dataset 'Study_Indien', the different degrees are associated like this:
   * 'ME', 'MHM', 'LLM', 'MA', 'MBA', 'MD', 'M.Pharm', 'MBBS', 'M.Com', 'M.Ed', 'M.Tech', 'MCA', 'MSc' = 'Master'\n
   * 'B.Ed', 'B.Com', 'B.Arch', 'BCA', 'B.Tech', 'BHM', 'BSc', 'B.Pharm', 'BBA','BE','LLB', 'BA' = 'Bachelor'\n
I do have a spare database where this aggregation is NOT done, just in case. 
___________________________________

* **Outliers and other small deviations** (according to me)

In the dataset is present a handful of Data which is deemed not necessary for the analisys.
The total dataset includes **27901** rows.\n
**_Outliers which are removed in ALL cases_**:
There are _only_ 49 students are older than 34y.o., which in a 27k rows dataset can be considered 
out of the normal.\n
There are also 31 people which do not have 'Student' as _Profession_. Since we are analyzing students,
I removed them as well.\n 
_Degree_: there are 35 rows values in the column _Degree_ = 'Others'. The rows containing those values
are removed when making some of the statistics.\n
**_Outliers which are removed in some cases_**:
* _DietaryHabits_ where _Dietary_ = 'Others'. Not considered when querying Dietary related parameters.

_____________________________




`)