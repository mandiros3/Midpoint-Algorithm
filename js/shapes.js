/*Andi Milhomme 


shapes.js

mains*/

// Declaration of essentials variables
var canvasState = -1;

var points = [];
var brush = 1; // line size in pixels






function clearCanvas() {

     var canvas = $('canvas')[0];;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];

}

function isRectangle() {
    canvasState = 0;
  points = [];
  $("#message").html("Draw a rectangle by dragging your mouse");

}


function isPolygon() {

    if (points.length > 5 && canvasState == 1) {
        var canvas = $('canvas')[0];;
        var context = canvas.getContext('2d');
        drawLine(points[points.length - 2], points[points.length - 1],
                 points[0], points[1], context);
    }
    canvasState = 1;
    points = [];
    $("#message").html("Draw a rectangle by drawing a line, then  click Get Polygon again to finish.");

}

function isPolyline() {

    canvasState = 2;
    points = [];
    $("#message").html("Draw lines by dragging your mouse, then clicking.");
}


//event handlers

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: parseInt(evt.clientX - rect.left),
        y: parseInt(evt.clientY - rect.top)
    };
}

function down(x, y) {

    var canvas = $('canvas')[0];;
    var context = canvas.getContext('2d');

    if (canvasState == 0) {
        // user is starting to draw a rectangle
        context.clearRect(0, 0, canvas.width, canvas.height);
        points.push(x, y);
    } else {
        // user is starting to draw a polygon/polyline
        if (points.length == 0) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            points.push(x, y);
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
            var ptx = points[0]; var pty = points[1];
            for (i = 2; i + 1 < points.length; i = i + 2) {
                drawLine(ptx, pty, points[i], points[i + 1], context);
                ptx = points[i];
                pty = points[i + 1];
            }
            drawLine(ptx, pty, x, y, context);
        }
    }
}


function drag(x, y) {

    var canvas = $('canvas')[0];;
    var context = canvas.getContext('2d');

    if (canvasState == 0) {
        // user is drawing a rectangle
        points[2] = x; points[3] = y;
        context.clearRect(0, 0, canvas.width, canvas.height);
        var x0 = points[0]; var y0 = points[1];
        var x1 = points[2]; var y1 = points[3];
        drawLine(x0, y0, x1, y0, context);
        drawLine(x1, y0, x1, y1, context);
        drawLine(x1, y1, x0, y1, context);
        drawLine(x0, y1, x0, y0, context);
    } else {
        // user is drawing a polygon/polyline
        context.clearRect(0, 0, canvas.width, canvas.height);
        var ptx = points[0]; var pty = points[1];
        for (i = 2; i + 1 < points.length; i = i + 2) {
            drawLine(ptx, pty, points[i], points[i + 1], context);
            ptx = points[i];
            pty = points[i + 1];
        }
        drawLine(ptx, pty, x, y, context);
    }
}

// event called when the mouse click is lifted up on the shapes canvas
function up(x, y) {

    var canvas = $('canvas')[0];;
    var context = canvas.getContext('2d');

    if (canvasState == 0) {
        // user has finished drawing a rectangle
        points = [];
    } else {
        // user has finished one line in the polygon/polyline
        points.push(x, y);
    }
}

window.onload = function () {

    var canvas = $('canvas')[0];;
    var context = canvas.getContext('2d');

    var mouseDown = false;

    // create mouse listeners for the shapes canvas
    canvas.addEventListener('mousedown', function (evt) {
        mouseDown = true;
        var mousePos = getMousePos(canvas, evt);
        down(mousePos.x, mousePos.y);
    });

    canvas.addEventListener('mousemove', function (evt) {
        if (mouseDown) {
            var mousePos = getMousePos(canvas, evt);
            drag(mousePos.x, mousePos.y);
        }
    });

    canvas.addEventListener('mouseup', function (evt) {
        if (mouseDown) {
            var mousePos = getMousePos(canvas, evt);
            up(mousePos.x, mousePos.y);
        }
        mouseDown = false;
    });

    canvas.addEventListener('mouseover', function (evt) {
        mouseDown = false;
    });

    canvas.addEventListener('mouseout', function (evt) {
        mouseDown = false;
    });



}


//draw line is here again
function drawLine(x0, y0, x1, y1, Xcoordinatet) {

    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);

    var dixRadius = 1;
    var diry = 1;
    if (x0 > x1) {
        dixRadius = -dixRadius;
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

        Xcoordinatet.fillRect(x0, y0, brush, brush);

        if (dixRadius > 0 && diry > 0 && x0 >= x1 && y0 >= y1) {
            break;
        } else if (dixRadius > 0 && diry < 0 && x0 >= x1 && y0 <= y1) {
            break;
        } else if (dixRadius < 0 && diry > 0 && x0 <= x1 && y0 >= y1) {
            break;
        } else if (dixRadius < 0 && diry < 0 && x0 <= x1 && y0 <= y1) {
            break;
        }

        if (err > -dx) {
            err = err - dy;
            x0 = x0 + dixRadius;
        }

        if (err < dy) {
            err = err + dx;
            y0 = y0 + diry;
        }
    }
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
