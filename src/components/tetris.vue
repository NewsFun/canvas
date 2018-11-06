<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { cacheCtx } from "@/util/stage.js";
import { pixelStorage } from "@/util/tetris.js";
import { randomInteger } from "@/util/tools.js";
import { render } from "@/util/render.js";

const W = 400;
const H = 800;
const VX = 20;
const cachLen = VX * 4;
const COLORS = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];

let vy = 1;

class Pixels {
  constructor(ctx) {
    this.type = [];
    this.index = 0;
    this.c = randomColor();
    this.ctx = ctx;
    this.list = this.type2pixel();
  }
  update(dist = 0) {
    this.list.forEach(e => {
      e.y += vy;
      e.x += dist;
    });
    return this;
  }
  type2pixel() {
    this.type = creatPixel();

    let tlist = this.type[this.index];
    let plist = [];

    tlist.forEach(e => {
      plist.push({
        x: e[1] * VX,
        y: e[0] * VX,
        c: this.c,
        w: VX,
        l: VX,
        type: "rect"
      });
    });
    return plist;
  }
  rotate() {
    let len = this.type.length;
    this.index = (this.index + 1) % len;
  }
  render() {
    this.list.forEach(e => {
      render(this.ctx, e);
    });
  }
}

function creatPixel() {
  let len = pixelStorage.length;
  let ind = randomInteger(len);
  return pixelStorage[ind];
}

function randomColor() {
  let len = COLORS.length;
  let ind = randomInteger(len);
  return COLORS[ind];
}

cacheCtx.width = cachLen;
cacheCtx.height = cachLen;

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
    },
    pixels() {
      return new Pixels(this.ctx);
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      this.ctx.clearRect(0, 0, W, H);
      this.pixels.update().render();
      requestAnimationFrame(this.animate);
    }
  }
};
</script>

