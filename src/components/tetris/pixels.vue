<script>
import { randomInteger, clone } from "@/util/tools.js";
import { pixelStorage, COLORS } from "@/util/tetris.js";

export default {
  data() {
    return {
      bound: [0, 0, 0, 0],
      dropHeight: 0,
      index: 0
    };
  },
  computed: {
    color() {
      let len = COLORS.length;
      let ind = randomInteger(len);
      return COLORS[ind];
    },
    list() {
      let plist = [];

      this.typeList.forEach(e => {
        plist.push({
          x: e[1] * VX,
          y: e[0] * VX + this.dropHeight,
          c: this.color,
          w: VX,
          l: VX,
          type: "rect"
        });
      });

      return plist;
    },
    type() {
      let len = pixelStorage.length;
      let ind = randomInteger(len);
      return pixelStorage[ind];
    },
    typeList() {
      return this.type[this.index];
    },
    typeLength() {
      return this.type.length;
    }
  },
  methods: {
    // 更新坐标
    update(vx = 0, vy = 1) {
      this.list.forEach(e => {
        e.y += vy;
        e.x += vx;
      });
      this.dropHeight += vy;
    },
    // 变形
    rotate() {
      this.index = (this.index + 1) % this.typeLength;
    }
    // moveLeft() {
    //   let minx = checkBound(this.list)[3];
    //   if (minx > 0) {
    //     this.update(-VX, 0);
    //   }
    // },
    // moveRight() {
    //   let maxx = checkBound(this.list)[1];
    //   if (maxx < W) {
    //     this.update(VX, 0);
    //   }
    // }
  }
};
</script>

