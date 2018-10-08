function creatStage () {
  return document.createElement('canvas');
}

export const Stage = creatStage();
export const Cache = creatStage();
export const cacheCtx = Cache.getContext('2d');
export const ctx = Stage.getContext('2d');
export const H = window.innerHeight;
export const W = window.innerWidth;
const body = document.body;
Cache.width = W;
Cache.height = H;

Stage.width = W;
Stage.height = H;
body.appendChild(Stage);
