-- Revising Aggregations - The Count Function
SELECT COUNT(NAME) FROM CITY WHERE POPULATION > 100000;

-- Revising Aggregations - The Sum Function
SELECT SUM(POPULATION) FROM CITY WHERE DISTRICT = 'California';

-- Revising Aggregations - Averages
SELECT AVG(ALL POPULATION) FROM CITY WHERE DISTRICT = 'California';

-- Average Population
SELECT ROUND(AVG(ALL POPULATION)) FROM CITY;

-- Japan Population
SELECT SUM(POPULATION) FROM CITY WHERE COUNTRYCODE = 'JPN';

-- Population Density Difference
SELECT (SELECT MAX(POPULATION) FROM CITY) - (SELECT MIN(POPULATION) FROM CITY);

-- Top Earners
-- GROUP BY는 ORDER BY 보다 뒤에 위치할 수 없다
SELECT salary * months AS T, COUNT(*) FROM Employee GROUP BY T ORDER BY T DESC LIMIT 1;

