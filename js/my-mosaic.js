/**
 * Created by bobo on 2017/3/20.
 */
(function(window){
    var img = new Image(),
        canvas = window.document.querySelector('#dolly2');
    img.src = '../img/1.jpg';
    var w = img.width, h = img.height,
        ctx = canvas.getContext('2d');
    var imgData = [], Paths = {}, key = 0;
    function mosaic(){
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, w, h).data;
        //console.log(imgData.length);
        detector(evnt);
        var path = new Path();
        path.Rectangle({
            origin:{x:0, y:0},
            size:{w:w,h:h},
            monitorType:'click',
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
                monitorType:'click',
                monitorEvent:evnt
            });
            new Path().Rectangle({
                origin:{
                    x:path.center.x,
                    y:path.origin.y
                },
                size:{w:path.size.w/2,h:path.size.h},
                monitorType:'click',
                monitorEvent:evnt
            });
        }else{
            new Path().Rectangle({
                origin:path.origin,
                size:{w:path.size.w,h:path.size.h/2},
                monitorType:'click',
                monitorEvent:evnt
            });
            new Path().Rectangle({
                origin:{
                    x:path.origin.x,
                    y:path.center.y
                },
                size:{w:path.size.w,h:path.size.h/2},
                monitorType:'click',
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
            this.fillColor = this.getCenterColor();
            drawRectangle(self);
            if(self.monitorType){
                self.monitor(self.monitorType, self.monitorEvent);
            }
        },
        monitor:function(){
            this.key = key;
            Paths[key] = this;
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
            //var num = 0;
            var r = imgData[num], g = imgData[num+1], b = imgData[num+2], a = imgData[num+3]/255;
            //console.log(r, g, b, a);
            return 'rgba('+r+','+g+','+b+','+a+')'
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
    function detector(callback){
        var left = canvas.offsetLeft, top = canvas.offsetTop;
        canvas.addEventListener('mousemove', function(event){
            var e = event||window.event;
            var rx = e.clientX-left, ry = e.clientY-top;
            //console.log(rx);
            for(var i in Paths){
                if( rx>Paths[i].origin.x &&
                    rx<=Paths[i].maximumx &&
                    ry>Paths[i].origin.y &&
                    ry<=Paths[i].maximumy ){
                    callback&&callback(Paths[i], [rx, ry]);
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
    img.onload = mosaic;
})(window);