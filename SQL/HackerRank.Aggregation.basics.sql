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

-- Weather Observation Station 2
SELECT (SELECT ROUND(SUM(LAT_N), 2) FROM STATION), (SELECT ROUND(SUM(LONG_W), 2) FROM STATION);

-- Weather Observation Station 13
-- TRUNCATE
SELECT TRUNCATE(SUM(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7880 AND LAT_N < 137.2345

-- Weather Observation Station 14
SELECT TRUNCATE(MAX(LAT_N),4) FROM STATION WHERE LAT_N < 137.2345;

-- Weather Observation Station 15
SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N = (SELECT MAX(LAT_N) FROM STATION WHERE LAT_N < 137.2345);

-- Weather Observation Station 16
SELECT ROUND(MIN(LAT_N), 4) FROM STATION WHERE LAT_N > 38.7780;

-- Weather Observation Station 17
SELECT ROUND(LONG_W, 4) FROM STATION WHERE LAT_N = (SELECT MIN(LAT_N) FROM STATION WHERE LAT_N > 38.7780);

-- Weather Observation Station 18
-- 이렇게 안해도 된다. 그냥 과정만 명확하게 보고 싶어서 변수 할당했다.
-- 맨하탄 거리 측정
SELECT 
  ROUND((@P2A - @P1A) + (@P2B - @P1B), 4) 
  FROM 
  (SELECT @P1A := MIN(LAT_N), @P1B := MIN(LONG_W), @P2A := MAX(LAT_N), @P2B := MAX(LONG_W) FROM STATION) 
  AS T;

-- Weather Observation Station 19
-- 유클리드 거리 측정
SELECT TRUNCATE(
  SQRT(
    POW(
      MAX(LAT_N) - MIN(LAT_N), 2) + 
    POW(
      MAX(LONG_W) - MIN(LONG_W), 2)
      ), 4) 
FROM STATION;