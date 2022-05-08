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

-- Population Census
SELECT SUM(CITY.POPULATION) 
FROM CITY 
INNER JOIN COUNTRY 
  ON CITY.COUNTRYCODE=COUNTRY.CODE 
WHERE COUNTRY.CONTINENT='Asia';

-- Ollivander's Inventory
SELECT W.id, WP.age, W.coins_needed, W.power 
FROM Wands W 
INNER JOIN Wands_Property WP 
  USING (code) 
WHERE WP.is_evil != 1 
  AND W.coins_needed = 
    (SELECT MIN(Wands.coins_needed) FROM Wands INNER JOIN Wands_Property USING (code) WHERE Wands.power = W.power AND Wands_Property.age = WP.age) 
ORDER BY W.power DESC, WP.age DESC;