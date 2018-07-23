<template></template>
<script>
import stage from "@/util/stage.js";
import { randomInteger, randomLetter } from "@/util/canvas.js";

const ctx = stage.ctx;
const W = stage.stageWidth;
const H = stage.stageHeight;

let fontList = [];
// 精灵
function Sprite(x, y) {
  this.x = x;
  this.y = y;
  this.opacity = 1;
  this.text = randomLetter();
  this.reduce = function() {
    this.opacity -= 0.01;
    return this;
  };
  this.render = function() {
    ctx.save();
    ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  };
}
// 场景
function List() {
  this.end = false;
  this.spriteList = [];
  this.x = randomInteger(0, W);
  this.length = randomInteger(3, 60);

  this.start = function() {
    this.iterator().draw();
  };
  this.iterator = function() {
    if (this.spriteList.length < this.length) {
      let len = this.spriteList.length;
      let ly = len * 20;
      this.spriteList.push(new Sprite(this.x, ly));
    } else {
      this.end = true;
    }
    return this;
  };
  this.draw = function() {
    for (let i = 0; i < this.spriteList.length; i++) {
      let sprite = this.spriteList[i];
      sprite.reduce().render();
    }
  };
}

function Scene() {
  this.lists = [];
  this.start = function() {
    if (this.lists.length < 100) {
      this.lists.push(new List());
    }
    this.loop();
  };
  this.loop = function() {
    for (let i = 0; i < this.lists.length; i++) {
      let list = this.lists[i];
      if (list.end) {
        this.lists.splice(i, 1);
      } else {
        list.start();
      }
    }
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
    ctx.font = "20px 微软雅黑";
    animate();
  }
};
</script>
