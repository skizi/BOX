/// <reference path="../scripts/typings/pixi/pixi.d.ts" />
/// <reference path="../scripts/typings/pixi/webgl.d.ts" />

class PixiView{

    private explosions = [];
    private count = 0;
    private stage = new PIXI.Stage( 0x000000 );
    private renderer:any;




    constructor() {
        alert(1);
        var assetsToLoader = ["assets/pixi/SpriteSheet.json"];
        var loader:PIXI.AssetLoader = new PIXI.AssetLoader( assetsToLoader );
        loader.onComplete = this.onAssetsLoaded.bind( this );
        loader.load();


        this.renderer = PIXI.autoDetectRenderer(800, 600, null, true, true );
        document.body.appendChild( this.renderer.view );

        this.resize();
    }



    onAssetsLoaded() {
        
        var explosionTextures = [];

        for (var i = 0; i < 26; i++) {
            var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i + 1) + ".png");
            explosionTextures.push(texture);
        };

        for (var i = 0; i < 50; i++) {

            var explosion = new PIXI.MovieClip(explosionTextures);

            explosion.position.x = Math.random() * 800;
            explosion.position.y = Math.random() * 600;
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;

            explosion.rotation = Math.random() * Math.PI;
            explosion.scale.x = explosion.scale.y = 0.75 + Math.random() * 0.5;

            explosion.gotoAndPlay(Math.random() * 27);

            this.stage.addChild(explosion);
        }


        this.animate();
    }


    animate() {

        this.renderer.render( this.stage );
        requestAnimationFrame(() => this.animate());

    }


    resize() {

        this.renderer.resize( Vars.stageWidth, Vars.stageHeight );
        //this.stage.width = Vars.stageWidth;
        //this.stage.height = Vars.stageHeight;

    }

}