module DomManager{

    export var debug: JQuery;
    export var title: JQuery;
    var titleClickFlag: boolean = false;
    var titleBgPos: any = { x: 0, y: 0 };
    var titleOverFlag: boolean = false;
    //export var gameOverText: GameOverText;
    export var restartBtn: RestartBtn;
    export var qualitySelecter: QualitySelecter;
    var qualitySelectFunc: Function;
    var qualitySelectFadeInComp: Function;
    //export var eyeCatch: EyeCatch;
    export var textView: TextView;
    export var mouseNavi: MouseNavi;
    export var hitPointContainer: HitPointContainer;


    export function init(callBack: Function, _qualitySelectFadeInCompFunc:Function): void {

        qualitySelectFunc = callBack;
        qualitySelectFadeInComp = _qualitySelectFadeInCompFunc;

        debug = $('#debug');
        debug.css({ cursor: 'pointer' });
        debug.click(debugClickHandler);

        title = $('#title');
        title.find('.loading-container .img').css({ backgroundImage: 'url(img/clickortouch.gif)' });
        title.find('.loading-container .img').addClass('blink-animation');
        var y: number = (Vars.stageHeight - 370) * .5;
        title.css({top:y+ 'px'});
        setTimeout(titleInitComp.bind(this), 500);
        

        //animate();
        Vars.setAnimateFunc(animate.bind(this));
    }

    function titleInitComp():void{

        title.removeClass('easing0');
        title.on('mouseenter', titleOverHandler.bind(this));
        title.on('mouseleave', titleOutHandler.bind(this));
        title.on('click', titleClickHandler.bind(this));

        //resize
        $(window).on('resize', resize.bind(this) );
    }


    function titleOverHandler(e): void {

        titleOverFlag = true;
        SoundManager.play(3, false);

    }


    function titleOutHandler(e): void {

        titleOverFlag = false;

    }


    function titleClickHandler(): void {

        if (titleClickFlag) return;
        titleClickFlag = true;
        titleOverFlag = false;
        SoundManager.play(2, false);
        title.off('mouseover', titleOverHandler);
        title.off('click', titleClickHandler);
        var y: number = (Vars.stageHeight - 370) * .5;
        title.animate({ opacity: 0, top:y - 60 + 'px' }, { duration: 300, complete: titleComp.bind(this) });

        $('#footer').fadeOut(500);

        $(window).off('resize', resize.bind(this));
    }


    function titleComp(): void{

        title.remove();

        //gameOverText = new GameOverText;

        restartBtn = new RestartBtn();

        TextManager.init();

        qualitySelecter = new QualitySelecter(qualitySelectFunc, qualitySelectFadeInComp);

        //eyeCatch = new EyeCatch();


        mouseNavi = new MouseNavi();

        hitPointContainer = new HitPointContainer();

        $(document.body).append(debug);
    }



    function debugClickHandler(): void {

        hitPointContainer.add();
        //TextManager.setText('TESTTESTTESTTEST' + Vars.elapsedTime);

    }


    function resize(): void {

        if (titleClickFlag) return;

        var y: number = (Vars.stageHeight - 370) * .5;
        title.css({ top: y + 'px' });
    }


    function animate(): void {

        //requestAnimationFrame(() => animate());

        if (!titleOverFlag) return;

        titleBgPos.x += Vars.fpsStep
        titleBgPos.y += Vars.fpsStep;

        title.css({
            backgroundPositionX: titleBgPos.x,
            backgroundPositionY: titleBgPos.y
        });

    }

} 