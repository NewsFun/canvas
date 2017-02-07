var canvas = setCanvas();
var ctx = canvas.getContext('2d');
var W = window.innerWidth, H = window.innerHeight, MAX = Math.max, MIN = Math.min;
var par_array = [], old = b = new _brick(10), clock = 0, step = 1; par_array.push(b);
function drawBrick(brick){
    ctx.fillStyle = brick.style;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
}
function setOpacity(opacity){
    var op = MIN(MAX(0, opacity), 10);
    return 'rgba(255, 255, 255, '+op/10+')';
}
function _brick(opacity){
    this.opacity = opacity;
    this.style = setOpacity(this.opacity);
    this.x = 0;
    this.y = H/2;
    this.w = 10;
    this.h = 40;
}
function createArray(){
    par_array[0] = b;
    while(old.opacity>step){
        var len = par_array.length;
        var last = par_array[len-1];
        old = JSON.parse(JSON.stringify(last));
        old.opacity -= step;
        old.style = setOpacity(old.opacity);
        par_array.push(old);
    }
    console.log(par_array);
}
function update(){
    var old = JSON.parse(JSON.stringify(b));
    par_array.push(old);
    console.log(par_array.length);
    for(var i = 0;i<par_array.length;i++){
        //console.log(par_array[i]);
        if(par_array[i].opacity>1){
            --par_array[i].opacity;
            par_array[i].style = setOpacity(par_array[i].opacity);
        }else{
            par_array.splice(i,1);
            console.log(par_array.length);
        }
    }
    b.x++;
    drawBrick(b);
    render(par_array);
}
function render(arr){
    var array = arr||par_array;
    for(var i = 0;i<array.length;i++){
        drawBrick(array[i]);
    }
}
//drawBrick();
function animate(){
    ctx.clearRect(0, 0, W, H);
    update();
    clock++;
    requestAnimationFrame(animate);
}
//createArray();
animate();