<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { W, H } from "@/util/stage.js";
import { Dot } from "@/util/spirit.js";
import { render } from "@/util/render.js";

let list = [];
let count = {};

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
    this.createDot().countingStar().render();
  },
  methods: {
    createDot() {
      for (let i = 0; i < 100000; i++) {
        let ax = Math.random() * W;
        ax = Math.round(ax);
        list.push(ax);
      }
      return this;
    },
    countingStar() {
      list.forEach(e => {
        if (count[e]) {
          count[e] += 1;
        } else {
          count[e] = 1;
        }
      });
      return this;
    },
    render() {
      for(let i in count) {
        let dot = new Dot({
            x: i,
            y: count[i]*2,
            r: 1,
            c: "#fff"
          });
        render(this.ctx, dot);
      }
    }
  }
};
</script>
