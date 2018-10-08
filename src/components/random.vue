<template></template>
<script>
import { Dot } from "@/util/spirit.js";
let list = [];
function createDot() {
  for (let i = 0; i < 1000; i++) {
    list.push(
      new Dot({
        x: Math.random() * 100,
        y: 100
      })
    );
  }
}

function render(){
  for(let i in list) {
    i.render();
  }
}

export default {
  mounted() {
    render();
  }
};
</script>
