// 여러 층으로 이루어진 외부 응답이 개발자가 정의한 타입과 일치하는지를 검증하기 위한 방법을 고민하며 구현했습니다.

type GenericObject<T> = {
      [key in keyof T]: any;
    };
  
// Object.prototype.hasOwnProperty는 입력된 string이 this의 key로 존재하는지 boolean으로 반환하는 함수입니다.
// hasOwnProperty는 한 번에 하나의 검증만 가능하기 때문에 검증하고자 하는 모든 key가 this에 실제로 존재하는지 테스트하기 위해선 코드가 지나치게 길어집니다.
// 이러한 이유로 properties array에 존재하는 모든 string이 this에 존재하는지 검증하는 함수를 제작했습니다.
  
const hasOwnProperties = <T, K extends keyof T>(
  obj: GenericObject<T>,
  properties: ReadonlyArray<K>,
) => {
  properties.forEach(key => {
    expect(obj.hasOwnProperty(key)).toBe(true);
  });
};

it('should return without any lack of predefined props as response of API', async () => {
  // 어떤 API에 대한 응답을 받습니다.
  const result = (await request('URL').get('/test')).body

  // as const는 array를 tuple로 만들어, literal하게 타입을 고정시킬 수 있도록 합니다.
  const surface = ['surfaceProp_1', 'surfaceProp_2', 'surfaceProp_3'] as const;
  const B1 = [ 'B1_nestedProp_1', 'B1_nestedProp_2', 'B1_nestedProp_3', 'B1_nestedProp_4'] as const;
  const B2 = ['B2_nestedProp_1', 'B1_nestedProp_2'] as const;
  
  // to tell the TypeScript compiler to grab all the numbered indexed values from the readonly array and then create a type from all its values.
  // [number] index로 접근함으로써 간편하게 union타입을 만들 수 있습니다.
  hasOwnProperties<
    SurfaceType,
    typeof surface[number]
  >(result, surface);

  hasOwnProperties<
    Type_B1,
    typeof B1[number]
  >(result.hits[0], B1);

  hasOwnProperties<
    Type_B2,
    typeof B2[number]
  >(result.hits[0].videos, B2);
});
