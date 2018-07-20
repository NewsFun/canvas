/**
 * Created by Administrator on 2015/10/16.
 */
window.onload = function ballJS() {
  var canvas = setCanvas();
  var ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'xor';
  var R = Math.random,
    FPS = 0,
    W = canvas.width,
    H = canvas.height;
  var Style = {
    randomColor: function () {
      var r = ~~(R() * 255),
        g = ~~(R() * 255),
        b = ~~(R() * 255);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    radial: function (ball) {
      var rg = ctx.createRadialGradient(ball.x, ball.y, ball.radius, ball.x, ball.y, ball.r + 10);
      rg.addColorStop(0, 'white');
      rg.addColorStop(1, 'black');
      return rg;
    }
  };

  function bounce(self) {
    self.x += self.vx;
    self.y += self.vy;
    if (self.x - self.radius <= 0) {
      self.vx = -self.vx;
      self.x = self.radius;
    }
    if (self.x + self.radius >= W) {
      self.vx = -self.vx;
      self.x = W - self.radius;
    }
    if (self.y - self.radius <= 0) {
      self.vy = -self.vy;
      self.y = self.radius;
    }
    if (self.y + self.radius >= H) {
      self.vy = -self.vy;
      self.y = H - self.radius;
    }
  }

  var ball = function () {
    this.x = ~~(R() * W);
    this.y = ~~(R() * H);
    this.vx = (R() - 0.5) * 4;
    this.vy = (R() - 0.5) * 4;
    this.color = Style.randomColor();
    this.radius = ~~(R() * 60 + 10);
  };
  var balls = createBalls(100);

  function animate() {
    ctx.clearRect(0, 0, W, H);
    redraw();
    requestAnimationFrame(animate);
  }

  function redraw() {
    for (var i = 0; i < balls.length; i++) {
      drawBalls(balls[i]);
    }
  }

  function drawBalls(ball) {
    bounce(ball);
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  function createBalls(n) {
    n = n || 10;
    var b = [];
    for (var i = 0; i < n; i++) {
      b.push(new ball());
    }
    return b;
  }

  function fps() {
    ctx.save();
    ctx.fillStyle = '#FFF';
    ctx.fillText('fps:' + FPS, 8, H - 8);
    ctx.restore();
  }

  animate();
};
