class PauseCover extends PIXI.DisplayObjectContainer {

    private bg: PIXI.Graphics;
    private defaultWidth: number = 0;
    private defaultHeight: number = 0;
    public visibleFlag: boolean = false;

    private text: PauseText;


    constructor() {

        super();


        this.alpha = 0;


        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, Vars.stageWidth, Vars.stageHeight);
        this.bg.endFill();
        this.bg.alpha = .5;
        this.addChild(this.bg);

        this.defaultWidth = Vars.stageWidth;
        this.defaultHeight = Vars.stageHeight;


        this.text = new PauseText();
        this.text.visible = false;
        this.addChild(this.text);


        //resize
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));

    }


    public show(): void {

        if (!this.visibleFlag) {
            this.visibleFlag = true;
            this.visible = true;
            TweenManager.addTweenObj(this, { alpha: 1 }, 500, TWEEN.Easing.Linear.None);

            if(!Vars.gameOverFlag)this.text.show();
        }
    }


    public hide(): void {

        if (this.visibleFlag) {
            this.visibleFlag = false;
            if (!Vars.gameOverFlag)this.text.hide();
            TweenManager.addTweenObj(this, { alpha: 0 }, 200, TWEEN.Easing.Linear.None, 600, this.hideComp.bind(this));
        }
    }


    private hideComp(): void {

        this.visible = false;

    }


    private resize(): void {

        this.bg.scale.x = Vars.stageWidth / this.defaultWidth;
        this.bg.scale.y = Vars.stageHeight / this.defaultHeight;

        this.text.position.x = (Vars.stageWidth - 425) * .5;
        this.text.position.y = (Vars.stageHeight - 130) * .5;
    }

}