class GameOverText {

    private element: JQuery;
    private width: number = 820;
    private height: number = 127;
    private texts: JQuery;
    private restartBtn: JQuery;
    private restartBtnOverFlag: boolean = false;
    private restartBtnClickFlag: boolean = false;
    private bgPosObj: any = {posX:0, posY:0};
    private template: string = 
        '<img src = "img/font/g.png" width = "95" class ="g" / >' +
        '<img src = "img/font/a.png" width = "95" class ="a" / >' +
        '<img src = "img/font/m.png" width = "117" class ="m" / >' +
        '<img src = "img/font/e.png" width = "62" class ="e" / >' +

        '<img src = "img/font/o.png" width = "107" class ="o" / >' +
        '<img src = "img/font/v.png" width = "92" class ="v" / >' +
        '<img src = "img/font/e.png" width = "62" class ="e2" / >' +
        '<img src = "img/font/r.png" width = "70" class ="r" / >' +
        '<a href="javascript:void(0);">restart!</a>';


    constructor() {

        var textWidth: number = 150;

        this.element = $('<div>');
        this.element.attr({
            id: 'game-over-text',
            class: 'clearfix'
        });
        this.element.append(this.template);
        $(document.body).append(this.element);

        this.texts = this.element.find('img');
        this.texts.css({ visibility: 'hidden' });

        this.restartBtn = $(this.element.find('a')[0]);
        this.restartBtn.on('mouseover', this.restartBtnOverHandler.bind(this));
        this.restartBtn.on('mouseout', this.restartBtnOutHandler.bind(this));
        this.restartBtn.on('click', this.restartBtnClickHandler.bind(this));
        this.restartBtn.css({visibility:'hidden'});


        this.animate();

        //resize
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));

        this.hide();
    }

    
    //-------------------------mouse event-------------------------
    private restartBtnOverHandler(): void {
        
        SoundManager.play(3, false);
        this.restartBtnOverFlag = true;

    }


    private restartBtnOutHandler(): void {

        this.restartBtnOverFlag = false;

    }


    private restartBtnClickHandler(): void {

        if (this.restartBtnClickFlag) return;
        this.restartBtnClickFlag = true;

        StageManager.restart();

        SoundManager.play(2, false);
    }

    
    //-------------------------public-------------------------
    public show(): void {

        this.element.css({ display: 'block' });

        var length: number = this.texts.length;
        for (var i: number = 0; i < length; i++) {
            $(this.texts[i]).css({ visibility: 'visible', opactiy: '0' });
            $(this.texts[i]).stop().delay(i * 100).animate({ opacity: '1' }, {duration:500});
        }

        this.restartBtnClickFlag = false;
        this.restartBtn.css({ visibility: 'visible', opactiy: '0', top:'200px' });
        this.restartBtn.stop().delay(1000).animate({ opacity: '1', top:'180px' }, { duration: 500 });

    }


    private hideCallBack: Function;
    public hide(callBack:Function = null): void {
        this.hideCallBack = callBack;

        var length: number = this.texts.length;
        for (var i: number = 0; i < length; i++) {
            $(this.texts[i]).stop().delay(i * 100).animate({ opacity: '0' }, { duration: 500 });
        }

        this.restartBtn.stop().delay(1000).animate({ opacity: '0', top: '200px' }, { duration: 500, complete: this.hideComp.bind(this) });

    }

    private hideComp():void{

        this.restartBtnClickFlag = false;

        this.element.css({ display: 'none' });
        if (this.hideCallBack) this.hideCallBack();

    }

    
    //-------------------------animate-------------------------
    private animate(): void {

        requestAnimationFrame(() => this.animate());

        if (!this.restartBtnOverFlag) return;

        this.bgPosObj.posX++;
        this.bgPosObj.posY++;

        this.restartBtn.css({
            backgroundPositionX: this.bgPosObj.posX,
            backgroundPositionY: this.bgPosObj.posY
        });

    }


    private resize(): void {

        var x: number = (Vars.stageWidth - this.width) * .5;
        var y: number = (Vars.stageHeight - this.height) * .5;
        this.element.css({ left: x + 'px', top: y + 'px'});

    }

}