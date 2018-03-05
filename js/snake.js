/**
 * Created by bobo on 2017/9/01.
 */
(function (win) {
	"use strict";
	var R = Math.random;
	var W = win.innerWidth;
	var H = win.innerHeight;

	var canvas = document.querySelector('canvas');
	canvas.width = W;
	canvas.height = H;
	var ctx = canvas.getContext('2d');

	var isObject = is('Object');

	var snake = [{x:3,y:0},{x:2,y:0},{x:1,y:0},{x:0,y:0}];
	var direct = {x:1,y:0};
	var step = 1;

	function testFun() {
		var a = {a:1,b:2};
		var b = {c:3,d:4,e:{e1:1,e2:2}};
		var c = extend(a,b);
		// console.log(R());
	}
	function goAhead() {
		var fx = snake[0].x+direct.x*step;
		var fy = snake[0].y+direct.y*step;
		snake.unshift({x:fx,y:fy});
		snake.pop();
		// console.log(snake);
	}
	function render(){

	}
	function point(param) {
		var base = {
			x:~~(W/2),
			y:~~(H/2),
			color:'rgba(255,255,255,1)'
		};
		if(param) extend(base, param);
		return base;
	}
	function ifFinish(point) {
		if(point.x>W) return true;
		if(point.x<0) return true;
		if(point.y>H) return true;
		if(point.y<0) return true;
		for(var i = 1;i<snake.length;i++){
			if(snake[i].x===point.x&&snake[i].y===point.y) return true;
		}
		return false;
	}
	function extend(target, obj) {
		for(var i in obj){
			target[i] = isObject(obj[i])?extend({}, obj[i]):obj[i];
		}
		return target;
	}
	function is(str) {
		return function (obj) {
			return Object.prototype.toString.call(obj) === '[object '+str+']';
		};
	}
	function controller(keycode) {
		switch(keycode){
			case 87:
			case 38:
				direct = {x:0,y:-1};
				break;
			case 68:
			case 40:
				direct = {x:0,y:1};
				break;
			case 65:
			case 37:
				direct = {x:-1,y:0};
				break;
			case 83:
			case 39:
				direct = {x:1,y:0};
				break;
			default:break;
		}
	}
	function animate(cb) {
		ctx.clearRect(0,0,W,H);
		if(cb) cb();
		requestAnimationFrame(animate);
	}
	goAhead();
})(window);