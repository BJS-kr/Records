-- Revising the Select Query I
-- 중복조건이 핵심
SELECT * FROM CITY WHERE POPULATION > 100000 AND COUNTRYCODE='USA';

-- Revising the Select Query II
-- 위 문제에 추가하여 컬럼 선택
SELECT NAME FROM CITY WHERE POPULATION > 120000 AND COUNTRYCODE='USA';

-- SELECT ALL
SELECT * FROM CITY;

-- Select By ID
SELECT * FROM CITY WHERE ID=1661;

-- Japanese Cities' Attributes
SELECT * FROM CITY WHERE COUNTRYCODE='JPN';

-- Japanese Cities' Names
SELECT NAME FROM CITY WHERE COUNTRYCODE='JPN';

-- Weather Observation Station 1
SELECT CITY, STATE FROM STATION;

-- Weather Observation Station 3
SELECT DISTINCT CITY FROM STATION WHERE ID % 2 = 0;

-- Weather Observation Station 4
-- 서브쿼리 활용해야함. 죄다 SELECT로 처리하는게 마치 타입 연산처럼 느껴짐.
SELECT \
  (SELECT COUNT(CITY) FROM STATION) \
  - \
  (SELECT COUNT(DISTINCT CITY) FROM STATION) \ 
  AS DIFFER;

-- Weather Observation Station 5
-- UNION과 다중조건 ORDER BY, LIMIT
(SELECT CITY, LENGTH(CITY) FROM STATION ORDER BY LENGTH(CITY), CITY LIMIT 1) \
UNION \
(SELECT CITY, LENGTH(CITY) FROM STATION ORDER BY LENGTH(CITY) DESC LIMIT 1); 

-- Weather Observation Station 6
-- OR LIKE PATTERN
SELECT CITY FROM STATION \
WHERE \
CITY LIKE 'a%' \
OR CITY LIKE 'e%' \
OR CITY LIKE 'i%' \
OR CITY LIKE 'o%' \
OR CITY LIKE 'u%';

-- Weather Observation Station 8
-- 양 끝 자가 모음인 결과 걸러내기
SELECT DISTINCT CITY FROM STATION \
WHERE \
LEFT(CITY, 1) IN ('a','e','i','o','u') AND RIGHT(CITY, 1) IN ('a','e','i','o','u');

-- Weather Observation Station 9
-- NOT IN
SELECT DISTINCT CITY FROM STATION \
WHERE \
LEFT(CITY, 1) NOT IN ('A','E','I','O','U');

-- Weather Observation Station 10
SELECT DISTINCT CITY FROM STATION \
WHERE \
RIGHT(CITY, 1) NOT IN ('a','e','i','o','u');

-- Weather Observation Station 11
SELECT DISTINCT CITY FROM STATION \
WHERE \
LEFT(CITY, 1) NOT IN ('A','E','I','O','U') OR RIGHT(CITY, 1) NOT IN ('a','e','i','o','u');

-- Weather Observation Station 12
SELECT DISTINCT CITY FROM STATION \
WHERE \
LEFT(CITY, 1) NOT IN ('A','E','I','O','U') AND RIGHT(CITY, 1) NOT IN ('a','e','i','o','u');

-- Higher Than 75 Marks
SELECT Name FROM STUDENTS WHERE Marks > 75 ORDER BY RIGHT(Name, 3), ID;

-- Employee Names
SELECT name FROM Employee ORDER BY name;

-- Employee Salaries
SELECT name FROM Employee WHERE salary > 2000 AND months < 10;

-- the blunder
-- https://www.hackerrank.com/challenges/the-blunder/problem?isFullScreen=true&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen
-- 핵심은 형 변환 및 문자, 숫자 함수 활용
SELECT \
  CEIL(\
    (SELECT AVG(ALL Salary) FROM EMPLOYEES) - \
    (SELECT AVG(ALL 
    CONVERT(
      REPLACE(
        CONVERT(Salary, CHAR), '0', ''), SIGNED)) 
    FROM EMPLOYEES)
    );