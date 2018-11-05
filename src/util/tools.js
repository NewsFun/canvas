/* eslint-disable */
const R = Math.random;
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
export function randomInteger(min, max) {
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
  let r = randomInteger(0, 255);
  let g = randomInteger(0, 255);
  let b = randomInteger(0, 255);
  let a = R();
  return setColor(r, g, b, a);
}
// 设置颜色
export function setColor(r, g, b, a) {
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}
// 判断数字
export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
