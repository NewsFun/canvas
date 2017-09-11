(function (win) {
	"use strict";
	var doc = win.document;
	var canvas = doc.querySelector('canvas');
	var ctx = canvas.getContext('2d');

	var isObject = is('Object');

	var R = Math.random;
	var w = win.innerWidth;
	var h = win.innerHeight;

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
		var fx = direct.x*step;
		var fy = direct.y*step;
		var buff = [];
		extend(buff,snake);
		for (var i = 1;i<buff.length;i++) {
			snake[i] = buff[i-1];
		}
		snake[0].x+=fx;
		snake[0].y+=fy;
		console.log(snake);
	}
	function point(param) {
		var base = {
			x:~~(W/2),
			y:~~(H/2),
			c:'rgba(255,255,255,1)'
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
	}
	function extend(target, obj) {
		/*
		var len = arguments.length;
		if(len<2) return;
		var target = {};
		for(var a = 0;a<len;a++){
			var obj = arguments[a];
			for(var i in obj){
				target[i] = isObject(obj[i])?extend({}, obj[i]):obj[i];
			}
		}
		return target;
		*/
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
		// body...
	}
	goAhead();
})(window);