class PauseText extends PIXI.SpriteBatch {

    private texts: Array<PIXI.Sprite> = [];

    private hideCallBack: Function;



    constructor() {

        super();


        var spriteSheet: Array<PIXI.Texture> = [];

        
        var pTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 5);
        var p: PIXI.Sprite = new PIXI.Sprite(pTexture);
        p.width *= .5;
        p.height *= .5;
        this.texts.push(p);
        this.addChild(p);

        var aTexture: PIXI.Texture = PIXI.Texture.fromImage('font1' + 0);
        var a: PIXI.Sprite = new PIXI.Sprite(aTexture);
        a.position.x = 60;
        a.width *= .5;
        a.height *= .5;
        this.texts.push(a);
        this.addChild(a);

        var uTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 8);
        var u: PIXI.Sprite = new PIXI.Sprite(uTexture);
        u.position.x = 170;
        u.width *= .5;
        u.height *= .5;
        this.texts.push(u);
        this.addChild(u);

        var sTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 7);
        var s: PIXI.Sprite = new PIXI.Sprite(sTexture);
        s.position.x = 270;
        s.width *= .5;
        s.height *= .5;
        this.texts.push(s);
        this.addChild(s);

        var eTexture: PIXI.Texture = PIXI.Texture.fromFrame('font1' + 1);
        var e: PIXI.Sprite = new PIXI.Sprite(eTexture);
        e.position.x = 370;
        e.width *= .5;
        e.height *= .5;
        this.texts.push(e);
        this.addChild(e);

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

        if (this.hideCallBack) setTimeout(this.hideCallBack.bind(this), 900);
    }

    private hideComp(): void {

        this.visible = false;
        if (this.hideCallBack) this.hideCallBack();

    }

}