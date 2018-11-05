<template>
  <canvas class="mg-center" ref="canvas"></canvas>
</template>
<script>
import { cacheCtx } from "@/util/stage.js";

const W = 450;
const H = 800;

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

