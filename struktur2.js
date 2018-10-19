var App = function(targetElementId, viewWidth, viewHeight, squaresX, squaresY){     //App
    var me = this;

    me.canvas = document.getElementById(targetElementId);
    me.ctx = me.canvas.getContext("2d");
    me.button = document.getElementById("start");


    var body = document.getElementsByTagName('body')[0];
    body.style.margin = '0px';
    body.style.overflow = "hidden";


    viewWidth = me.canvas.width = window.innerWidth ;
    viewHeight = me.canvas.height = window.innerHeight ;

    squaresX = squaresX || 20;
    squaresY = squaresY || 20;
    var _squareWidth = me.canvas.width/squaresX;
    var _squareHeight = _squareWidth;
    var grid = new Grid(squaresX, squaresY);

    var _mouseDown = false;                                                         //Maus
    var handleClick = function(event){
        var x = event.pageX - me.canvas.offsetLeft;
        var y = event.pageY - me.canvas.offsetTop;
        var i = Math.floor(x/_squareWidth);
        var j = Math.floor(y/_squareHeight);
        grid.getCell(i, j).isAlive = true;
        return;
    };

    var _startSim = false;

    window.onkeydown = function(ev){
        _startSim = !_startSim;
    };
    window.onresize = function(ev){
        viewWidth = me.canvas.width = window.innerWidth;
        viewHeight = me.canvas.height = window.innerHeight;
    };
    me.canvas.addEventListener('mousedown', function(event){
        _mouseDown = true;
        handleClick(event);
        me.canvas.addEventListener('mousemove', handleClick);
    });
    me.canvas.addEventListener('mouseup', function(event){
        _mouseDown = false;
        me.canvas.removeEventListener('mousemove', handleClick);
    });
    me.start = function(){
        setInterval(function(){
            me.update();
            me.draw();
        }, 60);                                                                     //Wird alle 60ms aktualisiert

    };

    me.update = function(){
        if(_startSim){
            grid.updateLiving();
        }
    };

    me.draw = function(){

        me.ctx.fillStyle = 'white';
        me.ctx.fillRect(0,0,me.canvas.width,me.canvas.height);


        grid.filter(function(cell){
            return cell.isAlive;
        }).forEach(function(cell){
            me.ctx.fillStyle = 'black';
            me.ctx.fillRect(cell.x * _squareWidth, cell.y * _squareHeight, _squareWidth, _squareHeight);
        });

        me.ctx.fillStyle = 'gray';
        for(var x = 0; x <= viewWidth; x+=_squareWidth){
            me.ctx.beginPath();
            me.ctx.moveTo(x, 0);
            me.ctx.lineTo(x, viewHeight);
            me.ctx.stroke();
        };

        for(var y = 0; y <= viewHeight; y+= _squareHeight){
            me.ctx.beginPath();
            me.ctx.moveTo(0, y);
            me.ctx.lineTo(viewWidth, y);
            me.ctx.stroke();
        };
    };

    return me;
};


var app = new App("game", 1000, 1000, 100, 50);
app.start();