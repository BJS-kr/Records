-- https://www.hackerrank.com/challenges/the-blunder/problem?isFullScreen=true&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen&h_r=next-challenge&h_v=zen
-- 핵심은 형 변환 및 문자, 숫자 함수 활용
SELECT \
  CEIL(\
    (SELECT AVG(ALL Salary) FROM EMPLOYEES) - \
    (SELECT AVG(ALL CONVERT(REPLACE(CONVERT(Salary, CHAR), '0', ''), SIGNED)) FROM EMPLOYEES)
    );