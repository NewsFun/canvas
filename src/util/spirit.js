/* eslint-disable */
const config = {
  c: '#fff',
  x: 4,
  y: 4,
  r: 4,
  vx: 0,
  vy: 0
}

export class Dot {
  constructor(params = config) {
    this.x = params.x;
    this.y = params.y;
    this.r = params.r;
    this.c = params.c;
    this.vx = params.vx;
    this.vy = params.vy;
    this.type = 'arc';
  }
  // render() {
  //   render(this);
  // }
}
