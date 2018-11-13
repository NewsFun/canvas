<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { cacheCtx } from "@/util/stage.js";
import { pixelStorage } from "@/util/tetris.js";
import { randomInteger, clone } from "@/util/tools.js";
import { render } from "@/util/render.js";

const MIN = Math.min;
const MAX = Math.max;

const W = 400;
const H = 800;
const VX = 20;
const cachLen = VX * 4;
const COLORS = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];

let vy = 1;
let bottom = H;
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
    return checkBound(this.list);
  }
  rotate() {
    let len = this.type.length;
    this.index = (this.index + 1) % len;
    this.list = this.type2pixel();
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

function checkBound(list) {
  if (!list.length) return [H, W, 0, 0];

  let bx = [];
  let by = [];

  list.forEach(e => {
    bx.push(e.x);
    by.push(e.y);
  });

  let minx = MIN(...bx);
  let miny = MIN(...by);
  let maxx = MAX(...bx);
  let maxy = MAX(...by);

  return [miny, maxx + VX, maxy + VX, minx];
}
// 获取某一范围的顶部
function getBottom(pixel) {
  if (pixel.y >= H) return true;
  for (let i = 0; i < walls.length; i++) {
    if (pixel.x === walls[i].x && pixel.y === walls[i].y) return true;
  }
  return false;
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
    document.body.onkeydown = this.onKeydown;
    pixels = new Pixels();
    this.animate();
  },
  methods: {
    animate() {
      this.ctx.clearRect(0, 0, W, H);
      this.update();
      requestAnimationFrame(this.animate);
    },
    update() {
      if (this.ifNext()) {
        walls = walls.concat(pixels.list);
        pixels = new Pixels();
      } else {
        pixels.update();
      }
      this.render();
    },
    render() {
      renderList = walls.concat(pixels.list);
      renderList.forEach(e => {
        render(this.ctx, e);
      });
    },
    ifNext() {
      let list = pixels.list;
      for (let i = 0; i < list.length; i++) {
        let ni = clone(list[i]);
        ni.y += VX;
        if (getBottom(ni)) return true;
      }
      return false;
    },
    onKeydown(e) {
      let kcode = e.keyCode;

      switch (kcode) {
        case 65: //A
        case 37: //左键
          break;
        case 87: //W
        case 38: //上键
          break;
        case 68: //D
        case 39: //右键
          break;
        case 83: //S
        case 40: //下贱
          break;
        case 72: //彩蛋
          break;
        default:
          break;
      }
    }
  }
};
</script>

