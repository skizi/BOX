class EyeCatch extends PIXI.DisplayObjectContainer {

    private bg: PIXI.Sprite;
    private titleBg: PIXI.DisplayObjectContainer;
    private tileContainerDefaultWidth: number = Vars.stageWidth;
    private title: PIXI.Text;

    public callBack: Function;




    constructor() {

        super();

        var bgTexture: PIXI.Texture = PIXI.Texture.fromFrame('bg10');
        this.bg = new PIXI.Sprite(bgTexture);
        this.bg.width = Vars.stageWidth;
        this.bg.height = Vars.stageHeight;
        this.addChild(this.bg);

        this.titleBg = new PIXI.DisplayObjectContainer();
        this.titleBg.position.x = Vars.stageWidth * .5;
        this.titleBg.position.y = Vars.stageHeight * .5;
        this.titleBg.scale.y = 0;
        this.addChild(this.titleBg);

        var graphics = new PIXI.Graphics();
        graphics.position.x = -Vars.stageWidth * .5;
        graphics.position.y = -150;
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, Vars.stageWidth, 300);
        graphics.lineStyle(5, 0xfb7e73, 1);
        graphics.moveTo(0, 0);
        graphics.lineTo(Vars.stageWidth, 0);
        graphics.moveTo(0, 300);
        graphics.lineTo(Vars.stageWidth, 300);
        graphics.endFill();
        this.titleBg.addChild(graphics);


        this.title = new PIXI.Text('stage2', {
            font: '50px arista',
            fill: '#fc9188'
        });
        this.title.alpha = 0;
        this.addChild(this.title);



        //resize
        this.resize();
        Vars.pushResizeFunc( this.resize.bind(this) );

    }



    public show(stageNo:number): void {
        
        this.visible = true;
        this.bg.alpha = 0;
        TweenManager.addTweenObj(this.bg, { alpha: 1 }, 1000, TWEEN.Easing.Linear.None, 0, this.showComp.bind(this) );

        TweenManager.addTweenObj(this.titleBg.scale, { y: 1 }, 200, TWEEN.Easing.Linear.None, 800);

        this.title.setText('stage ' + stageNo);
        this.title.alpha = 0;
        TweenManager.addTweenObj(this.title, { alpha: 1 }, 200, TWEEN.Easing.Linear.None, 800);
    }

    private showComp(): void {

        setTimeout(function () {
            this.callBack('showComp');
        }.bind(this), 200);
        
    }


    public hide(): void{

        TweenManager.addTweenObj(this.titleBg.scale, { y: 0 }, 200, TWEEN.Easing.Linear.None);
        TweenManager.addTweenObj(this.title, { alpha: 0 }, 200, TWEEN.Easing.Linear.None);
        TweenManager.addTweenObj(this.bg, { alpha: 0 }, 1000, TWEEN.Easing.Linear.None, 500, this.hideComp.bind(this));

    }

    private hideComp(): void {

        this.visible = false;
        this.callBack('hideComp');

    }



    private resize(): void {

        var w: number = Vars.stageWidth;
        var h: number = Vars.stageHeight;

        this.bg.width = w;
        this.bg.height = h;

        this.titleBg.position.x = w * .5;
        this.titleBg.position.y = h * .5;
        this.titleBg.scale.x = w / this.tileContainerDefaultWidth;

        this.title.position.x = ( w - this.title.width ) * .5;
        this.title.position.y = ( h - this.title.height) * .5;

    }



} 