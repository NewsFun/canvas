<template></template>
<script>
import { Stage, ctx, W, H } from '@/util/stage.js';
import { randomInteger, randomLetter } from '@/util/tools.js';

let fontList = [];
// 精灵
class Sprite {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.over = false;
    this.opacity = 1;
    this.text = randomLetter();
  }
  reduce() {
    this.opacity -= 0.01;
    this.over = this.opacity <= 0;
    return this;
  };
  render() {
    ctx.save();
    ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  };
}
// 组
class List {
  constructor(){
    this.end = false;
    this.spriteList = [];
    this.x = randomInteger(0, W);
    this.length = randomInteger(8, 50);
  }
  start() {
    this.addSprite().draw();
  };
  addSprite() {
    if (this.spriteList.length < this.length) {
      let len = this.spriteList.length;
      let ly = len * 20;
      this.spriteList.push(new Sprite(this.x, ly));
    }
    return this;
  };
  draw() {
    this.spriteList.forEach(sprite => {
      sprite.reduce().render();
    });
    let last = [...this.spriteList].pop();
    this.end = last.over;
  };
}
// 场景
class Scene {
  constructor(){
    this.lists = [];
  }
  start() {
    if (this.lists.length < 80) {
      this.lists.push(new List());
    }
    this.loop();
  };
  loop() {
    this.lists.forEach((list, i) => {
      if (list.end) {
        this.lists.splice(i, 1);
      } else {
        list.start();
      }
    });
  };
}
const scene = new Scene();
// 动画
function animate() {
  ctx.clearRect(0, 0, W, H);
  scene.start();
  requestAnimationFrame(animate);
}
export default {
  mounted() {
    ctx.font = '20px 微软雅黑';
    animate();
  }
};
</script>
