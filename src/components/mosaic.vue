<template>
  <canvas ref="canvas" @mousemove="onMouseMove">
    <img ref="img" @load="onMosaic" src alt srcset>
  </canvas>
</template>

<script>
let imgData = [],
  Paths = {},
  key = 0,
  type = {};

function evnt(path, pos) {
  //console.log(path);
  if (path.size.w < 2 || path.size.h < 2) return;
  if (path.size.w > path.size.h) {
    new Path().Rectangle({
      origin: path.origin,
      size: {
        w: path.size.w / 2,
        h: path.size.h
      },
      monitorType: "mousemove",
      monitorEvent: evnt
    });
    new Path().Rectangle({
      origin: {
        x: path.center.x,
        y: path.origin.y
      },
      size: {
        w: path.size.w / 2,
        h: path.size.h
      },
      monitorType: "mousemove",
      monitorEvent: evnt
    });
  } else {
    new Path().Rectangle({
      origin: path.origin,
      size: {
        w: path.size.w,
        h: path.size.h / 2
      },
      monitorType: "mousemove",
      monitorEvent: evnt
    });
    new Path().Rectangle({
      origin: {
        x: path.origin.x,
        y: path.center.y
      },
      size: {
        w: path.size.w,
        h: path.size.h / 2
      },
      monitorType: "mousemove",
      monitorEvent: evnt
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
    drawRectangle(this);
    if (this.monitorType) this.monitor();
  }
  monitor() {
    this.key = key;
    Paths[key] = this;
    if (this.monitorType) {
      if (!type[this.monitorType]) {
        type[this.monitorType] = {};
      }
      type[this.monitorType][key] = this;
    }

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
    var x = this.center.x,
      y = this.center.y;
    var num = (x + (y - 1) * w) * 4;
    var r = imgData[num],
      g = imgData[num + 1],
      b = imgData[num + 2],
      a = imgData[num + 3] / 255;
    //console.log(r, g, b, a);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
}

function drawRectangle(path) {
  //ctx.moveTo(config.origin.x, config.origin.y);
  ctx.save();
  ctx.fillStyle = path.fillColor;
  ctx.fillRect(path.origin.x, path.origin.y, path.size.w, path.size.h);
  ctx.restore();
  return path;
}

export default {
  data() {
    return {};
  },
  computed: {
    Stage() {
      let stage = this.$refs["canvas"];
      stage.width = W;
      stage.height = H;
      return stage;
    },
    ctx() {
      return this.Stage.getContext("2d");
    },
    img() {
      return this.$refs["img"];
    }
  },
  methods: {
    onMouseMove(e) {
      var e = event || window.event;
      var rx = e.clientX - left,
        ry = e.clientY - top;

      for (var i in Paths) {
        var p = Paths[i];
        if (
          rx > p.origin.x &&
          rx <= p.maximumx &&
          ry > p.origin.y &&
          ry <= p.maximumy
        ) {
          if (p.monitorEvent) p.monitorEvent(p, [rx, ry]);
        }
      }
    },
    onMosaic() {
      ctx.drawImage(img, 0, 0);
      imgData = ctx.getImageData(0, 0, w, h).data;
      new Path().Rectangle({
        origin: {
          x: 0,
          y: 0
        },
        size: {
          w: w,
          h: h
        },
        monitorEvent: evnt
      });
    }
  }
};
</script>

