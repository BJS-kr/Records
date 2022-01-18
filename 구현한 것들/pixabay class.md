# 타입 연습 겸 구현해보았다

## type for implementation
```typescript
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
```
## type을 implements한 class 구현
```typescript
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
```
