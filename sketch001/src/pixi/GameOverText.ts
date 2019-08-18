class GameOverText extends PIXI.SpriteBatch {

    private texts: Array<PIXI.Sprite> = [];

    private hideCallBack: Function;



    constructor() {

        super();


        var gTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 2);
        this.texts[0] = new PIXI.Sprite(gTexture);
        this.texts[0].width *= .5;
        this.texts[0].height *= .5;
        this.addChild(this.texts[0]);
        
        var aTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 0);
        this.texts[1] = new PIXI.Sprite(aTexture);
        this.texts[1].position.x = 109;
        this.texts[1].width *= .5;
        this.texts[1].height *= .5;
        this.addChild(this.texts[1]);
        
        var mTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 3);
        this.texts[2] = new PIXI.Sprite(mTexture);
        this.texts[2].position.x = 217;
        this.texts[2].width *= .5;
        this.texts[2].height *= .5;
        this.addChild(this.texts[2]);

        var eTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 1);
        this.texts[3] = new PIXI.Sprite(eTexture);
        this.texts[3].position.x = 357;
        this.texts[3].width *= .5;
        this.texts[3].height *= .5;
        this.addChild(this.texts[3]);


        var oTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 4);
        this.texts[4] = new PIXI.Sprite(oTexture);
        this.texts[4].position.x = 470;
        this.texts[4].width *= .5;
        this.texts[4].height *= .5;
        this.addChild(this.texts[4]);

        var vTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 9);
        this.texts[5] = new PIXI.Sprite(vTexture);
        this.texts[5].position.x = 582;
        this.texts[5].width *= .5;
        this.texts[5].height *= .5;
        this.addChild(this.texts[5]);

        var eTexture2: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 1);
        this.texts[6] = new PIXI.Sprite(eTexture2);
        this.texts[6].position.x = 695;
        this.texts[6].width *= .5;
        this.texts[6].height *= .5;
        this.addChild(this.texts[6]);

        var rTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 6);
        this.texts[7] = new PIXI.Sprite(rTexture);
        this.texts[7].position.x = 773;
        this.texts[7].width *= .5;
        this.texts[7].height *= .5;
        this.addChild(this.texts[7]);
        
    }


    //-------------------------public-------------------------
    public show(): void {
        
        this.visible = true;

        var length: number = this.texts.length;
        for (var i: number = 0; i < length; i++) {
            this.texts[i].alpha = 0;
            TweenManager.addTweenObj(this.texts[i], { alpha: 1 }, 500, TWEEN.Easing.Linear.None, i * 100);
        }

    }


    public hide(callBack: Function = null): void {
        this.hideCallBack = callBack;
        
        var length: number = this.texts.length;
        for (var i: number = 0; i < length; i++) {
            TweenManager.addTweenObj(this.texts[i], { alpha: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
        }

        setTimeout(this.hideComp.bind(this), 900);
    }

    private hideComp(): void {

        this.visible = false;
        if (this.hideCallBack) this.hideCallBack();

    }



}