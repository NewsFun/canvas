/**
 * Created by Administrator on 2016/1/12.
 */
window.onload = function sc(){
    var canvas = setCanvas();
    var ctx = canvas.getContext('2d');

    var Style = {
        randomColor:function (){
            var r = parseInt(Math.random()*255),
                g = parseInt(Math.random()*255),
                b = parseInt(Math.random()*255);
            return '#'+r.toString(16)+ g.toString(16)+ b.toString(16);
        },
        radial:function(ball){
            var rg = ctx.createRadialGradient(ball.x, ball.y, parseInt(ball.radius/4), ball.x, ball.y, ball.radius);
            rg.addColorStop(0, 'yellow');
            rg.addColorStop(1, 'black');
            return rg;
        }
    };
};