// 타입 연습 겸 구현해보았다

// types for implementation
export declare namespace Pixabay {
  /**
   * @type
   * Every response of search videos Pixabay API contains property of video sizes
   * small & tiny always have value, while 'large' doesn't.
   * if 'large' videos does not exists, 'url' property of 'large' will have empty string.
   */
  type VideoSizes = 'large' | 'small' | 'tiny';

  type VideoTypes = 'all' | 'film' | 'animation';

  type Order = 'popular' | 'latest';

  type Categories =
    | 'backgrounds'
    | 'fashion'
    | 'nature'
    | 'science'
    | 'education'
    | 'feelings'
    | 'health'
    | 'people'
    | 'religion'
    | 'places'
    | 'animals'
    | 'industry'
    | 'computer'
    | 'food'
    | 'sports'
    | 'transportation'
    | 'travel'
    | 'buildings'
    | 'business'
    | 'music';

  type Languages =
    | 'cs'
    | 'da'
    | 'de'
    | 'en'
    | 'es'
    | 'fr'
    | 'id'
    | 'it'
    | 'hu'
    | 'nl'
    | 'no'
    | 'pl'
    | 'pt'
    | 'ro'
    | 'sk'
    | 'fi'
    | 'sv'
    | 'tr'
    | 'vi'
    | 'th'
    | 'bg'
    | 'ru'
    | 'el'
    | 'ja'
    | 'ko'
    | 'zh';

  interface VideoInfo {
    url: string;
    width: number;
    height: number;
    size: number;
  }
  type VideosOfSizes = {
    [size in VideoSizes]: VideoInfo;
  };

  interface EachVideosInfo {
    id: number;
    pageURL: string;
    picture_id: string;
    videos: VideosOfSizes;
    views: number;
    downloads: number;
    likes: number;
    comments: number;
    user_id: number;
    user: string;
    /**@description 	Profile picture URL (250 x 250 px).*/
    userImageURL: string;
  }

  interface SearchVideosResponse {
    /**@description The total number of hits*/
    total: number;
    /**@description The number of videos accessible through the API. By default, the API is limited to return a maximum of 500 videos per query */
    totalHits: number;
    hits: EachVideosInfo[];
  }

  /**
   * @interface
   * Optional query parameters of Pixabay search videos API (GET)
   */
  interface SearchVideosOptions {
    /**@description Default: 'en' */
    lang?: Languages;
    id?: string;
    /**@description Default: 'all' */
    video_type?: VideoTypes;
    category?: Categories;
    /**@description Default: 'popular' */
    order?: Order;
    callback?: string;
    /**@description Default: 0 */
    min_width?: number;
    /**@description Default: 0 */
    min_height?: number;
    /**@description Default: 1 */
    page?: number;
    /**@description Default: 20 */
    per_page?: number;
    /**@description Default: 'false' */
    editors_choice?: boolean;
    /**@description Default: 'false' */
    safesearch?: boolean;
    /**@description Default: 'false' */
    pretty?: boolean;
    download?: boolean;
    size?: VideoSizes;
  }

  type SearchVideosMethodReturnTypes =
    /**@description Neither download or size was specified(raw response of Pixabay API) */
    | Observable<SearchVideosResponse>
    /**@description When video size not specified & download URL requested */
    | Observable<{ [size in VideoSizes]: string }[]>
    /**@description When video size specified (regardless of download URL requested or not)*/
    | Observable<{ [videoSize: string]: string[] }>;
  /**
   * @interface
   * Supports method overloading for 'search' method
   */
  interface SearchVideosMethod {
    (
      query: string,
      searchOptions?: SearchVideosOptions,
    ): SearchVideosMethodReturnTypes;
    (query: string, download?: boolean): SearchVideosMethodReturnTypes;
    (
      query: string,
      perPage: number,
      page: number,
      download?: boolean,
      size?: VideoSizes,
    ): SearchVideosMethodReturnTypes;
  }

  /**
   * @description
   * Constructor signature for class PixabayVideos
   */
  interface VideosConstructorSignature {
    new (
      API_KEY: string | undefined,
      httpService: HttpService,
      logger: WinstonLogger,
    ): Videos;
  }

  /**
   * @interface
   * Expandable & seperated interface
   * Methods of Videos(currently have only 1 method: search)
   */
  interface Videos {
    search: SearchVideosMethod;
  }
}
      
// 위에서 작성한 type을 implements한 class 구현
import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { Pixabay, StringIndexedObject } from '../../types';
import { WinstonLogger } from '../logger/winston';
// 이 import는 내가 구현한 type가드를 뽑아오기 위한 것이다. 다른것으로 대체하시면 된다.
import { UtilService } from '../util/util.service';

/**
 * Pixabay API Document
 * https://pixabay.com/api/docs/
 */
export class PixabayVideos implements Pixabay.Videos {
  constructor(
    private readonly API_KEY: string | undefined,
    private readonly httpService: HttpService,
    private readonly logger: WinstonLogger,
    private readonly typeGuard = UtilService.isTypeOf,
  ) {}

  private readonly baseURL: string =
    'https://pixabay.com/api/videos/?key=' + this.API_KEY + '&q=';

  /**
   * @TypeGuard
   * 반환 값이 a is b인 type guard를 작성할 경우 true 반환시 b 타입에 맞게 컴파일됩니다.
   * 아래와 같이 메소드 오버로딩에 적합한 함수를 제작할 경우  is 조건을 붙이지 않으면 타입이 혼재되어 오류가 발생합나다.
   */

  private readonly encodeObject = (
    searchOptions: Pixabay.SearchVideosOptions,
  ): Pixabay.SearchVideosOptions => {
    for (const key of Object.keys(searchOptions)) {
      if (key === 'id' || key === 'callback') {
        if (searchOptions[key]) {
          // strictNullCheck으로 인해 searchVideosOptions.id 와 callback엔 undefined를 할당할 수 없으므로 serarchOptions[key]는 항상 undefined가 아닙니다.
          searchOptions[key] = encodeURIComponent(searchOptions[key]!);
        }
      }
    }
    return searchOptions;
  };

  public search(
    query: string,
    searchOptionsOrDownloadOrPerPage?:
      | Pixabay.SearchVideosOptions
      | boolean
      | number,
    page?: number,
    download?: boolean,
    size?: Pixabay.VideoSizes,
  ) {
    let requestingURL = this.baseURL + (query ? encodeURIComponent(query) : '');
    let willDownload = false;
    if (
      searchOptionsOrDownloadOrPerPage &&
      this.typeGuard<StringIndexedObject>(
        searchOptionsOrDownloadOrPerPage,
        'object',
      )
    ) {
      searchOptionsOrDownloadOrPerPage = this.encodeObject(
        searchOptionsOrDownloadOrPerPage,
      );
      if ('lang' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&lang=${searchOptionsOrDownloadOrPerPage.lang}`;
      }
      if ('id' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&id=${searchOptionsOrDownloadOrPerPage.id}`;
      }
      if ('video_type' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&video_type=${searchOptionsOrDownloadOrPerPage.video_type}`;
      }
      if ('category' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&category=${searchOptionsOrDownloadOrPerPage.category}`;
      }
      if ('min_width' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&min_width=${searchOptionsOrDownloadOrPerPage.min_width}`;
      }
      if ('min_height' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&min_heigh=${searchOptionsOrDownloadOrPerPage.min_height}`;
      }
      if ('order' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&order=${searchOptionsOrDownloadOrPerPage.order}`;
      }
      if ('page' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&page=${searchOptionsOrDownloadOrPerPage.page}`;
      }
      if ('per_page' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&per_page=${searchOptionsOrDownloadOrPerPage.per_page}`;
      }
      if ('callback' in searchOptionsOrDownloadOrPerPage) {
        requestingURL += `&callback=${searchOptionsOrDownloadOrPerPage.callback}`;
      }
      if (searchOptionsOrDownloadOrPerPage.editors_choice) {
        requestingURL += `&editors_choice=true`;
      }
      if (searchOptionsOrDownloadOrPerPage.safesearch) {
        requestingURL += `&safesearch=true`;
      }
      if (searchOptionsOrDownloadOrPerPage.pretty) {
        requestingURL += `&pretty=true`;
      }
      if (searchOptionsOrDownloadOrPerPage.download) {
        willDownload = true;
      }
      if (searchOptionsOrDownloadOrPerPage.size) {
        size = searchOptionsOrDownloadOrPerPage.size;
      }
      if (searchOptionsOrDownloadOrPerPage.download) {
        willDownload = searchOptionsOrDownloadOrPerPage.download;
      }
    } else if (
      this.typeGuard<number>(searchOptionsOrDownloadOrPerPage, 'number')
    ) {
      requestingURL += `&per_page=${searchOptionsOrDownloadOrPerPage}&page=${page}`;
      if (download) {
        willDownload = true;
      }
    } else if (
      this.typeGuard<boolean>(searchOptionsOrDownloadOrPerPage, 'boolean')
    ) {
      if (searchOptionsOrDownloadOrPerPage) {
        willDownload = true;
      }
    }

    /**
     * @description
     * 상단까지는 메소드에 알맞게 url을 완성하는 것이고, 하단부터는 Pixabay의 응답 값을 정제하는 과정입니다.
     * size 혹은 download 조건이 모두 없다면 Pixabay의 응답값을 그대로 반환힙니다.
     */

    const response: Observable<Pixabay.SearchVideosResponse> = this.httpService
      .get(requestingURL)
      .pipe(
        catchError(error => {
          throw new InternalServerErrorException(error.response.data);
        }),
        map(res => {
          return res.data as Pixabay.SearchVideosResponse;
        }),
      );

    if (size && willDownload) {
      // size 조건을 검증하고 있으므로 block 내의 size는 언제나 undefined가 아닙니다
      return response.pipe(
        map(response => {
          return {
            /**
             * @description
             * Computed Property name(변수를 object의 key값으로 직접 할당하는 방법)
             * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Object_initializer
             */
            [size!]: response.hits
              .map(PBVideos => {
                const result = PBVideos.videos[size!];
                if (result) {
                  return result;
                }
              })
              .map(video => {
                if (video) {
                  return (video.url += '&download=1');
                }
                throw new InternalServerErrorException('video object is falsy');
              }),
          };
        }),
      );
    } else if (size && !willDownload) {
      return response.pipe(
        map(response => {
          return {
            [size!]: response.hits.map(PBVideos => {
              const result = PBVideos.videos[size!].url;
              if (result) {
                return result;
                // video size가 large일 경우, video resource가 없을 수 있습니다. 이 경우 pixabay의 응답 자체가 빈 문자열 입니다.
              } else if (result === '' && size === 'large') {
                return 'this video has no resource with high resolution';
              }
              throw new InternalServerErrorException('video url is falsy');
            }),
          };
        }),
      );
    } else if (!size && willDownload) {
      return response.pipe(
        map(response => {
          return response.hits.map(PBVideos => {
            return {
              large: PBVideos.videos.large.url += '&download=1',
              small: PBVideos.videos.small.url += '&download=1',
              tiny: PBVideos.videos.tiny.url += '&download=1',
            };
          });
        }),
      );
    } else {
      // 아래와 같이 처리하지 않으면 return type에 void[]를 포함시켜야 함
      if (response) {
        return response;
      }
      throw new InternalServerErrorException('response was not found');
    }
  }
}

// 테스트도 해봐야겠죠?
import { PixabayVideos } from './pixabay';
import {
  Controller,
  INestApplication,
  Module,
  Get,
  Inject,
  Body,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { WinstonLogger } from '../logger/winston';
import { HttpModule, HttpService } from '@nestjs/axios';
import { config } from 'dotenv';
import { Pixabay } from 'types';
import { UtilService } from '../util/util.service';

config();

describe('Pixabay API test', () => {
  let app: INestApplication;
  let httpServer: any;
  beforeAll(async () => {
    @Controller()
    class TestController {
      constructor(
        @Inject('PB') private readonly pixabayVideos: Pixabay.Videos,
      ) {}
      @Get('1')
      keywordOnly(@Body() body: { keyword: string }) {
        const { keyword } = body;
        return this.pixabayVideos.search(keyword);
      }

      @Get('2')
      download(@Body() body: { keyword: string; download: boolean }) {
        const { keyword, download } = body;
        return this.pixabayVideos.search(keyword, download);
      }

      @Get('3')
      optionObject1_download_size(
        @Body() body: { keyword: string; options: Pixabay.SearchVideosOptions },
      ) {
        const { keyword, options } = body;
        return this.pixabayVideos.search(keyword, options);
      }

      @Get('4')
      optionObject2_no_download_size(
        @Body() body: { keyword: string; options: Pixabay.SearchVideosOptions },
      ) {
        const { keyword, options } = body;
        return this.pixabayVideos.search(keyword, options);
      }

      @Get('5')
      optionObject3_download_no_size(
        @Body() body: { keyword: string; options: Pixabay.SearchVideosOptions },
      ) {
        const { keyword, options } = body;
        return this.pixabayVideos.search(keyword, options);
      }

      @Get('6')
      optionObject4_safesearch_category_language_size(
        @Body() body: { keyword: string; options: Pixabay.SearchVideosOptions },
      ) {
        const { keyword, options } = body;
        return this.pixabayVideos.search(keyword, options);
      }

      @Get('7')
      perpage_page_download_size(
        @Body()
        body: {
          keyword: string;
          perpage: number;
          page: number;
          download: boolean;
        },
      ) {
        const { keyword, perpage, page, download } = body;
        return this.pixabayVideos.search(keyword, perpage, page, download);
      }

      @Get('8')
      perpage_out_of_range(
        @Body()
        body: {
          keyword: string;
          perpage: number;
          page: number;
        },
      ) {
        const { keyword, perpage, page } = body;
        return this.pixabayVideos.search(keyword, perpage, page);
      }
    }

    @Module({
      imports: [HttpModule],
      providers: [
        {
          provide: 'PB',
          inject: [HttpService],
          useFactory: async (httpService: HttpService) => {
            return new PixabayVideos(
              process.env.PB_API_KEY,
              httpService,
              new WinstonLogger(
                'Pixabay_TEST',
                'development',
                ((...args: any[]) => true) as typeof UtilService.isTypeOf,
              ),
            );
          },
        },
      ],
      controllers: [TestController],
    })
    class TestModule {}

    app = (
      await Test.createTestingModule({
        imports: [TestModule],
      }).compile()
    ).createNestApplication();

    await app.init();
    httpServer = app.getHttpServer();
  }, 10000);

  describe('test result of PixabayVideos class method', () => {
    /**
     * Pixabay.SearchVideosResponse는 여러 depth로 이루어져있습니다.
     * 각 depth들은 interface나 type으로 구성되어있지만, 이를 하단의 hasOwnProperties함수의 obj의 타입으로 지정하면 모든 하위 타입들이 구현되어야하는 문제가 생깁니다.
     * 또 다른 문제는 함수의 재활용 가능성이 사라진다는 것입니다. Generic을 사용하지 않으면 obj의 타입은 any가 될 수 밖에 없습니다. depth에 따라 다른 obj는 다른 타입이 되어야 하기 때문입니다.
     * 이 두가지 문제를 모두 해결하기 위해 두 가지 Generic을 활용합니다.
     * 첫 번째 제네릭(PixabaySubObject)은 obj의 하위타입 구현문제를 해결함과 동시에, 모든 프로퍼티가 존재함을 검증하기 위한 것입니다.
     * 두 번째 제네릭(hasOwnProperties)은 obj의 타입을 확정하고, 두 번째 파라미터인 properties의 값을 강제하기 위함입니다.
     * T의 key로 이루어진 K의 ReadonlyArray(tuple)을 지정함으로써, properties에는 K이외엔 입력될 수 없게 됩니다. 더 정확히는 T의 key들로 이루어진 string union type이 됩니다. 더 strict하게 사용하기 위한 방법입니다.
     * ReadonlyArray로 지정한 이유는 literal string union 타입을 만들기 위해서입니다.
     * 참고: https://melvingeorge.me/blog/convert-array-into-string-literal-union-type-typescript
     */
    type PixabaySubObject<T> = {
      [key in keyof T]: any;
    };
    // Object.prototype.hasOwnProperty는 입력된 string이 this의 key로 존재하는지 boolean으로 반환하는 함수입니다.
    // hasOwnProperty는 한 번에 하나의 검증만 가능하기 때문에 검증하고자 하는 모든 key가 this에 실제로 존재하는지 테스트하기 위해선 코드가 지나치게 길어집니다.
    // 이러한 이유로 properties array에 존재하는 모든 string이 this에 존재하는지 검증하는 함수를 제작했습니다.
    const hasOwnProperties = <T, K extends keyof T>(
      obj: PixabaySubObject<T>,
      properties: ReadonlyArray<K>,
    ) => {
      properties.forEach(key => {
        expect(obj.hasOwnProperty(key)).toBe(true);
      });
    };

    it('should return whole response of Pixabay search videos API when pass nothing but keyword', async () => {
      const response = await request(httpServer).get('/1');
      const result = response.body;
      // as const는 array를 tuple로 만듭니다.
      const searchVideosResponseG = ['total', 'totalHits', 'hits'] as const;
      const searchVideosResponseB1 = [
        'id',
        'pageURL',
        'picture_id',
        'videos',
        'views',
        'downloads',
        'likes',
        'comments',
        'user_id',
        'user',
        'userImageURL',
      ] as const;
      const searchVideosResponseB2 = ['large', 'small', 'tiny'] as const;
      const searchVideosResponseB3 = [
        'url',
        'width',
        'height',
        'size',
      ] as const;
      // to tell the TypeScript compiler to grab all the numbered indexed values from the readonly array and then create a type from all its values.
      hasOwnProperties<
        Pixabay.SearchVideosResponse,
        typeof searchVideosResponseG[number]
      >(result, searchVideosResponseG);

      hasOwnProperties<
        Pixabay.EachVideosInfo,
        typeof searchVideosResponseB1[number]
      >(result.hits[0], searchVideosResponseB1);

      hasOwnProperties<
        Pixabay.VideosOfSizes,
        typeof searchVideosResponseB2[number]
      >(result.hits[0].videos, searchVideosResponseB2);

      hasOwnProperties<
        Pixabay.VideoInfo,
        typeof searchVideosResponseB3[number]
      >(result.hits[0].videos.large, searchVideosResponseB3);

      const smallURL: string = result.hits[0].videos.small.url;

      expect(
        typeof smallURL === 'string' && smallURL.endsWith('download=1'),
      ).not.toBe(true);
      expect(response.statusCode).toBe(200);
    });

    it('should return array of objects with downloadable URLs of each sizes', async () => {
      const response = await request(httpServer)
        .get('/2')
        .send({ keyword: 'yellow', download: true });

      hasOwnProperties<
        { [size in Pixabay.VideoSizes]: string },
        Pixabay.VideoSizes
      >(response.body[0], ['large', 'small', 'tiny']);

      expect(response.body[0].small.endsWith('&download=1')).toBe(true);
      expect(response.statusCode).toBe(200);
    });

    it('should return object that have single key(one of size) with value that is array of downloadable URLs', async () => {
      const response = await request(httpServer)
        .get('/3')
        .send({ keyword: 'yellow', options: { download: true, size: 'tiny' } });

      expect(response.body.hasOwnProperty('tiny')).toBe(true);
      expect(response.body.hasOwnProperty('small')).toBe(false);
      expect(response.body.tiny[0].endsWith('&download=1')).toBe(true);
      expect(response.statusCode).toBe(200);
    });

    it('should return object that have single key(one of size) with value that is array of URLs', async () => {
      const response = await request(httpServer)
        .get('/4')
        .send({
          keyword: 'yellow',
          options: { download: false, size: 'small' },
        });

      expect(response.body.hasOwnProperty('tiny')).toBe(false);
      expect(response.body.hasOwnProperty('small')).toBe(true);
      expect(response.body.small[0].endsWith('&download=1')).toBe(false);
      expect(response.statusCode).toBe(200);
    });

    it('should return array of objects have video sizes as property that contains downloadable URLs', async () => {
      const response = await request(httpServer)
        .get('/5')
        .send({
          keyword: 'yellow',
          options: { download: true },
        });

      hasOwnProperties<
        { [size in Pixabay.VideoSizes]: string },
        Pixabay.VideoSizes
      >(response.body[0], ['large', 'small', 'tiny']);

      expect(
        typeof response.body[0].tiny === 'string' &&
          response.body[0].small.endsWith('&download=1'),
      ).toBe(true);
      expect(response.statusCode).toBe(200);
    });

    // return 값 으로 옵션이 모두 정확하게 실행되었는지 확인할 수는 없으나, 결과가 오류없이 반환되므로 간접적으로 요청이 정상 수행되었다고 추측하고 있습니다.
    it('should return response fit to the options', async () => {
      const options: Pixabay.SearchVideosOptions = {
        safesearch: true,
        category: 'animals',
        lang: 'en',
        size: 'tiny',
      };

      const response = await request(httpServer)
        .get('/6')
        .send({ keyword: 'yellow', options });

      expect(response.body.hasOwnProperty('tiny')).toBe(true);
      expect(response.body.hasOwnProperty('large')).toBe(false);
      expect(response.body.tiny[0].endsWith('download=1')).toBe(false);
      expect(response.statusCode).toBe(200);
    });

    it('should return result number of "perpage" argument and page of "page" argument', async () => {
      const response = await request(httpServer)
        .get('/7')
        .send({ keyword: 'yellow', perpage: 15, page: 2, download: true });

      hasOwnProperties<
        { [size in Pixabay.VideoSizes]: string },
        Pixabay.VideoSizes
      >(response.body[0], ['large', 'small', 'tiny']);

      expect(response.body.length).toBe(15);
      expect(response.body[0].tiny.endsWith('download=1')).toBe(true);
      expect(response.statusCode).toBe(200);
    });

    it('if perpage under 3 or page under 1 will return error', async () => {
      const errorMock = jest.fn().mockImplementation(() => {
        throw errorMock.mock.calls[0][0];
      });

      WinstonLogger.prototype.error = errorMock;

      const firstResponse = await request(httpServer)
        .get('/8')
        .send({ keyword: 'yellow', perpage: 2, page: 1, download: true });

      const secondResponse = await request(httpServer)
        .get('/8')
        .send({ keyword: 'yellow', perpage: 3, page: 1, download: true });

      const thirdResponse = await request(httpServer)
        .get('/8')
        .send({ keyword: 'yellow', perpage: 3, page: 0, download: true });

      expect(firstResponse.statusCode).toBe(500);
      expect(secondResponse.statusCode).toBe(200);
      expect(thirdResponse.statusCode).toBe(500);
    });
  });
});
