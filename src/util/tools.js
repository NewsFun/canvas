/* eslint-disable */
const R = Math.random;
const SIN = Math.sin;
const COS = Math.cos;
const PI = Math.PI;
// 补零
export function zeroizeOfTen(n) {
  return n < 10 ? ('0' + n) : n;
}
// yyyy-MM-dd
export function formateDate(time) {
  let result = '';
  if (time) {
    let date = new Date(time);

    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    m = zeroizeOfTen(m);
    d = zeroizeOfTen(d);

    result = y + '-' + m + '-' + d;
  }
  return result;
}
// 保留两位小数
export function fixed2(number) {
  let remainder = number % 1
  if (remainder > 0) number = number.toFixed(2)
  return number;
}
// 随机整数
export function randomInteger(max = 2, min = 0) {
  let delta = max - min;
  return parseInt(R() * delta + min);
}
// 随机字母
export function randomLetter() {
  let code = randomInteger(65, 122);
  return String.fromCharCode(code);
}
// 随机颜色
export function randomColor() {
  let r = randomInteger(255);
  let g = randomInteger(255);
  let b = randomInteger(255);
  // let a = R();
  let a = 1;
  return setColor(r, g, b, a);
}
// 设置颜色
export function setColor(r, g, b, a) {
  let rgba = [r, g, b, a].join(',');
  return 'rgba(' + rgba + ')';
}
// 判断数字
export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
// 距离
export function distance(start, end, details) {
  let dx = start.x - end.x;
  let dy = start.y - end.y;
  let d = Math.sqrt(dx * dx + dy * dy);

  return details ? [dx, dy, d] : d;
}
// 反弹
export function bounce(minw, minh, maxw, maxh, ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.r <= minw) {
    ball.vx = -ball.vx;
    ball.x = ball.r;
  }
  if (ball.x + ball.r >= maxw) {
    ball.vx = -ball.vx;
    ball.x = maxw - ball.r;
  }
  if (ball.y - ball.r <= minh) {
    ball.vy = -ball.vy;
    ball.y = ball.r;
  }
  if (ball.y + ball.r >= maxh) {
    ball.vy = -ball.vy;
    ball.y = maxh - ball.r;
  }
}
// 抖动
export function roundShake(ball) {
  ball.x -= SIN(R() * PI);
  ball.y -= SIN(R() * PI);
}
