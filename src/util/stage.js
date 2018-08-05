let stage = document.getElementById('canvas')
let context = stage.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
stage.width = width
stage.height = height

export default {
  stage,
  context,
  stageWidth: width,
  stageHeight: height
}
