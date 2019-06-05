/**
 * Created by bobo on 2017/3/20.
 */
(function(window){
    var img = new Image();
    var canvas = document.querySelector('#dolly2');
    img.src = '../img/beibei.jpg';

    // var eventName = isMobile() ? 'touchmove' : 'mousemove';
    var eventName = 'mousemove';
    var w = img.width,
        h = img.height,
        ctx = canvas.getContext('2d');
    var imgData = [],
        Paths = {},
        key = 0,
        type = {};

    img.onload = function (){
        detector(eventName);
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, w, h).data;
        new Path().Rectangle({
            origin:{x:0, y:0},
            size:{w:w,h:h},
            monitorType:eventName,
            monitorEvent:evnt
        });
    }

    function evnt(path, pos){
        //console.log(path);
        if(path.size.w<2||path.size.h<2) return;
        if(path.size.w>path.size.h){
            new Path().Rectangle({
                origin:path.origin,
                size:{w:path.size.w/2,h:path.size.h},
                monitorType:eventName,
                monitorEvent:evnt
            });
            new Path().Rectangle({
                origin:{
                    x:path.center.x,
                    y:path.origin.y
                },
                size:{w:path.size.w/2,h:path.size.h},
                monitorType:eventName,
                monitorEvent:evnt
            });
        }else{
            new Path().Rectangle({
                origin:path.origin,
                size:{w:path.size.w,h:path.size.h/2},
                monitorType:eventName,
                monitorEvent:evnt
            });
            new Path().Rectangle({
                origin:{
                    x:path.origin.x,
                    y:path.center.y
                },
                size:{w:path.size.w,h:path.size.h/2},
                monitorType:eventName,
                monitorEvent:evnt
            });
        }
        delete Paths[path.key];
    }

    function Path(){
        this.origin = {x:0,y:0};
        this.size = {w:10,h:10};
        this.fillColor = 'rgba(255, 255, 255, 0.5)';
    }

    Path.prototype = {
        constructor:Path,
        Rectangle:function(config){
            var self = this;
            mergeObject(self, config).setBounds();
            self.fillColor = this.getCenterColor();
            drawRectangle(self);
            if(self.monitorType) self.monitor();
        },
        monitor:function(){
            var self = this;
            self.key = key;
            Paths[key] = self;
            if(self.monitorType){
                if(!type[self.monitorType]){
                    type[self.monitorType] = {};
                }
                type[self.monitorType][key] = self;
            }

            key+=1;
        },
        setBounds:function(){
            this.maximumx = this.origin.x+this.size.w;
            this.maximumy = this.origin.y+this.size.h;
            this.center = {
                x:Math.ceil(this.origin.x+this.size.w/2),
                y:Math.ceil(this.origin.y+this.size.h/2)
            };
            return this;
        },
        getCenterColor:function(){
            var x = this.center.x, y = this.center.y;
            var num = (x+(y-1)*w)*4;
            var r = imgData[num], g = imgData[num+1], b = imgData[num+2], a = imgData[num+3]/255;
            //console.log(r, g, b, a);
            return 'rgba('+r+','+g+','+b+','+a+')';
        },
        _showCenterPoint:function(){
            var self = this;
            drawRectangle({
                fillColor:'#00ff00',
                origin:self.center,
                size:{w:1, h:1}
            });
        }
    };

    function detector(type){
        var left = canvas.offsetLeft, top = canvas.offsetTop;
        canvas.addEventListener(type, function(event){
            var e = event||window.event;
            var rx = e.clientX-left, ry = e.clientY-top;

            for(var i in Paths){
                var p = Paths[i];
                if( rx>p.origin.x && rx<=p.maximumx && ry>p.origin.y && ry<=p.maximumy ){
                    if(p.monitorEvent) p.monitorEvent(p, [rx, ry]);
                }
            }
        });
    }

    function drawRectangle(path){
        //ctx.moveTo(config.origin.x, config.origin.y);
        ctx.save();
        ctx.fillStyle = path.fillColor;
        ctx.fillRect(path.origin.x, path.origin.y, path.size.w, path.size.h);
        ctx.restore();
        return path;
    }

    function mergeObject(result, obj){
        for(var i in obj){
            result[i] = obj[i];
        }
        return result;
    }

    function isMobile() {
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            isAndroid = ua.match(/(Android)\s+([\d.]+)/),
            isMobile = isIphone || isAndroid;
        //判断
        return isMobile;
    }
})(window);