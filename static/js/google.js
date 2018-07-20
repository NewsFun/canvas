/**
 * Created by Administrator on 2016/4/13.
 */
window.onload = function G() {
  var canvas = document.querySelector("#canvas");
  var ctx = canvas.getContext('2d');

  var W = window.innerWidth,
    H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  var X = W / 2,
    Y = H / 2,
    r1 = 80,
    r2 = 100,
    rad = Math.PI / 2,
    tick = 0;

  function picture(rad) {
    drawCircle({
      c: 'rgba(255,255,255,1)',
      r: r2
    });
    drawCircle({
      c: 'rgba(48,108,182,1)',
      r: r1
    });
    outCircle(rad);
  }

  function drawCircle(ball) {
    ctx.fillStyle = ball.c;
    ctx.beginPath();
    ctx.arc(X, Y, ball.r, 0, Math.PI * 2, true);
    ctx.fill();
  }

  function drawPoint(ball) {
    ctx.fillStyle = ball.c;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2, true);
    ctx.fill();
  }

  function outCircle(ball) {
    threeColor('rgba(232,62,74,1)', ball - Math.PI);
    threeColor('rgba(242,192,59,1)', ball - Math.PI / 3);
    threeColor('rgba(33,172,67,1)', ball + Math.PI / 3);
  }

  function threeColor(color, rad) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(X, Y, r2, rad, rad - Math.PI * 2 / 3, true);
    ctx.arc(X, Y, 2 * r2, rad - Math.PI / 3, rad + Math.PI / 3, false);
    ctx.fill();
    ctx.restore();
  }
  //picture(rad);

  function animate() {
    ctx.clearRect(0, 0, W, H);
    tick++;
    picture(-tick * Math.PI / 720);
    requestAnimationFrame(animate);
  }
  animate();
};
