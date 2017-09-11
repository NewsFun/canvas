(function (win) {
	"use strict";
	var doc = win.document;
	var canvas = doc.querySelector('canvas');
	var ctx = canvas.getContext('2d');

	var isObject = is('Object');

	var R = Math.random;
	var w = win.innerWidth;
	var h = win.innerHeight;

	function setCanvas() {
		
	}
	function extend() {
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
	}
	function is(str) {
		return function (obj) {
			return Object.prototype.toString.call(obj) === '[object '+str+']';
		};
	}
})(window);