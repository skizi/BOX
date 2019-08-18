class StageClearText extends PIXI.SpriteBatch {

    private texts: Array<PIXI.Sprite> = [];

    private hideCallBack: Function;



    constructor() {

        super();

        
        var sTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 0);
        var s: PIXI.Sprite = new PIXI.Sprite(sTexture);
        //s.width *= .5;
        //s.height *= .5;
        this.texts.push(s);
        this.addChild(s);

        var tTexture: PIXI.Texture = PIXI.Texture.fromImage('font2' + 1);
        var t: PIXI.Sprite = new PIXI.Sprite(tTexture);
        t.position.x = 70;
        //t.width *= .5;
        //t.height *= .5;
        this.texts.push(t);
        this.addChild(t);

        var aTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 2);
        var a: PIXI.Sprite = new PIXI.Sprite(aTexture);
        a.position.x = 137;
        //a.width *= .5;
        //a.height *= .5;
        this.texts.push(a);
        this.addChild(a);

        var gTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 3);
        var g: PIXI.Sprite = new PIXI.Sprite(gTexture);
        g.position.x = 213;
        //g.width *= .5;
        //g.height *= .5;
        this.texts.push(g);
        this.addChild(g);

        var eTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 4);
        var e: PIXI.Sprite = new PIXI.Sprite(eTexture);
        e.position.x = 289;
        //e.width *= .5;
        //e.height *= .5;
        this.texts.push(e);
        this.addChild(e);




        var cTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 5);
        var c: PIXI.Sprite = new PIXI.Sprite(cTexture);
        c.position.x = 408;
        //c.width *= .5;
        //c.height *= .5;
        this.texts.push(c);
        this.addChild(c);

        var lTexture: PIXI.Texture = PIXI.Texture.fromImage('font2' + 6);
        var l: PIXI.Sprite = new PIXI.Sprite(lTexture);
        l.position.x = 477;
        //l.width *= .5;
        //l.height *= .5;
        this.texts.push(l);
        this.addChild(l);

        var e: PIXI.Sprite = new PIXI.Sprite(eTexture);
        e.position.x = 546;
        //e.width *= .5;
        //e.height *= .5;
        this.texts.push(e);
        this.addChild(e);

        var a: PIXI.Sprite = new PIXI.Sprite(aTexture);
        a.position.x = 619;
        //a.width *= .5;
        //a.height *= .5;
        this.texts.push(a);
        this.addChild(a);

        var rTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 7);
        var r: PIXI.Sprite = new PIXI.Sprite(rTexture);
        r.position.x = 696;
        //r.width *= .5;
        //r.height *= .5;
        this.texts.push(r);
        this.addChild(r);

        var bikkuriTexture: PIXI.Texture = PIXI.Texture.fromFrame('font2' + 8);
        var bikkuri: PIXI.Sprite = new PIXI.Sprite(bikkuriTexture);
        bikkuri.position.x = 770;
        //bikkuri.width *= .5;
        //bikkuri.height *= .5;
        this.texts.push(bikkuri);
        this.addChild(bikkuri);
    }


    //-------------------------public-------------------------
    public show(): void {

        this.visible = true;

        var length: number = this.texts.length;
        for (var i: number = 0; i < length; i++) {
            this.texts[i].alpha = 0;
            this.texts[i].y = -Vars.stageHeight * .5;
            TweenManager.addTweenObj(this.texts[i], { alpha: 1 }, 200, TWEEN.Easing.Back.Out, i * 50);
            TweenManager.addTweenObj(this.texts[i].position, { y: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
        }

    }


    public hide(callBack: Function = null): void {
        this.hideCallBack = callBack;

        var length: number = this.texts.length;
        for (var i: number = 0; i < length; i++) {
            TweenManager.addTweenObj(this.texts[i], { alpha: 0 }, 200, TWEEN.Easing.Linear.None, i * 50);
            TweenManager.addTweenObj(this.texts[i].position, { y: Vars.stageHeight * 5 }, 600, TWEEN.Easing.Linear.None, i * 50);
        }

        if (this.hideCallBack) setTimeout(this.hideCallBack.bind(this), 900);
    }

    private hideComp(): void {

        this.visible = false;
        if (this.hideCallBack) this.hideCallBack();

    }

}