/**
 * Created by bobo on 2017/4/11.
 */
(function(window, $){
    var config = {
        "index":["js/works.js"],
        "works":["js/works.js"],
        "course":["js/works.js"],
        "wc":["js/magnify.js","js/works-content.js"],
        "cc":["js/course-content.js"]
    };
    var pname = $('body').data('name'),
        names = $('.header .color-grey');
    var bobo = $('#bo-html'), _text = '', reg = /\{\{((?:.|\n)+?)\}\}/g;

    function initPage(){
        locateName();
        getBoHtml();
        jsRely(pname);
    }
    function locateName(){
        names.each(function(){
            var href = $(this).attr('href');
            if(href.indexOf(pname)>-1) $(this).addClass('on');
        });
    }
    function jsRely(name){
        var js = config[name];
        if(js){
            var html = '';
            for(var i = 0;i<js.length;i++){
                html += '<script src="'+js[i]+'"></script>';
            }
            $('body').append(html);
        }
    }
    function getBoHtml(){
        if(bobo.length>0) _text = bobo.html();
        window.TEXT = _text;
    }
    window.staticHtml = function(data, node){
        var text = '', nd = node||bobo;
        if(bobo.length>0){
            text = bobo.html();
            nd.html(dataInject(text, data));
        }
    };
    window.dataInject = function(text, data){
        //var defaultRegex = "{{(.*?)}}";
        while(true){
            var c = reg.exec(text);
            if(c === null) return text;
            text = text.replace(c[0], data[c[1]]);
        }
    };
    initPage();

})(window, jQuery);