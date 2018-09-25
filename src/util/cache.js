import { cacheCtx, W, H } from './stage'

export function setFont () {
  cacheCtx.fill();
}

export function getCacheData (width = W, height = H) {
  return cacheCtx.getImageData(0, 0, width, height).data;
}
