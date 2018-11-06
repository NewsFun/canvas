/* eslint-disable */
const conArc = {
  c: '#fff',
  x: 4,
  y: 4,
  r: 4,
  vx: 0,
  vy: 0
};
const conRect = {
  c: '#fff',
  x: 0,
  y: 0,
  w: 20,
  l: 20,
  vx: 0,
  vy: 0
}

export class Dot {
  constructor(params = conArc) {
    this.x = params.x;
    this.y = params.y;
    this.r = params.r;
    this.c = params.c;
    this.vx = params.vx;
    this.vy = params.vy;
    this.type = 'arc';
  }
}

export class Pixel {
  constructor(params = conRect) {
    this.c = params.c;
    this.x = params.x;
    this.y = params.y;
    this.w = params.w;
    this.l = params.l;
    this.vx = params.vx;
    this.vy = params.vy;
    this.type = 'rect';
  }
}
