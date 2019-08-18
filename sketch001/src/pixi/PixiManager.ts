/// <reference path="../../../../typings/pixi/pixi.d.ts" />
/// <reference path="../../../../typings/pixi/webgl.d.ts" />

module PixiManager{

    var stage = new PIXI.Stage( 0x000000 );
    var renderer: PIXI.WebGLRenderer;

    export var assetsLoadCompFlag: boolean = false;

    export var loading: Loading;
    export var eyeCatch: EyeCatch;
    export var time: Time;
    export var pauseCover: PauseCover;
    export var pixiParticle2: PixiParticle2;
    export var gameOverText: GameOverText;
    export var stageClearText: StageClearText;
    export var stageStartText: StageStartText;


    export function assetsLoad():void {

        PixiAssetManager.init(assetsLoadComp.bind(this));

    }

    function assetsLoadComp(): void {

        assetsLoadCompFlag = true;

    }


    export function init(): void{

        if (!assetsLoadCompFlag) {
            setTimeout(init.bind(this), 1000);
            return;
        }

        renderer = <PIXI.WebGLRenderer>PIXI.autoDetectRenderer(800, 600, null, true, true);
        $('#container').after(renderer.view);



        time = new Time();
        time.position.x = Vars.stageWidth * .5;
        time.position.y = 20;
        if (platform != 'pc') time.position.y = 10;
        time.visible = false;
        stage.addChild(time);

        pauseCover = new PauseCover();
        pauseCover.visible = false;
        stage.addChild(pauseCover);

        pixiParticle2 = new PixiParticle2();
        stage.addChild(pixiParticle2);

        gameOverText = new GameOverText();
        gameOverText.visible = false;
        stage.addChild(gameOverText);

        stageClearText = new StageClearText();
        stageClearText.visible = false;
        stage.addChild(stageClearText);

        stageStartText = new StageStartText();
        stageStartText.visible = false;
        stage.addChild(stageStartText);

        loading = new Loading();
        stage.addChild(loading);
    
        eyeCatch = new EyeCatch();
        stage.addChild(eyeCatch);
        eyeCatch.visible = false;


        //animate();
        Vars.setAnimateFunc(animate.bind(this));

        //resize
        resize();
        Vars.pushResizeFunc(resize.bind(this));
    }



    function animate() {
    
        //requestAnimationFrame(() => animate());
        
        renderer.render(stage);
        
    }


    function resize() {

        //if (!eyeCatch.visible && !loading.visible) return;

        time.position.x = (Vars.stageWidth - 62) * .5;
        if (platform != 'pc' &&
            Vars.stageWidth < Vars.stageHeight) {
            time.position.x = Vars.stageWidth - 100;
        }

        gameOverText.position.x = (Vars.stageWidth - 840) * .5
        gameOverText.position.y = (Vars.stageHeight - 130) * .5

        stageClearText.position.x = (Vars.stageWidth - 792) * .5
        stageClearText.position.y = (Vars.stageHeight - 280) * .5

        stageStartText.position.x = (Vars.stageWidth - 792) * .5
        stageStartText.position.y = (Vars.stageHeight - 280) * .5

        renderer.resize( Vars.stageWidth, Vars.stageHeight );

    }


    export function stop(): void {

        pauseCover.show();
        time.stop();

    }


    export function start(): void {

        pauseCover.hide();
        time.start();

    }

}