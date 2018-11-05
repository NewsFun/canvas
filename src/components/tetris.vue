<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { cacheCtx, W, H } from "@/util/stage.js";

// const W = 750;
// const H = 1334;

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
    this.animate();
  },
  methods: {
    animate() {
      this.ctx.clearRect(0, 0, W, H);
      requestAnimationFrame(this.animate);
    }
  }
};
</script>

