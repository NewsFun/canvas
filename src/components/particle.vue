<template></template>
<script>
import {Stage, ctx, W, H} from "@/util/stage.js";
import { randomColor } from "@/util/canvas.js";

const R = Math.random;
const txt = ["祝", "大", "家", "节", "日", "快", "乐"];

let ba = [],
  bs = [],
  page = 0,
  tl = txt.length,
  gap = 16,
  gw = Math.floor(W / gap) * gap,
  gh = Math.floor(H / gap) * gap;

ctx.globalCompositeOperation = "lighter";

class Dot {
  constructor(arg) {
    this.b = {
      x: arg.x,
      y: arg.y,
      z: arg.z,
      c: arg.c || randomColor(),
      vx: (R() - 0.5) * 4,
      vy: (R() - 0.5) * 4
    };
    this.e = 0.07;
    this.s = true;
  }
  distance(n, details) {
    let dx = this.b.x - n.x,
      dy = this.b.y - n.y,
      d = Math.sqrt(dx * dx + dy * dy);

    return details ? [dx, dy, d] : d;
  }
  bounce(self) {
    self.x += self.vx;
    self.y += self.vy;

    if (self.x - self.z <= 0) {
      self.vx = -self.vx;
      self.x = self.z;
    }
    if (self.x + self.z >= W) {
      self.vx = -self.vx;
      self.x = W - self.z;
    }
    if (self.y - self.z <= 0) {
      self.vy = -self.vy;
      self.y = self.z;
    }
    if (self.y + self.z >= H) {
      self.vy = -self.vy;
      self.y = H - self.z;
    }
  }
  update(goal) {
    let dis = this.distance(goal, true);
    let d = dis[2],
      dx = dis[0],
      dy = dis[1];
    if (this.s) {
      if (d > 1) {
        this.b.x -= dx * this.e;
        this.b.y -= dy * this.e;
      } else {
        this.b.x -= Math.sin(R() * 3.142);
        this.b.y -= Math.sin(R() * 3.142);
      }
    } else {
      this.bounce(this.b);
    }
    return this;
  }
  moveTo(goal) {
    this.update(goal).render(this.b);
  }
  render(ball) {
    ctx.fillStyle = ball.c;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.z, 0, Math.PI * 2, true);
    ctx.fill();
  }
}
const P = {
  setFont(l) {
    let size = 500;
    let s = Math.min(
      size,
      W / ctx.measureText(l).width * 0.8 * size,
      H / size * (Fun.isNumber(l) ? 1 : 0.45) * size
    );
    ctx.font =
      "bold " +
      Math.floor(s / 10) * 10 +
      "px Avenir, Helvetica Neue, Helvetica, Arial, sans-serif";
  },
  fillTxt(txt) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    this.setFont(txt);
    ctx.fillText(txt, W / 2, H / 2);
  },
  sampling() {
    let dots = [],
      x = 0,
      y = 0,
      fx = gw,
      fy = gh,
      w = 0,
      h = 0,
      pixels = ctx.getImageData(0, 0, gw, gh).data;
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
  },
  getTxt(n) {
    ctx.clearRect(0, 0, W, H);
    this.fillTxt(txt[n]);
    bs = this.sampling();
  },
  makeBalls() {
    let balls = [],
      len = bs.length > 0 ? bs.length : 200;
    for (let i = 0; i < len; i++) {
      balls.push(
        new Dot({
          x: R() * W,
          y: R() * H,
          z: R() * 6 + 4
        })
      );
    }
    return balls;
  }
};
const Fun = {
  towards() {
    for (let i = 0; i < ba.length; i++) {
      ba[i].moveTo(bs[i]);
    }
  },
  checkLength() {
    if (ba.length == bs.length) return;
    let bal = ba.length,
      bsl = bs.length,
      len = Math.abs(bal - bsl);

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
            z: R() * 6 + 4
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
  },
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
};
function animate() {
  ctx.clearRect(0, 0, W, H);
  Fun.checkLength();
  Fun.towards();
  requestAnimationFrame(animate);
}
Stage.onclick = function() {
  page++;
  P.getTxt(page % tl);
  Fun.setState();
};
export default {
  mounted() {
    P.getTxt(page);
    ba = P.makeBalls();
    animate();
  }
};
</script>

