<template></template>
<script>
import { Stage, ctx, W, H } from "@/util/stage.js";

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

