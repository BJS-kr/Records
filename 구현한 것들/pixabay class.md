# 타입 연습 겸 구현해보았다

```javascript
type VideoSizes = 'large' | 'small' | 'tiny';

interface VideoInfo {
url:string, width:number, height:number, size:number
}

interface EachVideosInfo {
  pageURL: string;
  picture_id: string;
  videos: {[size in VideoSizes]: VideoInfo};
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  /**@description 	Profile picture URL (250 x 250 px).*/
  userImageURL: string;
}

interface PixabaySearchVideosResponse {
  /**@description The total number of hits*/
  total: number;
  /**@description The number of videos accessible through the API. By default, the API is limited to return a maximum of 500 videos per query */
  totalHits: number;
  id: string;
  hits: EachVideosInfo[]
}

interface PixabaySearchVideosOptions {
  lang?:string;
  id?:string;
  video_type?:string; 
  category?:string;
  order?:string;
  callback?:string;
  min_width?:number;
  min_height?:number;
  page?:number;
  per_page?:number;
  editors_choice?:boolean;
  safesearch?:boolean;
  pretty?:boolean;
  download?:boolean;
}

interface PixabaySearchVideos {
  search(q:string, searchOptions:PixabaySearchVideosOptions):Promise<PixabaySearchVideosResponse>
}

export class PixabayVideos implements PixabaySearchVideos {
  constructor(private API_KEY:string) {}
  
  private readonly baseURL:string = 'https://pixabay.com/api/?key=' + this.API_KEY + '&q='
  
  public async search(q:string, searchOptions?:PixabaySearchVideosOptions) {
    let requestingURL = this.baseURL + q;

    if ('lang' in searchOptions) {requestingURL+=`&lang=${searchOptions.lang}`};
    if ('id' in searchOptions) {requestingURL+=`&id=${searchOptions.id}`};
    if ('video_type' in searchOptions) {requestingURL+=`&video_type=${searchOptions.video_type}`};
    if ('category' in searchOptions) {requestingURL+=`&category=${searchOptions.category}`};
    if ('min_width' in searchOptions) {requestingURL+=`&min_width=${searchOptions.min_width}`};
    if ('min_height' in searchOptions) {requestingURL+=`&min_heigh=${searchOptions.min_height}`};
    if ('order' in searchOptions) {requestingURL+=`&order=${searchOptions.order}`};
    if ('page' in searchOptions) {requestingURL+=`&page=${searchOptions.page}`};
    if ('per_page' in searchOptions) {requestingURL+=`&per_page=${searchOptions.per_page}`};
    if ('callback' in searchOptions) {requestingURL+=`&callback=${searchOptions.callback}`};
    if (searchOptions.editors_choice) {requestingURL+=`&editors_choice=true`};
    if (searchOptions.safesearch) {requestingURL+=`&safesearch=true`};
    if (searchOptions.pretty) {requestingURL+=`&pretty=true`};
    if (searchOptions.download) {requestingURL+=`&download=1`};

    return (await axios.default.get(requestingURL)).data as PixabaySearchVideosResponse
  }
}
```
