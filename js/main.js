/*Andi Milhomme 

main.js

*/

// Declaration of essentials variables

var canvasState = -1;
var points = [];
var brush = 1; // line size in pixels



//Clear canvas

function clearCanvas() {


    var canvas =$('canvas')[0];
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];


}


//draw grid


function isLine() {
    canvasState = 0;
    $("#message").html("Draw a line by dragging your mouse");
    
}

function isCircle(){
    canvasState = 1;
    $("#message").html("Draw  a circle by dragging your mouse");


}

function isEllipse() {
    if (canvasState != 2) {
       canvasState = 2;
        $("#message").html("Draw  a an ellipse by filling out the form");
    } 
    else {
        //fetching values

        Xcoordinate = $("[name = 'Xcoordinate']")[0].value * 1;
        Ycoordinate = $("[name = 'Ycoordinate']")[0].value * 1;
        xRadius = $("[name = 'xRadius']")[0].value * 1;
        yRadius = $("[name = 'yRadius']")[0].value * 1;


        var canvas = $('canvas')[0];
        var context = canvas.getContext('2d')
        drawEllipse(Xcoordinate, Ycoordinate, xRadius, yRadius, canvas, context);
    }
  
}


//Mouse Event handlers
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: parseInt(evt.clientX - rect.left),
        y: parseInt(evt.clientY - rect.top)
    };
}
function down(x, y) {

    var canvas = $('canvas')[0];
    var context = canvas.getContext('2d');

    if (canvasState == 0 || canvasState == 1) {
       
        context.clearRect(0, 0, canvas.width, canvas.height);
       points.push(x, y);
    }
}


function drag(x, y) {

    var canvas = $('canvas')[0];
    var context = canvas.getContext('2d');

    if (canvasState == 0) {
        // user is drawing a line
        points[2] = x; points[3] = y;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawLine(points[0], points[1], points[2], points[3], context);
    } else if (canvasState == 1) {
        // user is drawing a circle
        points[2] = x; points[3] = y;
        drawCircle(points[0], points[1], points[2], points[3], canvas, context);
    }
}

function up(x,y) {

    if (canvasState == 0 || canvasState == 1) {
        // user has finished drawing a line/circle
        points = [];
    }
}

window.onload = function () {

    var canvas = $('canvas')[0];
    var context = canvas.getContext('2d');
    var mouseDown = false;

    canvas.addEventListener('mousedown', function (evt) {
        mousedown = true;
        var mousePos = getMousePos(canvas, evt);
        down(mousePos.x, mousePos.y);
    });

    canvas.addEventListener('mousemove', function (evt) {
        if (mousedown) {
            var mousePos = getMousePos(canvas, evt);
            drag(mousePos.x, mousePos.y);
        }
    });

    canvas.addEventListener('mouseup', function (evt) {
        if (mousedown) {
            var mousePos = getMousePos(canvas, evt);
            up(mousePos.x, mousePos.y);
        }
        mousedown = false;
    });

    canvas.addEventListener('mouseover', function (evt) {
        mousedown = false;
    });

    canvas.addEventListener('mouseout', function (evt) {
        mousedown = false;
    });







}

//Implementation of midpoint algorithms


function drawLine(x0, y0, x1, y1, cxt) {

    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);

    var dirx = 1;
    var diry = 1;
    if (x0 > x1) {
        dirx = -dirx;
    }
    if (y0 > y1) {
        diry = -diry;
    }

    var err;
    if (dx > dy) {
        err = dx / 2;
    } else {
        err = -dy / 2;
    }

    while (true) {

        cxt.fillRect(x0, y0, brush, brush);

        if (dirx > 0 && diry > 0 && x0 >= x1 && y0 >= y1) {
            break;
        } else if (dirx > 0 && diry < 0 && x0 >= x1 && y0 <= y1) {
            break;
        } else if (dirx < 0 && diry > 0 && x0 <= x1 && y0 >= y1) {
            break;
        } else if (dirx < 0 && diry < 0 && x0 <= x1 && y0 <= y1) {
            break;
        }

        if (err > -dx) {
            err = err - dy;
            x0 = x0 + dirx;
        }

        if (err < dy) {
            err = err + dx;
            y0 = y0 + diry;
        }
    }
}


function drawCircle(x0, y0, x1, y1, c, cxt) {


    cxt.clearRect(0, 0, c.width, c.height);

    var r = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    var x = r;
    var y = 0;
    var e = 1 - x;

    while (x >= y) {

        cxt.fillRect(x + x0, y + y0, brush, brush);
        cxt.fillRect(y + x0, x + y0, brush, brush);
        cxt.fillRect(-x + x0, y + y0, brush, brush);
        cxt.fillRect(-y + x0, x + y0, brush, brush);
        cxt.fillRect(-x + x0, -y + y0, brush, brush);
        cxt.fillRect(-y + x0, -x + y0, brush, brush);
        cxt.fillRect(x + x0, -y + y0, brush, brush);
        cxt.fillRect(y + x0, -x + y0, brush, brush);

        y = y + 1;

        if (e < 0) {
            e = e + (2 * y) + 1;
        } else {
            x = x - 1;
            e = e + (2 * (y - x)) + 1;
        }
    }
}

function drawEllipse(xc, yc, xRadius, yRadius, c, cxt) {

    // clear the canvas
    cxt.clearRect(0, 0, c.width, c.height);

    // midpoint ellipse algorithm
    var rxsq = xRadius * xRadius;
    var rysq = yRadius * yRadius;
    var x = 0;
    var y = yRadius;
    var px = 0;
    var py = 2 * rxsq * y;

    ellipsePts(xc, yc, x, y, cxt);
    var p = rysq - (rxsq * yRadius) + (0.25 * rxsq);

    while (px < py) {

        x = x + 1;
        px = px + 2 * rysq;

        if (p < 0) {
            p = p + rysq + px;
        } else {
            y = y - 1;
            py = py - 2 * rxsq;
            p = p + rysq + px - py;
        }

        ellipsePts(xc, yc, x, y, cxt);
    }

    p = rysq * Math.pow(x + 0.5, 2) + rxsq *
        Math.pow(y - 1, 2) - rxsq * rysq;

    while (y > 0) {

        y = y - 1;
        py = py - 2 * rxsq ;

        if (p > 0) {
            p = p + rxsq - py;
        } else {
            x = x + 1;
            px  = px + 2 * rysq;
            p = p + rxsq - py + px;
        }

        ellipsePts(xc, yc, x, y, cxt);
    }
}

function ellipsePts(xc, yc, x, y, cxt) {

    cxt.fillRect(xc + x, yc + y, brush, brush);
    cxt.fillRect(xc - x, yc + y, brush, brush);
    cxt.fillRect(xc + x, yc - y, brush, brush);
    cxt.fillRect(xc - x, yc - y, brush, brush);
}

// check is array has element and accounting for different types in the array (From stackoverflow)
Array.prototype.contains = function (k) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === k) {
            return true;
        }
    }
    return false;
}