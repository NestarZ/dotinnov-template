var width = window.innerWidth,
    height = window.innerHeight;

function getRandomColor() {
    var colours = ["FF3212", "003693"]; // color range
    return colours[Math.floor(Math.random() * colours.length)]
}

function getRandomOpacity() {
    var opacity = [1]; // opacity range
    return opacity[Math.floor(Math.random() * opacity.length)]
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
// returns a gaussian random function with the given mean and stdev.
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        } else {
            var x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        var retval = mean + stdev * y1;
        if (retval > 0)
            return retval;
        return -retval;
    }
}

var maxDiam = 120;
var circleNum = 15;
var container = $("#random_circles")
var containerWidth = container.width();
var containerHeight = container.height();

function collision($div1, num1, num2, $div2) {
    var x1 = $div1.offset().left + num1;
    var y1 = $div1.offset().top + num2;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}


$(document).ready(function() {
    function Local() {
        return {
            set: function(key, obj) {
                localStorage.setItem(key, JSON.stringify(obj));
                return obj;
            },
            get: function(key) {
                var obj = {};
                if (localStorage.getItem(key) !== 'undefined') {
                    obj = JSON.parse(localStorage.getItem(key));
                }
                return obj;
            },
            clear: function() {
                localStorage.clear();
                return this;
            },
            remove: function(key) {
                localStorage.removeItem(key);
                return this;
            }
        };
    }
    var local = Local();

    var standard_var = gaussian(0.01 * containerWidth + 10, 30);
    for (var i = 0; i < circleNum; i++) {
        var newCircle = $("<div />");

        // Cercle diameter
        var d = Math.min(50, Math.max(20, Math.max(0.01 * containerWidth, Math.min(standard_var(), 0.1 * containerWidth))));

        // Authorized boxes to display circles (depend on cercle diameter)
        // format : top, bottom, left, right
        var top_box = [100, 0.20 * containerHeight - d, 0, containerWidth];
        var bottom_box = [0.70 * containerHeight + d, containerHeight, 0, containerWidth];
        var left_box = [0, containerHeight, -d - 10, 0.20 * containerWidth - d]
        var right_box = [0, containerHeight, 0.60 * containerWidth + d, containerWidth]

        // Group boxes
        var boxes = [top_box, left_box, right_box];
        var boxes_names = ["top", "left", "right"]

        // p(circle in box_i) = p(circle in height_i) * p(circle in width_i) = 0.25
        var box = boxes[i % boxes.length];


        // Randomly find position inside selected box
        var top = getRandomArbitrary(box[0], box[1]);
        var left = getRandomArbitrary(box[2], box[3]);

        var color = getRandomColor();
        var opacity = getRandomOpacity();

        // Unique CSS ID for circle
        newCircle.attr('id', 'circle_' + i);

        // Add circle information as CSS classes, also used for styling
        newCircle.addClass("circle");
        newCircle.addClass("circle_bg");
        newCircle.addClass("circle_" + boxes_names[i % boxes.length]);
        newCircle.addClass("circle_" + color);

        var svg_hexagon_height = d * 2;
        var svg_hexagon_width = svg_hexagon_height * Math.sqrt(3) / 2;
        var hexagon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="' + svg_hexagon_width + '" height="' + svg_hexagon_height + '" viewbox="0 0 51.96152422706631 60" style="filter: drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 0px);"><path fill="#' + color + '" d="M25.980762113533157 0L51.96152422706631 15L51.96152422706631 45L25.980762113533157 60L0 45L0 15Z"></path></svg>';

        var triangles = [
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + d + '" height="' + d + '" viewBox="0 0 297 297"><path d="M148.5 297L19.9 74.25L277.1 74.25z" fill="#' + color + '"/></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + d + '" height="' + d + '" viewBox="0 0 297 297"><path d="M74.25 277.1L74.25 19.9L297 148.5z" fill="#' + color + '"/></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + d + '" height="' + d + '" viewBox="0 0 297 297"><path d="M277.1 222.75L19.9 222.75L148.5 0z" fill="#' + color + '"/></svg>'
        ]
        var triangle = triangles[Math.floor(Math.random() * triangles.length)];
        var circle = '<svg width="' + d + '" height="' + d + '"><circle cx="' + d / 2 + '" cy="' + d / 2 + '" r="' + d / 2 + '" fill="#' + color + '" /></svg>';
        var shapes = [circle, triangle, hexagon, circle];

        newCircle.append(shapes[Math.floor(Math.random() * shapes.length)]);
        newCircle.css({
            width: d,
            height: d,
            left: left,
            top: top,
            marginLeft: '0px',
            marginTop: '0px',
            backgroundColor: "transparent",
            opacity: getRandomOpacity()
        });
        container.append(newCircle);
    }


    var defaultTime = 10000;
    var time = 80;

    function runIt() {
        var timeout;
        var standard_var2 = gaussian(0, 3);

        function moveAimlessly() {
            $(".circle_bg").each(function() {
                var x2 = Math.floor(Math.random() * 2) == 1 ? "+=" + Math.floor(standard_var2()).toString() : "-=" + Math.floor(standard_var2()).toString();
                var y2 = Math.floor(Math.random() * 2) == 1 ? "+=" + Math.floor(standard_var2()).toString() : "-=" + Math.floor(standard_var2()).toString();
                $(this).stop().velocity({
                    marginLeft: y2,
                    marginTop: x2
                }, time, 'linear');
            });
            timeout = requestAnimationFrame(moveAimlessly, time);
        }
        moveAimlessly();
    }
    runIt();

    $(".circle_bg").each(function() {
        local.set($(this).attr('id'), [$(this).offset().top, $(this).offset().left]);
        $(this).css('transition', 'top 10s ease-in-out, left 5s ease-in-out');
    });

    $('#aboutbtn').hover(function() {
        $(".circle").each(function() {
            $(this).css('top', $('#aboutbtn').offset().top + $('#aboutbtn').height() / 2);
            $(this).css('left', $('#aboutbtn').offset().left + $('#aboutbtn').width() / 2);
        });
    }, function() {
        // on mouseout, reset the background colour
        $(".circle").each(function() {
            var savedPos = local.get($(this).attr('id'));
            $(this).css('top', savedPos[0]);
            $(this).css('left', savedPos[1]);
        });
    });
});