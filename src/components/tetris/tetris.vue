<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import Vue from "vue";
import Pixels from "./pixels.js";
import { pixelStorage, checkBound, VX, W, H } from "@/util/tetris.js";
import { randomInteger, clone } from "@/util/tools.js";
import { render } from "@/util/render.js";

const MIN = Math.min;
const MAX = Math.max;
const Ceil = Math.ceil;
const Floor = Math.floor;

let pixels = null;
let gameState = "begin";
let renderList = [];
let walls = [];

// 碰撞检测：栅格法
function getBottom(pixel) {
  if (pixel.y >= H) return true;
  for (let i = 0; i < walls.length; i++) {
    if (pixel.x === walls[i].x && pixel.y === walls[i].y) return true;
  }
  return false;
}
// 游戏状态
function getState() {
  if (checkBound(walls)[0] <= 0) return "end";
  if (checkBound(pixels)[2] > H) return "next";

  let list = pixels.list;
  for (let i = 0; i < list.length; i++) {
    let e = list[i];
    let ny = Floor(e.y / VX) * VX;
    let ni = {
      x: e.x,
      y: ny + VX
    };
    if (getBottom(ni)) {
      e.y = ny;
      return "next";
    }
  }
  return "drop";
}

function gameStep() {
  switch (gameState) {
    case "next":
      walls = walls.concat(pixels.list);
      pixels = new Vue(Pixels);
      break;
    case "drop":
      pixels.update();
      break;
    default:
      break;
  }
}
// 按键
function onKeydown(e) {
  let kcode = e.keyCode;

  switch (kcode) {
    case 65: //A
    case 37: //左键
      pixels.moveLeft(0)
      break;
    case 87: //W
    case 38: //上键
      pixels.rotate()
      break;
    case 68: //D
    case 39: //右键
      pixels.moveRight(W)
      break;
    case 83: //S
    case 40: //下贱
      pixels.update(0, 10);
      break;
    case 72: //彩蛋
      break;
    default:
      break;
  }
}

export default {
  computed: {
    Stage() {
      let stage = this.$refs["canvas"];
      stage.width = W;
      stage.height = H;
      return stage;
    },
    ctx() {
      return this.Stage.getContext("2d");
    }
  },
  mounted() {
    document.body.onkeydown = onKeydown;
    pixels = new Vue(Pixels);
    this.animate();
  },
  methods: {
    animate() {
      this.ctx.clearRect(0, 0, W, H);
      this.update();
      requestAnimationFrame(this.animate);
    },
    update() {
      gameState = getState();
      gameStep();
      this.renderScene();
    },
    renderScene() {
      renderList = walls.concat(pixels.list);
      renderList.forEach(e => {
        render(this.ctx, e);
      });
    }
  }
};
</script>
