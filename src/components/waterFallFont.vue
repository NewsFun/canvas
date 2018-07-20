<template></template>
<script>
export default {
  methods: {
    sprite() {
      this.x = 0;
      this.y = 0;
      this.opacity = 1;
      this.text = "h";
      this.reduce = function() {
        this.opacity -= 0.1;
      };
      this.render = function(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 255, 0, ${ this.opacity })`;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      };
    }
  },
  mounted() {
    let stage = this.$store.state.stage;
    let ctx = stage.getContext("2d");
    ctx.font = "20px 微软雅黑";
  }
};
</script>
