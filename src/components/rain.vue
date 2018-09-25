<template></template>
<script>
import { Stage, ctx, W, H } from '@/util/stage.js';

const Bottom = H - 32;

class Drop {
  constructor() {
    this.x = ~~(Math.random() * W);
    this.y = 0;
    this.v = 0;
    this.w = 1;
    this.l = 16;
    this.end = false;
  }
  isBottom() {
    let by = this.l + this.y;
    return by > Bottom;
  }
  isEnd() {
    this.end = this.w > 40;
    return this.end;
  }
  update() {
    if (!this.isEnd()) {
      if (this.isBottom()) {
        this.l = 1;
        this.w += 2;
        this.x -= 1;
      } else {
        this.v += 0.2;
        this.y += this.v;
      }
    }
    return this;
  }
  render() {
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.w, this.l);
    ctx.closePath();
    ctx.fill();
  }
}

class Scene {
  constructor() {
    this.lists = [];
  }
  start() {
    if (this.lists.length < 120) {
      this.lists.push(new Drop());
    }
    this.loop();
  }
  loop() {
    this.lists.forEach((list, i) => {
      if (list.end) {
        this.lists.splice(i, 1);
      } else {
        list.update().render();
      }
    });
  }
}

const scene = new Scene();

function animate() {
  ctx.clearRect(0, 0, W, H);
  scene.start();
  requestAnimationFrame(animate); /* 浏览器固有定时器，其频率与自身刷新频率相同 */
}
export default {
  mounted() {
    animate();
  }
};
</script>

