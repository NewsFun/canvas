export const Stage = document.getElementById('canvas');
export const Cache = document.getElementById('cache');
export const cachectx = Cache.getContext('2d');
export const ctx = Stage.getContext('2d');
export const H = window.innerHeight;
export const W = window.innerWidth;

Cache.style.display = 'none';
Cache.width = W;
Cache.height = H;

Stage.width = W;
Stage.height = H;
