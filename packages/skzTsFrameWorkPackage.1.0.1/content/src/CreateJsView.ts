/// <reference path="../Scripts/typings/createjs/createjs.d.ts" />
/// <reference path="../Scripts/typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../Scripts/typings/easeljs/easeljs.d.ts" />
/// <reference path="../Scripts/typings/soundjs/soundjs.d.ts" />
/// <reference path="../Scripts/typings/CreateJsAsset.d.ts" />


//imagesとAssetsはAssetsMain.jsの中の変数



class CreateJsView {

    private AssetsMainRoot;
    private cj;
    private canvas:HTMLCanvasElement;
    private stage;
    private mc;


    constructor() {

        this.imgLoad();

    }



    imgLoad() {

        this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
        images = images || {};

        var manifest = [
            { src: "assets/images/enterBtnArrow.png", id: "enterBtnArrow" },
            { src: "assets/images/enterBtnBg.png", id: "enterBtnBg" },
            { src: "assets/images/enterBtnBg_1.png", id: "enterBtnBg_1" },
            { src: "assets/images/enterBtnBg_1_1.png", id: "enterBtnBg_1_1" },
            { src: "assets/images/enterBtnText.png", id: "enterBtnText" }
        ];

        var loader = new createjs.LoadQueue(false);
        loader.addEventListener("fileload", this.imgFileLoad.bind(this) );
        loader.addEventListener("complete", this.imgFileLoadComplete.bind(this) );
        loader.loadManifest(manifest);
    }


    imgFileLoad(evt) {

        if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    }

    imgFileLoadComplete() {

        this.domInitHandler();
        this.propertyInitHandler();


        //this.cj.Ticker.setFPS(60);
        //this.cj.Ticker.addListener(window);
        //setInterval(this.animate.bind( this ), 1000 / 30);
        this.animate();

    }


    //-----------------------------------dom init-----------------------------------
    domInitHandler() {

        var container: HTMLElement = document.getElementById("container");

        this.canvas = document.createElement("canvas");
        this.canvas.width = Vars.stageWidth;
        this.canvas.height = Vars.stageHeight;
        container.appendChild( this.canvas );

    }


    //-----------------------------------property init-----------------------------------
    propertyInitHandler() {

        this.cj = createjs;
        this.stage = new this.cj.Stage( this.canvas );
        this.stage.enableMouseOver(24);
        
        //add FlashAsset
        this.AssetsMainRoot = new Assets.AssetsMain();

        this.mc = new Assets.Btn();
        this.mc.onMouseOver = this.btnOverHandler;
        this.mc.onMouseOut = this.btnOutHandler;
        this.mc.cursor = "pointer";
        this.mc.speedX = 5 * Math.random();
        this.mc.speedY = 5 * Math.random();
        this.stage.addChild( this.mc );
        
		
	}


    btnOverHandler() {

    }


    btnOutHandler() {

    }


    //-----------------------------------enterFrame-----------------------------------
    animate() {
        
        
        this.mc.x = this.mc.x + this.mc.speedX;
        this.mc.y = this.mc.y + this.mc.speedY;
        if (this.mc.x > Vars.stageWidth || this.mc.x < 0) {
            this.mc.speedX = -1 * this.mc.speedX;
        }
        if (this.mc.y > Vars.stageHeight || this.mc.y < 0) {
            this.mc.speedY = -1 * this.mc.speedY;
        }
       

        this.stage.update();

        requestAnimationFrame(() => this.animate());
    }

    resize() {

        this.canvas.width = Vars.stageWidth;
        this.canvas.height = Vars.stageHeight;

    }

}