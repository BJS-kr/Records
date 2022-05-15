js엔 walrus operator가 없다.
대신 파이썬의 walrus operator와 같이 할당하는 방법이 js에선 native이다.

```python
if (i:=0) < 1:
  print(i)
```
```javascript
let i;
if (i = 0 < 1) console.log(i)
```
