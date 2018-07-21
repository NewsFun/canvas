<template></template>
<script>
import stage from "@/util/stage.js";
import { randomInteger, randomLetter } from "@/util/canvas.js";

const ctx = stage.ctx;
const W = stage.stageWidth;
const H = stage.stageHeight;

let fontList = [];
// 精灵
function Sprite() {
  this.x = randomInteger(0, W);
  this.y = randomInteger(0, H);
  this.opacity = 1;
  this.text = randomLetter();
  this.reduce = function() {
    this.opacity -= 0.01;
  };
  this.render = function() {
    ctx.save();
    ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  };
}
// 场景
function Scene() {
  this.spriteList = [];
  this.start = function() {
    if (this.spriteList.length < 200) {
      this.spriteList.push(new Sprite());
    }
    this.iterator().draw();
  };
  this.iterator = function() {
    for (var i = 0; i < this.spriteList.length; i++) {
      let sprite = this.spriteList[i];
      if (sprite.opacity < 0) {
        this.spriteList.splice(i, 1);
      } else {
        sprite.reduce();
      }
    }
    return this;
  };
  this.draw = function() {
    for (var i = 0; i < this.spriteList.length; i++) {
      let sprite = this.spriteList[i];
      sprite.render();
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
