<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { W, H } from "@/util/stage.js";

const Bottom = H - 32;

class Drop {
  constructor(ctx) {
    this.x = ~~(Math.random() * W);
    this.y = 0;
    this.v = 0;
    this.w = 1;
    this.l = 16;
    this.end = false;
    this.ctx = ctx;
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
    let ctx = this.ctx;
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.w, this.l);
    ctx.closePath();
    ctx.fill();
  }
}

class Scene {
  constructor(ctx) {
    this.lists = [];
    this.ctx = ctx;
  }
  start() {
    if (this.lists.length < 120) {
      this.lists.push(new Drop(this.ctx));
    }
    this.loop();
  }
  loop() {
    this.lists.forEach((item, i) => {
      if (item.end) {
        this.lists.splice(i, 1);
      } else {
        item.update().render();
      }
    });
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
    },
    scene() {
      return new Scene(this.ctx);
    }
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      let ctx = this.ctx;
      let scene = this.scene;
      ctx.clearRect(0, 0, W, H);
      scene.start();
      requestAnimationFrame(
        this.animate
      );
    }
  }
};
</script>

