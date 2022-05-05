-- 595. Big Countries
select name, population, area 
from World 
where 
  area >= 3000000 or population >= 25000000;

-- 1757. Recyclable and Low Fat Products
select product_id 
from Products 
where 
  low_fats='Y' and recyclable='Y';

-- 584. Find Customer Referee
select name 
from Customer 
where 
  referee_id != 2 or referee_id is null;

-- 183. Customers Who Never Order
select name Customers 
from Customers 
where 
  id not in (select customerId from Orders);

-- 1873. Calculate Special Bonus
select employee_id, if(employee_id % 2 = 1 and name not like 'M%', salary, 0) bonus 
from Employees;

-- 627. Swap Salary
-- case when then else end
update Salary 
set sex = 
  case 
    when sex = 'f' then 'm' 
    else 'f' 
  end;

-- 196. Delete Duplicate Emails
-- 이거 진짜 신기했다. 조인을 통해서 문제를 해결한다니
DELETE P1 
FROM Person P1 
INNER JOIN Person P2 
WHERE 
  P1.id > P2.id and P1.email = P2.email;