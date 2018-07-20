/**
 * @desc 日期过滤器
 * @author hardy
 * @argument value
 * @argument type
 */
export default {
  fmtTime (value) {
    if (!value) return ''

    let date = new Date(value)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let min = date.getMinutes()
    // let sec = date.getSeconds()
    m = m < 10 ? ('0' + m) : m
    d = d < 10 ? ('0' + d) : d
    h = h < 10 ? ('0' + h) : h
    min = min < 10 ? ('0' + min) : min
    // sec = sec < 10 ? ('0' + sec) : sec
    return y + '-' + m + '-' + d + ' ' + h + ':' + min
  },
  fixed2 (number) {
    let remainder = number % 1
    if (remainder > 0) number = number.toFixed(2)
    return number
  }
}
