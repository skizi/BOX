class RestartBtn {

    private element: JQuery;
    private pluseY: number = 130;
    private restartBtnOverFlag: boolean = false;
    private restartBtnClickFlag: boolean = false;
    private bgPosObj: any = {posX:0, posY:0};
    private template: string = '<a href="javascript:void(0);" id="restart-btn">restart!</a>';


    constructor() {

        this.element = $('<a>');
        this.element.html('restart!');
        this.element.attr({ href: "javascript:void(0);", id: 'restart-btn' });
        this.element.on('mouseover', this.overHandler.bind(this));
        this.element.on('mouseout', this.outHandler.bind(this));
        this.element.on('click', this.clickHandler.bind(this));
        this.element.css({ visibility: 'hidden' });
        $(document.body).append(this.element);


        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));

        //resize
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));

        this.hide();
    }

    
    //-------------------------mouse event-------------------------
    private overHandler(): void {
        
        SoundManager.play(3, false);
        this.restartBtnOverFlag = true;

    }


    private outHandler(): void {

        this.restartBtnOverFlag = false;

    }


    private clickHandler(): void {

        if (this.restartBtnClickFlag) return;
        this.restartBtnClickFlag = true;

        this.hide();

        StageManager.restart();

        SoundManager.play(2, false);
    }

    
    //-------------------------public-------------------------
    public show(): void {

        this.element.css({ display: 'block' });

        this.restartBtnClickFlag = false;
        var y: number = (Vars.stageHeight - this.element.height()) * .5 + this.pluseY;
        this.element.css({ visibility: 'visible', opactiy: '0', top:y - 20 +'px' });
        this.element.stop().delay(1000).animate({ opacity: '1', top:y + 'px' }, { duration: 200 });

    }


    private hideCallBack: Function;
    public hide(callBack:Function = null): void {
        this.hideCallBack = callBack;

        var y: number = (Vars.stageHeight - this.element.height()) * .5 + this.pluseY;
        this.element.stop().delay(1000).animate({ opacity: '0', top: y - 20 + 'px' }, { duration: 200, complete: this.hideComp.bind(this) });

    }

    private hideComp():void{

        this.restartBtnClickFlag = false;

        this.element.css({ display: 'none' });
        if (this.hideCallBack) this.hideCallBack();

    }

    
    //-------------------------animate-------------------------
    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!this.restartBtnOverFlag) return;

        this.bgPosObj.posX++;
        this.bgPosObj.posY++;
        this.element.css({
            backgroundPositionX: this.bgPosObj.posX,
            backgroundPositionY: this.bgPosObj.posY
        });

    }


    private resize(): void {

        var x: number = (Vars.stageWidth - this.element.width()) * .5;
        var y: number = (Vars.stageHeight - this.element.height()) * .5 + this.pluseY;
        this.element.css({ left: x + 'px', top: y + 'px'});

    }

}