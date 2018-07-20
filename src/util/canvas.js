/* eslint-disable */
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
export function fixed2(number){
  let remainder = number % 1
  if (remainder > 0) number = number.toFixed(2)
  return number
}
// 获取画布
export function setStage(){
  let stage = document.getElementById('canvas')
  let width = window.innerWidth;
  let height = window.innerHeight;
  stage.width = width;
  stage.height = height;
  return stage
}
