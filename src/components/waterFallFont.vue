<template></template>
<script>
export default {
  mounted(){
    let stage = this.$store.state.stage;
    let ctx = stage.getContext('2d');
    console.log(stage.width, stage.height);
  }
}
</script>
