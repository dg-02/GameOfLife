var Cell = function(x,y, _cells){                                       //Zelle
    var me = this;

    me.isAlive = false;                                                 //Sagt aus, ob die Zelle lebt
    me.x = x;
    me.y = y;
    me.distance = function(cell){
        return Math.abs(cell.x - me.x) + Math.abs(cell.y - me.y);
    };
    me.neighbors = null;                                                //Nachbarn
    me.countNeighbors = function(){                                     //Zählt Nachbarn
        return me.neighbors.filter(function(cell){
            return cell.isAlive;
        }).length;
    };
    return me;
};

var Grid = function(width, height){                                     //Raster
    var me = this;
    var _cells = new Array(width*height);
    var _living = [];
    for(var i = 0; i < width; i++){
        for(var j = 0; j < height; j++){
            (function(){
                _cells[i+j*width] = new Cell(i, j, _cells);
            })();
        }
    }

    _cells.forEach(function(cell){
        cell.neighbors = _cells.filter(function(cell2){
            var dx = Math.abs(cell2.x - cell.x);
            var dy = Math.abs(cell2.y - cell.y);
            return (dx === 1 && dy === 1 ) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });
    });

    me.filter = function(fcn){
        return _cells.filter(fcn);
    };
    me.updateLiving = function(){

        var totUeber = _cells.filter(function(cell){
            return cell.isAlive && (cell.countNeighbors() > 3);           //Tod durch Ueberbevoelkerung
        });
        var totUnter = _cells.filter(function(cell){
            return cell.isAlive && (cell.countNeighbors() < 2);           //Tod durch Unterbevoelkerung
        })
        var reproduktion = _cells.filter(function(cell){
            return !cell.isAlive && cell.countNeighbors() === 3;          //Belebung einer toten Zelle
        });
        var lebtWeiter = _cells.filter(function(cell){
            return cell.isAlive && (cell.countNeighbors() === 2 || cell.countNeighbors() === 3); //Ueberleben
        });
        totUeber.concat(totUnter).forEach(function(cell){
            cell.isAlive = false;                                         //tote Zelle
        });
        reproduktion.forEach(function(cell){
            cell.isAlive = true;                                          //lebendige Zelle
        });
        lebtWeiter.forEach(function(cell){
            cell.isAlive = true;                                          //lebende Zelle
        });
    };

    me.getCell = function(x,y){
        return _cells[x+y*width];
    };
    return me;
}

/*Lebende Zellen mit mehr als drei lebenden Nachbarn sterben in der Folgegeneration an Überbevölkerung.
  Lebende Zellen mit weniger als zwei lebenden Nachbarn sterben in der Folgegeneration an Einsamkeit.
  Eine lebende Zelle mit zwei oder drei lebenden Nachbarn bleibt in der Folgegeneration am Leben.
  Eine tote Zelle mit genau drei lebenden Nachbarn wird in der Folgegeneration neu geboren.*/