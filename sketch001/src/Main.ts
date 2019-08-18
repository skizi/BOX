/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/createjs/createjs.d.ts" />
/// <reference path="../../../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../../../typings/tween.js.d.ts" />
/// <reference path="../../../typings/threejs/three.d_r68.ts" />
/// <reference path="../../../typings/spe/spe.d.ts" />
///<reference path="three/SceneManager.ts"/>
///<reference path="three/Particle/ParticleManager.ts"/>
///<reference path="dom/TextManager.ts"/>
//<reference path="physics/oimo/OimoManager.ts"/>
///<reference path="physics/ammo/AmmoManager.ts"/>
///<reference path="physics/cannon/CannonManager.ts"/>

var PhysicsManager;

class Main {

    private threeView: ThreeView;
    //private createJsView: CreateJsView;


    constructor() {

        this.setStageProperty();
        
        if (Detector.webgl && Worker) {
        //if(false){
            PixiManager.assetsLoad();
            this.setPhysicsManager();
            PhysicsManager.init(this.physicsInitComp.bind(this));
            AssetManager.init();

            //this.animate();
            Vars.setAnimateFunc(this.animate.bind(this));
            window.onresize = this.resize.bind(this);

        } else {
            $('#title .loading-container').fadeOut(500);
            $('#title p').html('この環境ではプレイできません。<br>WebGLとWebWorkerが必要です。<br><br>It cannot play in this environment.<br>WebGL and WebWorker are required. ');
        }
    }


    private setPhysicsManager(): void {
        
        switch (browser) {

            case 'ie':
                PhysicsManager = AmmoManager;
                break;

            case 'chrome':
                PhysicsManager = CannonManager;
                break;

            case 'safari':
                PhysicsManager = CannonManager;
                break;

            case 'firefox':
                PhysicsManager = AmmoManager;
                break;

            case 'opera':
                PhysicsManager = AmmoManager;
                break;

        }
    
    }


    private physicsInitComp(): void {

        Vars.init();

        this.pixiAssetLoadCompCheck();
    }


    private pixiAssetLoadCompCheck():void{

        if (!PixiManager.assetsLoadCompFlag) {
            setTimeout(function () {
                this.pixiAssetLoadCompCheck();
            }.bind(this), 500)
            return;
        }


        DomManager.init(this.qualitySelectComp.bind(this), PixiManager.init );

        SoundManager.init();

    }


    public qualitySelectComp(quality: string): void{
        
        Vars.quality = quality;

        this.assetLoadCheck();

    }

    private assetLoadCheck(): void {

        setTimeout(function () {
            if (AssetManager.loadCompFlag){
                this.assetLoadComp();
            } else {
                this.assetLoadCheck();
            }
        }.bind(this), 500);

    }

    private assetLoadComp(): void {

        //if(quality == 'low' && platform != 'pc') Vars.resolution = 2;

        this.threeView = new ThreeView();
        //this.createJsView = new CreateJsView();


        //mouse Event
        if (platform == 'pc') {
            document.onmousemove = this.mouseMoveHandler.bind(this);
            document.onmousedown = this.mouseDownHandler.bind(this);
            document.onmouseup = this.mouseUpHandler.bind(this);
            document.oncontextmenu = this.rightClickHandler.bind(this);
        } else {
            document.addEventListener('touchstart', this.touchStartHandler, false);
            document.addEventListener('touchmove', this.touchMoveHandler, false);
            document.addEventListener('touchend', this.touchEndHandler, false);
        }

        window.onkeydown = this.keyDown.bind(this);
        window.onkeyup = this.keyUp.bind(this);

        

        window.onbeforeunload = this.reload.bind(this);
        window.onblur = this.blur.bind(this);
        window.onfocus = this.focus.bind(this);

        //setTimeout(this.reload.bind(this), 6000);
        //SoundManager.setVolume(0);
    }


    private mouseMoveHandler(e) {

        Vars.mouseMove(e);
    }


    private mouseDownHandler(e): void {

        Vars.mouseDown();

    }


    private mouseUpHandler(e): void {

        Vars.mouseUp();

    }


    private rightClickHandler(e): void {

        e.preventDefault();

        Vars.rightClick();

    }


    private touchStartHandler(e): void {
        
        if (e.touches.length == 2) {
            Vars.rightClick(e);
        } else {
            Vars.mouseDown(e);
        }

    }


    private touchEndHandler(e): void {
        
        Vars.mouseUp();

    }


    private touchMoveHandler(e): void {

        e.preventDefault();

        Vars.mouseMove(e);

    }

    private keyDown( e ) {

        e.preventDefault();

        // left or a 
        if (e.keyCode === 37 || e.keyCode === 65) {
            Input.x = -1;
        }// up or w
        if (e.keyCode === 38 || e.keyCode === 87) {
            Input.z = 1;
        }
        // right or d
        if (e.keyCode === 39 || e.keyCode === 68) {
            Input.x = 1;
        }
        // down or s
        if (e.keyCode === 40 || e.keyCode === 83) {
            Input.z = -1;
        }
        //space key
        if (e.keyCode === 32) {
            Input.y = 1;
        }
        //shift key
        if (e.keyCode === 16) {
            Input.run = true;
        }
        //alt key
        if (e.keyCode === 18) {
            Input.alt = true;
        }
        //enter key
        if (e.keyCode === 13) {
            Vars.enterDown();
        }

    }


    private keyUp(e) {

        e.preventDefault()

        // left or a 
        if (e.keyCode === 37 || e.keyCode === 65) {
            Input.x = 0;
        }// up or w
        if (e.keyCode === 38 || e.keyCode === 87) {
            Input.z = 0;
        }
        // right or d
        if (e.keyCode === 39 || e.keyCode === 68) {
            Input.x = 0;
        }
        // down or s
        if (e.keyCode === 40 || e.keyCode === 83) {
            Input.z = 0;
        }
        //space key
        if (e.keyCode === 32) {
            Input.y = 0;
        }
        //shift key
        if (e.keyCode === 16) {
            Input.run = false;
        }
        //alt key
        if (e.keyCode === 18) {
            Input.alt = false;
        }

    }


    private animate() {

        //requestAnimationFrame(() => this.animate());

        TWEEN.update();

    }


    private resize() {

        this.setStageProperty();


        Vars.resize();
        
        //if ( this.createJsView ) this.createJsView.resize();
        //if ( this.pixiView ) this.pixiView.resize();

    }

    private setStageProperty() {

        Vars.stageWidth = window.innerWidth;
        Vars.stageHeight = window.innerHeight;
        Vars.windowHalfX = Vars.stageWidth / 2;
        Vars.windowHalfY = Vars.stageHeight / 2;

    }

    private reload(e) {
        var e = e || window.event;

        if (this.threeView) this.threeView.reload();

        //alert("memory cloer");
        //return 'memory clear';
    }


    private blur(): void {

        if (!Vars.inGameFlag) return;

        SoundManager.tweenVolume(0, 1000);
        Vars.renderFlag = false;
        MaterialManager.animateFlag = false;
        PhysicsManager.stop();
        PixiManager.stop();
        
    }


    private focus(): void {

        if (!Vars.inGameFlag) return;

        SoundManager.tweenVolume(1, 1000);
        Vars.renderFlag = true;
        MaterialManager.animateFlag = true;
        PhysicsManager.start();
        PixiManager.start();

    }

}




var ua = navigator.userAgent.toLowerCase();
var browser: string = 'ie';
if (ua.indexOf('chrome') != -1) {
    browser = 'chrome';
} else if (ua.indexOf('safari') != -1) {
    browser = 'safari';
} else if (ua.indexOf('firefox') != -1) {
    browser = 'firefox';
} else if (ua.indexOf('opera') != -1) {
    browser = 'opera';
}

ua = navigator.userAgent;
var twitterFlag: boolean = false;
if (ua.search(/Twitter/) != -1) twitterFlag = true;

var platform: string = 'pc';
if (ua.search(/iPhone/) != -1) {

    platform = "sp";
    document.write('<meta name="viewport" content="width=640,user-scalable=no,initial-scale=.5" />');
    
} else if ((ua.search(/Android/) != -1) && (ua.search(/Mobile/) != -1)) {

    platform = "sp";
    document.write('<meta name="viewport" content="width=640,user-scalable=no,initial-scale=.5" />');

} else if ((ua.search(/iPad/) != -1) || (ua.search(/Android/) != -1)) {

    platform = "ipad";
    document.write('<meta name="viewport" content="width=1040, user-scalable=no,initial-scale=.7" />');
    
}



window.onload = () => {
    var main = new Main();
};

$(window).ready(function () {
});