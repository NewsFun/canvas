<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { cacheCtx } from "@/util/stage.js";
import { pixelStorage } from "@/util/tetris.js";
import { randomInteger } from "@/util/tools.js";
import { render } from "@/util/render.js";

const MIN = Math.min;
const MAX = Math.max;

const W = 400;
const H = 800;
const VX = 20;
const cachLen = VX * 4;
const COLORS = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];

let vy = 1;
let pixels = null;
let walls = [];
let renderList = [];

class Pixels {
  constructor(ctx) {
    this.bound = [0, 0, 0, 0];
    this.index = 0;
    this.c = randomColor();
    this.type = getPixelType();
    this.list = this.type2pixel();
  }
  update(dist = 0) {
    this.list.forEach(e => {
      e.y += vy;
      e.x += dist;
    });
  }
  type2pixel() {
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
  checkBound() {
    let bx = [];
    let by = [];

    this.list.forEach(e => {
      bx.push(e.x);
      by.push(e.y);
    });

    let minx = MIN(...bx);
    let miny = MIN(...by);
    let maxx = MAX(...bx);
    let maxy = MAX(...by);

    return [miny, maxx + VX, maxy + VX, minx];
  }
  rotate() {
    let len = this.type.length;
    this.index = (this.index + 1) % len;
  }
}

function getPixelType() {
  let len = pixelStorage.length;
  let ind = randomInteger(len);
  return pixelStorage[ind];
}

function randomColor() {
  let len = COLORS.length;
  let ind = randomInteger(len);
  return COLORS[ind];
}

function createPixels() {
  pixels = new Pixels();
  renderList = renderList.concat(pixels.list);
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
    createPixels();
    this.animate();
  },
  methods: {
    animate() {
      this.ctx.clearRect(0, 0, W, H);
      this.update();
      requestAnimationFrame(this.animate);
    },
    update() {
      let b = pixels.checkBound()[2];
      if (b < H) {
        pixels.update();
      } else {
        walls = walls.concat(pixels.list);
        createPixels();
      }
      this.render();
    },
    render() {
      renderList.forEach(e => {
        render(this.ctx, e);
      });
    }
  }
};
</script>

