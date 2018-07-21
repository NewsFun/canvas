let stage = document.getElementById('canvas')
let ctx = stage.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
stage.width = width
stage.height = height

export default {
  stage,
  ctx,
  stageWidth: width,
  stageHeight: height
}
