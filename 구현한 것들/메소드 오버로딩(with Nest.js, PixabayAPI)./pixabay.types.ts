// namespace 및 ts의 interface를 활용한 method overloading 구현은 재밌는 공부였다. 물론 js는 메소드 오버로딩을 지원하지 않지만 TS로 그런 '척' 할 수 있다.
// https://pixabay.com/api/docs/의 api 문서를 상세히 본따 그대로 구현했다!

import { Observable } from 'rxjs';

/**
 * @namespace
 * namespace for Typings of Pixabay
 */
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
   * @interface
   * Expandable & seperated interface
   * Methods of Videos(currently have only 1 method: search)
   */
  interface Videos {
    search: SearchVideosMethod;
  }
}

type StringIndexedObject = {[key: string]: any}
