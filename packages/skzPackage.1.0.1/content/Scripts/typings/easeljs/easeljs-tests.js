/// <reference path="easeljs.d.ts" />
var stage;
var myContext2D;

function test_simple() {
    var canvas = document.getElementById('canvas');
    var stage = new createjs.Stage(canvas);
    var shape = new createjs.Shape();
    shape.graphics.beginFill('rgba(255,0,0,1)').drawRoundRect(0, 0, 120, 120, 10);
    stage.addChild(shape);
    stage.update();
}

function test_animation() {
    var ss = new createjs.SpriteSheet({
        "frames": {
            "width": 200,
            "numFrames": 64,
            "regX": 2,
            "regY": 2,
            "height": 361
        },
        "animations": { "jump": [26, 63], "run": [0, 25] },
        "images": ["./assets/runningGrant.png"]
    });

    ss.getAnimation("run").speed = 2;
    ss.getAnimation("run").next = "jump";
    ss.getAnimation("jump").next = "run";

    var sprite = new createjs.Sprite(ss);
    sprite.scaleY = sprite.scaleX = .4;

    sprite.gotoAndPlay("run");

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', stage);
    stage.addChild(sprite);
}

function test_graphics() {
    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
    g.beginFill(createjs.Graphics.getRGB(255, 0, 0));
    g.drawCircle(0, 0, 3);
    var s = new createjs.Shape(g);
    s.x = 100;
    s.y = 100;
    stage.addChild(s);
    stage.update();

    var myGraphics;
    myGraphics.beginStroke("#F00").beginFill("#00F").drawRect(20, 20, 100, 50).draw(myContext2D);
}

function colorMatrixTest() {
    var shape = new createjs.Shape().set({ x: 100, y: 100 });
    shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 50);

    var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
    shape.filters = [
        new createjs.ColorMatrixFilter(matrix)
    ];

    shape.cache(-50, -50, 100, 100);
}
//# sourceMappingURL=easeljs-tests.js.map
