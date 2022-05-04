-- African Cities
SELECT CITY.NAME FROM CITY 
  INNER JOIN COUNTRY 
  ON COUNTRY.CODE=CITY.COUNTRYCODE 
  WHERE COUNTRY.CONTINENT='Africa';

-- Average Population of Each Continent
SELECT COUNTRY.CONTINENT, FLOOR(AVG(CITY.POPULATION)) FROM COUNTRY 
  INNER JOIN CITY 
  ON COUNTRY.CODE=CITY.COUNTRYCODE 
  GROUP BY COUNTRY.CONTINENT;

-- The Report
SELECT 
  IF(Grades.Grade < 8, NULL, Students.Name), 
  Grades.Grade, 
  Students.Marks 
FROM Students 
INNER JOIN Grades 
  ON 
  Students.Marks >= Grades.Min_Mark 
  AND Students.Marks <= Grades.Max_Mark 
  ORDER BY Grades.Grade DESC, Students.Name
