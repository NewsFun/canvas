/* eslint-disable */
import { ctx } from '@/util/stage';
const config = {
  c: '#fff',
  x: 0,
  y: 0,
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
  }
  render() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fill();
  }
}
