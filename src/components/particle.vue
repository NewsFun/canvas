<template>
  <canvas ref="canvas" @click="onNextPage"></canvas>
</template>
<script>
import { cacheCtx, W, H } from "@/util/stage.js";
import { randomColor, isNumber, distance, bounce, roundShake } from "@/util/tools.js";
import { render } from "@/util/render.js";

const TXT = "祝大家新年快乐";
const txt = TXT.split("");
const R = Math.random;

let ba = [];
let bs = [];
let page = 0;
let gap = 16;
let tl = txt.length;
let gw = Math.floor(W / gap) * gap;
let gh = Math.floor(H / gap) * gap;

class Dot {
  constructor(arg) {
    this.b = {
      x: arg.x,
      y: arg.y,
      r: arg.r,
      c: arg.c || randomColor(),
      vx: (R() - 0.5) * 4,
      vy: (R() - 0.5) * 4,
      type: "arc"
    };
    this.e = 0.07;
    this.s = true;
    this.ctx = arg.ctx;
  }
  update(goal) {
    let dis = distance(this.b, goal, true);
    let d = dis[2],
      dx = dis[0],
      dy = dis[1];
    if (this.s) {
      if (d > 1) {
        this.b.x -= dx * this.e;
        this.b.y -= dy * this.e;
      } else {
        roundShake(this.b);
      }
    } else {
      bounce(0, 0, W, H, this.b);
    }
  }
  moveTo(goal) {
    this.update(goal);
    render(this.ctx, this.b);
  }
}
// 缓存数据
function fillTxt(txt) {
  cacheCtx.textAlign = "center";
  cacheCtx.textBaseline = "middle";
  cacheCtx.fillStyle = "#fff";
  setFont(txt);
  cacheCtx.fillText(txt, W / 2, H / 2);
}
function getTxt(n) {
  cacheCtx.clearRect(0, 0, W, H);
  fillTxt(txt[n]);
  bs = sampling();
}
function setFont(l) {
  let size = 500;
  let s = Math.min(
    size,
    (W / cacheCtx.measureText(l).width) * 0.8 * size,
    (H / size) * (isNumber(l) ? 1 : 0.45) * size
  );
  cacheCtx.font =
    "bold " +
    Math.floor(s / 10) * 10 +
    "px Avenir, Helvetica Neue, Helvetica, Arial, sans-serif";
}
function sampling() {
  let dots = [],
    x = 0,
    y = 0,
    fx = gw,
    fy = gh,
    w = 0,
    h = 0,
    pixels = cacheCtx.getImageData(0, 0, gw, gh).data;
  for (let p = 0; p < pixels.length; p += 4 * gap) {
    if (pixels[p + 3] > 0) {
      dots.push({
        x: x,
        y: y
      });
      w = x > w ? x : w;
      h = y > h ? y : h;
      fx = x < fx ? x : fx;
      fy = y < fy ? y : fy;
    }
    x += gap;
    if (x >= gw) {
      x = 0;
      y += gap;
      p += gap * 4 * gw;
    }
  }
  return dots;
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
    this.ctx.globalCompositeOperation = "lighter";
    getTxt(page);
    ba = this.makeBalls();
    this.animate();
  },
  methods: {
    animate() {
      this.ctx.clearRect(0, 0, W, H);
      this.checkLength();
      this.towards();
      requestAnimationFrame(this.animate);
    },
    onNextPage() {
      page++;
      getTxt(page % tl);
      this.setState();
    },
    makeBalls() {
      let balls = [];
      let len = bs.length > 0 ? bs.length : 200;
      for (let i = 0; i < len; i++) {
        balls.push(
          new Dot({
            x: R() * W,
            y: R() * H,
            r: R() * 6 + 4,
            ctx: this.ctx
          })
        );
      }
      return balls;
    },
    towards() {
      for (let i = 0; i < ba.length; i++) {
        ba[i].moveTo(bs[i]);
      }
    },
    checkLength() {
      let bal = ba.length;
      let bsl = bs.length;
      if (bal == bsl) return;
      let len = Math.abs(bal - bsl);
      if (bal > bsl) {
        for (let i = 0; i < len; i++) {
          bs.push({
            x: R() * W,
            y: R() * H
          });
        }
      } else {
        for (let j = 0; j < len; j++) {
          ba.push(
            new Dot({
              x: R() * W,
              y: R() * H,
              r: R() * 6 + 4,
              ctx: this.ctx
            })
          );
        }
      }
    },
    setState() {
      let bal = ba.length,
        bsl = bs.length,
        sml = Math.min(bal, bsl);
      for (let s = 0; s < bal; s++) {
        s < sml ? (ba[s].s = true) : (ba[s].s = false);
      }
    }
  }
};
</script>

