(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.AssetsMain = function() {
	this.initialize();

	// レイヤー 1
	this.loadingStartBtn = new lib.Btn();
	this.loadingStartBtn.setTransform(309,0);

	this.instance = new lib.Ball();
	this.instance.setTransform(100.5,120.5,1,1,0,0,0,57.5,57.5);
	this.instance.shadow = new cjs.Shadow("rgba(0,0,0,1)",3,3,4);
	this.instance.compositeOperation = "lighter";

	this.addChild(this.instance,this.loadingStartBtn);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(43,0,502,178);


// symbols:
(lib.enterBtnArrow = function() {
	this.initialize(img.enterBtnArrow);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,5,5);


(lib.enterBtnBg = function() {
	this.initialize(img.enterBtnBg);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,236,67);


(lib.enterBtnBg_1 = function() {
	this.initialize(img.enterBtnBg_1);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,300,43);


(lib.enterBtnBg_1_1 = function() {
	this.initialize(img.enterBtnBg_1_1);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,300,42);


(lib.enterBtnText = function() {
	this.initialize(img.enterBtnText);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,134,22);


(lib.トゥイーン2 = function() {
	this.initialize();

	// レイヤー 1
	this.instance = new lib.enterBtnBg_1();
	this.instance.setTransform(-149.9,-21.4);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-149.9,-21.4,300,43);


(lib.トゥイーン1 = function() {
	this.initialize();

	// レイヤー 1
	this.instance_1 = new lib.enterBtnBg_1();
	this.instance_1.setTransform(-149.9,-21.4);

	this.instance_2 = new lib.enterBtnBg_1_1();
	this.instance_2.setTransform(-149.9,-20.9);

	this.addChild(this.instance_2,this.instance_1);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-149.9,-21.4,300,43);


(lib.enterBtnText_1 = function() {
	this.initialize();

	// レイヤー 1
	this.instance_3 = new lib.enterBtnText();

	this.addChild(this.instance_3);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,134,22);


(lib.enterBtnBg_1_1_1 = function() {
	this.initialize();

	// レイヤー 1
	this.instance_4 = new lib.enterBtnBg_1_1();
	this.instance_4.setTransform(-149.9,-20.9);

	this.addChild(this.instance_4);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-149.9,-20.9,300,42);


(lib.ballInner = function() {
	this.initialize();

	// レイヤー 1
	this.shape = new cjs.Shape();
	this.shape.graphics.rf(["#FF0000","rgba(255,255,255,0)"],[0,1],0,0,0,0,0,57.9).s().p("AGWGWQipCpjtAAQjsAAipipQipipAAjtQAAjsCpipQCpipDsAAQDtAACpCpQCpCpAADsQAADtipCpIAAAA").cp();
	this.shape.setTransform(57.5,57.5);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,115,115);


(lib.aboutBtnBg = function() {
	this.initialize();

	// レイヤー 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DE2773").s().p("ABVhUQgQgRgWAAQgQAAgMAJQgNAKgGATIAAAAQgNgmghAAQgWAAgQARQgSASAAAaQAAAkAtAiQAyAoAHAgQAIggAygoQAtgiAAgkQAAgagSgSIAAAA").cp();

	this.addChild(this.shape_1);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-10.2,-10.1,20.7,20.4);


(lib.loadingStartBtnBg1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{},true);

	// レイヤー 1
	this.instance_5 = new lib.トゥイーン1("synched",0);
	this.instance_5.setTransform(146,21);

	this.instance_6 = new lib.トゥイーン2("synched",0);
	this.instance_6.setTransform(115,21);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5,p:{x:146}}]}).to({state:[{t:this.instance_5,p:{x:142.6}}]},1).to({state:[{t:this.instance_5,p:{x:139.1}}]},1).to({state:[{t:this.instance_5,p:{x:135.7}}]},1).to({state:[{t:this.instance_5,p:{x:132.2}}]},1).to({state:[{t:this.instance_5,p:{x:128.8}}]},1).to({state:[{t:this.instance_5,p:{x:125.4}}]},1).to({state:[{t:this.instance_5,p:{x:121.9}}]},1).to({state:[{t:this.instance_5,p:{x:118.5}}]},1).to({state:[{t:this.instance_6}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-0.4,300,43);


(lib.loadingStartBtnBg2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{},true);

	// レイヤー 1
	this.instance_7 = new lib.enterBtnBg_1_1_1();
	this.instance_7.setTransform(150,21);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({x:115},9).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,300,42);


(lib.Ball = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{},true);

	// レイヤー 1
	this.instance_8 = new lib.ballInner();
	this.instance_8.setTransform(57.5,57.5,1,1,0,0,0,57.5,57.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).to({scaleX:1.75,scaleY:1.75},9).to({scaleX:1,scaleY:1},10).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,115,115);


(lib.Btn = function() {
	this.initialize();

	// レイヤー 3
	this.instance_9 = new lib.enterBtnArrow();
	this.instance_9.setTransform(43,30);

	// textMask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AKwDSI1fAAIAAmjIVfAAIAAGj").cp();
	mask.setTransform(131.9,34);

	// text
	this.text1 = new lib.enterBtnText_1();
	this.text1.setTransform(131,34,1,1,0,0,0,67,11);

	this.text1.mask = mask;
	// heart
	this.heart = new lib.aboutBtnBg();
	this.heart.setTransform(45,34);

	// mask (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	mask_1.graphics.p("AJIiTQBwgCBhgEQBggFBKAMQBJAMApAwQAqAvABBkQgGDCiXAOQiXAPjkgNIwXAAQhwABhhAFQhgAEhKgMQhJgLgqgwQgpgvgBhmQABhkApgvQAqgwBJgMQBKgMBgAFQBhAEBwACIQXAA").cp();
	mask_1.setTransform(112,27.9);

	// レイヤー 8
	this.bg2 = new lib.loadingStartBtnBg2();
	this.bg2.setTransform(162,34,1,1,0,0,0,150,21);

	this.bg2.mask = mask_1;
	// bg
	this.instance_10 = new lib.loadingStartBtnBg1();
	this.instance_10.setTransform(162,34,1,1,0,0,0,150,21);

	this.instance_10.mask = mask_1;
	// レイヤー 6
	this.instance_11 = new lib.enterBtnBg();

	this.addChild(this.instance_11,this.instance_10,this.bg2,this.heart,this.text1,this.instance_9);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,312,67);

})(Assets = Assets||{}, images = images||{}, createjs = createjs||{});
var Assets, images, createjs;