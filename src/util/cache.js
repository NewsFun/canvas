import { cachectx, W, H } from './stage'

export function setFont () {
  cachectx.fill();
}

export function getCacheData (width = W, height = H) {
  return cachectx.getImageData(0, 0, width, height).data;
}
