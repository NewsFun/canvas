function creatStage () {
  return document.createElement('canvas');
}

export const Cache = creatStage();
export const cacheCtx = Cache.getContext('2d');
export const H = window.innerHeight;
export const W = window.innerWidth;

Cache.width = W;
Cache.height = H;
