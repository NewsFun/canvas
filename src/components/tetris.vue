<template></template>
<script>
import stage from "@/util/stage.js";

const ctx = stage.context;
const W = stage.stageWidth;
const H = stage.stageHeight;
// 动画
function animate() {
  ctx.clearRect(0, 0, W, H);
  requestAnimationFrame(animate);
}
export default {
  mounted() {
    animate();
  }
}
</script>

