(function (win,$,undefined) {
	var w = win.innerWidth;
	var h = win.innerHeight;
	var fs = w/10;
	var moduleList = [];
	
	$('html').css('font-size', fs+'px');

	var testd = {
		a:'a',
		b:'b',
		c:'c',
		d:'d',
		e:[{
			e1:'e1',
			e2:'e2'
		}]
	};
	win.staticHtml = function(el, data){
		var mel = $(el), text = '';
		if(mel.length<1) return false;
		text = mel.html();
		mel.html(dataInject(text, data));
	};
	function testFun() {
		var test = $('#test')[0];
		moduleNode(test, testd);
	}
	function dataInject(text, data){
		var reg = /\{\{((?:.|\n)+?)\}\}/g;
		while(true){
			var c = reg.exec(text);
			if(c === null) return text;
			text = text.replace(c[0], data[c[1]]);
		}
	}
	function moduleNode(el, data) {
		var child = el.childNodes;
		console.log(child);
 		if(child.length<1) return;
 		for (var i = 0;i<child.length;i++) {
 			var outer = child[i].outerHTML;
 			if(outer){
 				child[i].outerHTML = dataInject(outer, data);
 			}
 		}
		/*
		child.each(function (k,v) {
			console.log(k,v);
			moduleIf($(this), data);
			moduleFor($(this),data);
		});
		*/
    }
	function moduleIf(el, data) {
		var mif = el.attr('xh-if');
		if(!mif||data[mif]){
			el.removeAttr('xh-if');
			return;
		}
		el.remove();
	}
	function moduleFor(el, data) {
		var mfor = el.attr('xh-for');
		if(mfor){
			var dfor = data[mfor];
			if(dfor&&dfor.length>0){
				moduleNode(el,dfor);
			}
		}else{
			el.prop("outerHTML", dataInject(el.prop("outerHTML"), data));
		}
	}
	$(win.document).ready(function($) {
		// testFun();
	});
})(window, jQuery);