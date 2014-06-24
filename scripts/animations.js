(function () {
    window.onload = function () {
        var textStartY = 120,
            fontSize = 33,
            letterDistance = fontSize + 20,
            canvasWidth = 100,
            canvasHeight = 500;

        createLogoAnimation('animation-left', 'Canvas', canvasWidth, canvasHeight, textStartY, fontSize);
        createLogoAnimation('animation-rigth', 'Monster', canvasWidth, canvasHeight, textStartY, fontSize);

        function createLogoAnimation(container, inputText,canvasWidth, canvasHeight, textStartY, fontSize) {
            var stage,
                layer;

            initializeCanvas(container, canvasWidth, canvasHeight);

            telerikLogo(layer);

            telericText(layer, inputText, textStartY, fontSize);

            animation(stage, layer);                      

            function initializeCanvas(container, canvasWidth, canvasHeight) {
                stage = new Kinetic.Stage({
                    container: container,
                    width: canvasWidth,
                    height: canvasHeight
                });

                layer = new Kinetic.Layer();
            }

            function telerikLogo(layer) {
                var logoLine = new Kinetic.Line({
                    points: [13, 35, 30, 20, 72, 60, 52, 80, 33, 60, 70, 20, 90, 35],
                    stroke: 'green',
                    strokeWidth: 2,
                    lineJoin: 'round'
                });

                layer.add(logoLine);
            }

            function telericText(layer, inputText, textStartY, fontSize) {

                var letters = inputText.split('');

                for (var i = 0, len = letters.length; i < len; i++) {
                    var nextLetter = text(letters[i], point(i), fontSize);

                    layer.add(nextLetter);
                }

                function text(text, point, fontSize) {
                    var text = new Kinetic.Text({
                        x: point.x,
                        y: point.y,
                        text: text,
                        fontSize: fontSize,
                        fontFamily: 'Calibri',
                        fill: 'black'
                    });

                    return text;
                }

                function point(pointIndex) {
                    var point = {
                        x: canvasWidth / 2,
                        y: textStartY + pointIndex * letterDistance
                    }

                    return point;
                }
            }
          
            function animation(stage, layer) {
                var period = 3000;

                var anim = new Kinetic.Animation(function (frame) {
                    var scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001;
                    var shapes = stage.find('Text');
                    shapes.scale({ x: scale, y: scale });
                }, layer);

                anim.start();

                stage.add(layer);
            }
        }
    };

}).call(this);