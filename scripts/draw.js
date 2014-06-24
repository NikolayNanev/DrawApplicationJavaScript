var CANVAS_WIDTH = 667,
    CANVAS_HEIGHT = 500;

var brushColor = $('#color-input').val(),
    brushWidth = $('#width-slider').val(),
    brushValue = $('#width-value').val(brushWidth);

var isBrushOn = false,
    isRubberOn = false,
    isLineOn = false,
    isRubberOn = false,
    isRectangleOn = false,
    isCircleOn = false;

canvasView = $('#canvas-view')[0];
canvasDraw = $('#canvas-draw')[0];

var contextView = initializeCanvasContext(canvasView, CANVAS_WIDTH, CANVAS_HEIGHT);
var contextDraw = initializeCanvasContext(canvasDraw, CANVAS_WIDTH, CANVAS_HEIGHT);

function initializeCanvasContext(canvasElement, width, height) {
    var canvas = canvasElement,
        context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    return context;
}

// Attach the mousedown, mousemove and mouseup event listeners.
canvasDraw.addEventListener('mousedown', ev_canvas, false);
canvasDraw.addEventListener('mousemove', ev_canvas, false);
canvasDraw.addEventListener('mouseup', ev_canvas, false);

var tool = this;
this.started = false;

// This is called when you start holding down the mouse button.
this.mousedown = function (event) {
    //If Brush Mode Is ON

    if ((isBrushOn === true) || (isRubberOn === true)) {
        tool.started = true;
        contextDraw.beginPath();
        contextDraw.moveTo(event._x, event._y);

    }

    if ((isLineOn === true) || (isRectangleOn === true) || (isCircleOn === true)) {
        tool.started = true;
        tool.x0 = event._x;
        tool.y0 = event._y;
    }
};

this.mousemove = function (event) {

    function setBrush() {
        contextDraw.lineTo(event._x, event._y);
        contextDraw.lineCap = 'round';
        contextDraw.stroke();
        contextDraw.restore();
    }

    function setRubber() {
        contextDraw.lineTo(event._x, event._y);
        contextDraw.strokeStyle = '#FFF';
        contextDraw.lineCap = 'round';
        contextDraw.stroke();
        contextDraw.restore();
    }

    function setLine() {
        contextDraw.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        contextDraw.beginPath();
        contextDraw.moveTo(tool.x0, tool.y0);
        contextDraw.lineCap = 'round';
        contextDraw.lineTo(event._x, event._y);
        contextDraw.stroke();
        contextDraw.closePath();
    }

    function setRange() {
        rx = Math.min(event._x, tool.x0);
        ry = Math.min(event._y, tool.y0);
        rw = Math.abs(event._x - tool.x0);
        rh = Math.abs(event._y - tool.y0);

        contextDraw.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (!rw || !rh) {
            return;
        }
    }

    function setRectangle() {
        contextDraw.strokeRect(rx, ry, rw, rh);
    }

    function setCircle() {
        var cx = rx + parseInt(rw / 2),
            cy = ry + parseInt(rh / 2);

        var circumference = Math.min(rw, rh),
            radius = parseInt(circumference / 2),
            scaleX = rw / circumference,
            scaleY = rh / circumference;

        contextDraw.moveTo(cx, cy);
        contextDraw.beginPath();
        contextDraw.arc(cx, cy, radius, 0, 2 * Math.PI);
        contextDraw.stroke();
    }

    if (tool.started) {

        contextDraw.lineWidth = brushWidth;
        contextDraw.strokeStyle = brushColor;

        if (isBrushOn === true) {
            setBrush();
        }

        if (isRubberOn === true) {
            setRubber();
        }

        if (isLineOn === true) {
            setLine();
        }

        if (isRectangleOn === true || isCircleOn === true) {

            var rx, ry, rw, rh;

            setRange();

            if (isRectangleOn === true) {
                setRectangle();
            }

            else if (isCircleOn === true) {
                setCircle();
            }
        }
    }
};

this.mouseup = function (event) {
    if (tool.started) {
        if (isBrushOn === true || isRubberOn === true || isLineOn === true ||
            isRectangleOn === true || isCircleOn === true) {
            tool.mousemove(event);
            tool.started = false;
            updateCanvasView();
        }
    }

    function updateCanvasView() {
        contextView.drawImage(canvasDraw, 0, 0);
        contextDraw.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
};

this.onmouseout = function (event) {
    if (tool.started) {
        tool.mousemove(event);
        tool.started = false;
    }
};

// The general-purpose event handler. This function just determines the mouse 
// position relative to the canvas element.
function ev_canvas(event) {
    if (event.offsetX || event.offsetX == 0) { // Opera
        event._x = event.offsetX;
        event._y = event.offsetY;
    }
    else if (event.layerX || event.layerX == 0) { // Firefox
        event._x = event.layerX;
        event._y = event.layerY;
    }

    // Call the event handler of the tool.
    var func = tool[event.type];

    if (func) {
        func(event);
    }
}

$('.tool').on('click', function () {
    var currentButton = $(this)[0];
    var idCurrentButton = currentButton.id;

    switch (idCurrentButton) {
        case 'brush-btn':
            isBrushOn = isToolSelected(isBrushOn);
            changeAppearanceOfButton(currentButton, isBrushOn);
            break;
        case 'line-btn':
            isLineOn = isToolSelected(isLineOn);
            changeAppearanceOfButton(currentButton, isLineOn);
            break;
        case 'rubber-btn':
            isRubberOn = isToolSelected(isRubberOn);
            changeAppearanceOfButton(currentButton, isRubberOn);
            break;
        case 'rect-btn':
            isRectangleOn = isToolSelected(isRectangleOn);
            changeAppearanceOfButton(currentButton, isRectangleOn);
            break;
        case 'circle-btn':
            isCircleOn = isToolSelected(isCircleOn);
            changeAppearanceOfButton(currentButton, isCircleOn);
            break;
    }

    function isToolSelected(tool) {
        if (tool === true) {
            tool = false;
        }
        else {
            deselectAllTools();
            deselectAllButtons();

            tool = true;
        }
        return tool;
    }

    function changeAppearanceOfButton(btn, condition) {

        var $button = $(btn),
            $canvas = $('#canvas-container');

        var color = (condition) ? 'white' : 'yellowgreen',
            background = (condition) ? 'yellowgreen' : 'white',
            cursor = (condition) ? 'crosshair' : 'default';

        $button.css('color', color);
        $button.css('background', background);

        $canvas.css('cursor', cursor);
    }

    function deselectAllTools() {
        isBrushOn = false;
        isLineOn = false;
        isRubberOn = false;
        isRectangleOn = false;
        isCircleOn = false;
    }

    function deselectAllButtons() {
        var $allButtons = $('.tool');

        for (var i = 0; i < $allButtons.length; i++) {
            changeAppearanceOfButton($allButtons[i], false);
        }
    }
});

$('.action').on('click', function () {
    var currentAction = $(this)[0];
    var idCurrentActon = currentAction.id;

    switch (idCurrentActon) {
        case 'clear-canvas':
            clearCanvas();
            break;
        case 'save-image':
            saveCanvas();
            break;
    }

    function clearCanvas() {
        contextDraw.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        contextView.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    function saveCanvas() {
        var fname = 'canvas-picture';

        var data = canvasView.toDataURL("image/png");
        data = data.substr(data.indexOf(',') + 1).toString();

        var dataInput = $('<input>')
            .attr("name", 'imgdata')
            .attr("value", data)
            .attr("type", "hidden");

        var nameInput = $('<input>')
            .attr("name", 'name')
            .attr("value", fname + '.png');

        var myForm = $('<form>')
            .attr('method', 'post')
            .attr('action', 'http://greenethumb.com/canvas/lib/saveme.php');

        myForm.append(dataInput);
        myForm.append(nameInput);

        $('body').append(myForm);
        myForm.submit();
        myForm.remove();
    }
});

$('.change').on('change', function () {
    var currentAction = $(this)[0];
    var idCurrentActon = currentAction.id;

    console.dir(idCurrentActon);

    switch (idCurrentActon) {
        case 'color-input':
            changeColor();
            break;
        case 'width-slider':
            changeWidth();
            break;
    }

    function changeColor() {
        brushColor = $('#color-input').val();
    }

    function changeWidth() {
        brushWidth = $('#width-slider').val();
        brushValue = $('#width-value').val(brushWidth);
    }
});

$('#input-image').on('change', function (event) {
    var file = event.target.files[0],
        imageType = /image.*/;

    if (!file.type.match(imageType)) {
        return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = fileOnload;

    function fileOnload(event) {
        var $img = $('<img>').attr('src', event.target.result);

        $img.load(function () {
            var $image = $(this)[0];

            if ($image.width < CANVAS_WIDTH && $image.height < CANVAS_HEIGHT) {
                contextView.drawImage($image, 0, 0);
            }
            else {
                contextView.drawImage($image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        });
    }
});