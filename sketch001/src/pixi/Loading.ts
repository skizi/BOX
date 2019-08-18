class Loading extends PIXI.DisplayObjectContainer {

    private bg: PIXI.Graphics;
    private bgDefaultWidth: number = Vars.stageWidth;
    private bgDefaultHeight: number = Vars.stageHeight;
    private circle: PIXI.MovieClip;
    

    constructor() {

        super();

        this.alpha = 1;

        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, Vars.stageWidth, Vars.stageHeight);
        this.bg.endFill();
        this.addChild(this.bg);
        

        
        
        var spriteSheet:Array<PIXI.Texture> = [];

        for (var i = 0; i < 24; i+=Vars.fpsStep) {
            var texture: PIXI.Texture = PIXI.Texture.fromFrame("loading1" + i);
            spriteSheet.push(texture);
        };

        this.circle = new PIXI.MovieClip(spriteSheet);
        this.circle.position.x = Vars.stageWidth * .5 - 12;
        this.circle.position.y = Vars.stageHeight * .5 - 12;
        this.circle.play();
        this.addChild(this.circle);
        
        //resize
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
        
    }

    public hide(easingFlag:boolean = false): void {

        if (easingFlag) {
            TweenManager.addTweenObj(this, { alpha: 0 }, 1000, TWEEN.Easing.Linear.None, 0, this.hideComp.bind(this));
        } else {
            this.visible = false;
        }
    }

    private hideComp(): void {

        this.visible = false;

    }


    private resize(): void {

        if (!this.visible) return;

        this.circle.position.x = Vars.stageWidth * .5 - 12;
        this.circle.position.y = Vars.stageHeight * .5 - 12;

        this.bg.scale.x = Vars.stageWidth / this.bgDefaultWidth;
        this.bg.scale.y = Vars.stageHeight / this.bgDefaultHeight;

    }


}