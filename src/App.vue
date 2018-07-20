<template>
  <div id="app" class="oil">
    <canvas ref="canvas"></canvas>
    <router-view/>
  </div>
</template>

<script>

export default {
  methods:{
    initCanvas(){
      let width = this.$store.state.stageWidth;
      let height = this.$store.state.stageHeight;
      let stage = this.$refs.canvas;
      stage.width = width;
      stage.height = height;
      this.$store.commit('setStage', stage);
    }
  },
  mounted(){
    this.initCanvas();
  }
}
</script>

<style></style>
