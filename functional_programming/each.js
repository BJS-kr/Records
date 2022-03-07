import { curry } from './curry.js';

export const each = curry((f, iter) => {
  for (const v of iter) {
    f(v);
  }
  // each는 '각 값들에 대하여 효과가 있다'는 것을 표현하기 위한 것입니다. 즉, 컨벤션입니다.
  // 이를 더 확연하게 표현하기 위해 return 값은 본래 받았던 iter그대로 반환합니다.
  return iter;
});
