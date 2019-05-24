<template>
  <canvas ref="canvas" @mousemove="onMouseMove">
    <img ref="img" src="/static/img/1.jpg" style="display:none;" @load="onMosaic"/>
  </canvas>
</template>

<script>
const IMG = new Image();

let imgData = [];
let Paths = {};
let type = {};
let key = 0;

function evnt(path, pos) {
  //console.log(path);
  if (path.size.w < 2 || path.size.h < 2) return;
  if (path.size.w > path.size.h) {
    new Path().Rectangle({
      origin: path.origin,
      size: {
        w: path.size.w / 2,
        h: path.size.h
      }
    });
    new Path().Rectangle({
      origin: {
        x: path.center.x,
        y: path.origin.y
      },
      size: {
        w: path.size.w / 2,
        h: path.size.h
      }
    });
  } else {
    new Path().Rectangle({
      origin: path.origin,
      size: {
        w: path.size.w,
        h: path.size.h / 2
      }
    });
    new Path().Rectangle({
      origin: {
        x: path.origin.x,
        y: path.center.y
      },
      size: {
        w: path.size.w,
        h: path.size.h / 2
      }
    });
  }
  delete Paths[path.key];
}

class Path {
  constructor() {
    this.origin = {
      x: 0,
      y: 0
    };
    this.size = {
      w: 10,
      h: 10
    };
    this.fillColor = "rgba(255, 255, 255, 0.5)";
  }
  Rectangle(config) {
    Object.assign(this, config);
    this.setBounds();
    this.fillColor = this.getCenterColor();
    this.render();
    this.monitor();
  }
  monitor() {
    this.key = key;
    Paths[key] = this;
    key += 1;
  }
  setBounds() {
    this.maximumx = this.origin.x + this.size.w;
    this.maximumy = this.origin.y + this.size.h;
    this.center = {
      x: Math.ceil(this.origin.x + this.size.w / 2),
      y: Math.ceil(this.origin.y + this.size.h / 2)
    };
    return this;
  }
  getCenterColor() {
    let x = this.center.x,
      y = this.center.y;
    let num = (x + (y - 1) * this.imgWidth) * 4;
    let r = imgData[num],
      g = imgData[num + 1],
      b = imgData[num + 2],
      a = imgData[num + 3] / 255;
    //console.log(r, g, b, a);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  render() {
    this.ctx.save();
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(this.origin.x, this.origin.y, this.size.w, this.size.h);
    this.ctx.restore();
  }
}

export default {
  data() {
    return {
      img: null,
      loaded: false,
      stage: null,
    };
  },
  computed: {
    ctx() {
      if (this.stage) return this.stage.getContext("2d");
      return null;
    },
    imgWidth() {
      if (this.img) return this.img.width;
      return 0;
    },
    imgHeight() {
      if (this.img) return this.img.height;
      return 0;
    },
    stageLeft() {
      if (this.stage) return this.stage.offsetLeft;
      return 0;
    },
    stageTop() {
      if (this.stage) return this.stage.offsetTop;
      return 0;
    }
  },
  methods: {
    onMouseMove(e) {
      if (!this.loaded) return false;
      let rx = e.clientX - this.stageLeft;
      let ry = e.clientY - this.stageTop;
      for (let i in Paths) {
        let p = Paths[i];
        if (
          rx > p.origin.x &&
          rx <= p.maximumx &&
          ry > p.origin.y &&
          ry <= p.maximumy
        ) {
          evnt(p, [rx, ry]);
        }
      }
    },
    onMosaic() {
      this.loaded = true;
      this.stage = this.$refs.canvas;
      this.img = this.$refs.img;

      let w = this.imgWidth;
      let h = this.imgHeight;

      this.stage.width = w;
      this.stage.height = h;

      Path.prototype.ctx = this.ctx;
      Path.prototype.imgWidth = this.imgWidth;

      this.ctx.drawImage(this.img, 0, 0);
      imgData = this.ctx.getImageData(0, 0, w, h).data;
      new Path().Rectangle({
        origin: {
          x: 0,
          y: 0
        },
        size: {
          w,
          h
        }
      });
    }
  }
};
</script>

