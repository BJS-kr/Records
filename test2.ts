type Continuation<T> = (callback: (x: T) => void) => void;
var continuation: Continuation<number> = (resolve) => resolve(5);
continuation((x) => console.log(x));
