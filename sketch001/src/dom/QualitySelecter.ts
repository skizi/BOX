class QualitySelecter{

    private element: JQuery;
    private menuContainer: JQuery;
    private menu: JQuery;
    private lists: JQuery;
    private btns: JQuery;
    private qualitySelectFunc: Function;
    private selectName: string = 'middle';
    private nowOverTarget: number = -1;
    private bgPosObjs: Array<any> = [{}, {}, {}];
    private selectCompFlag: boolean = false;

    private fadeInCompFunc: Function;


    constructor(qualitySelectFunc: Function, _fadeinCompFunc:Function = null) {

        this.qualitySelectFunc = qualitySelectFunc;
        this.fadeInCompFunc = _fadeinCompFunc;

        this.element = $('#quality-selecter');
        this.element.css({ opacity: 0, display:'block' });
        this.element.animate({ opacity: 1 }, { duration: 1000 });
        $(document.body).append(this.element);


        //menuContainer
        this.menuContainer = $(this.element.find('.menu-container')[0]);
        this.menuContainer.addClass('scaleY0');
        setTimeout(function () {
            this.menuContainer.removeClass('scaleY0').addClass('fade-in2');
        }.bind(this), 800);

        //menu
        this.menu = $(this.element.find('.menu')[0]);
        if (platform == 'sp') {
            this.menu.css({
                width:'90%',
                margin:'0px 0px 0px 5%'
            });
        }

        //btns
        this.btns = this.menu.find('a');
        this.btns.on('mouseover', this.overHandler.bind(this));
        this.btns.on('mouseout', this.outHandler.bind(this));
        this.btns.on('click', this.clickHandler.bind(this));

        this.lists = this.menu.find('li');
        for (var i: number = 0; i < 3; i++) {
            this.bgPosObjs[i].posX = 0;
            this.bgPosObjs[i].posY = 0;
            $(this.lists[i]).css({ marginTop: '-100px', opacity: 0 });
            var obj: any = { duration: 200 };
            if (i == 2) obj = { duration: 200, complete: this.btnFadeInComp.bind(this) };
            $(this.lists[i]).stop().delay(300 * i + 1500).animate({ marginTop: '0px', opacity: 1 }, obj);
        }

        //animate
        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));


        //resize
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));


    }

    private btnFadeInComp():void{

        if (this.fadeInCompFunc) this.fadeInCompFunc();

    }


    private overHandler(e): void {

        switch (e.target.className) {

            case 'low':
                this.nowOverTarget = 0;
                break;

            case 'middle':
                this.nowOverTarget = 1;
                break;

            case 'high':
                this.nowOverTarget = 2;
                break;

        }

        SoundManager.play(3, false);
    }


    private outHandler(e): void {

        this.nowOverTarget = -1;

    }


    private clickHandler(e): void {

        if (this.selectCompFlag) return;
        this.selectCompFlag = true;

        this.selectName = e.target.className;

        $(this.lists[0]).stop().animate({ marginTop: '-100px', opacity: 0 }, { duration: 200});
        $(this.lists[1]).stop().delay(300).animate({ marginTop: '-100px', opacity: 0 }, { duration: 200 });
        $(this.lists[2]).stop().delay(600).animate({ marginTop: '-100px', opacity: 0 }, { duration: 200 });

        setTimeout(function () {
            this.menuContainer.removeClass('fade-in2').addClass('fade-out2');
        }.bind(this), 1000);

        this.element.delay(1600).fadeOut(1000, this.fadeOutComp.bind(this));

        SoundManager.play(2, false);
    }

    private fadeOutComp(): void {

        this.qualitySelectFunc(this.selectName);

    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (this.selectCompFlag) return;


        var index: number = this.nowOverTarget;
        if (index == -1) return;

        this.bgPosObjs[index].posX += Vars.fpsStep;
        this.bgPosObjs[index].posY += Vars.fpsStep;

        $(this.btns[index]).css({
            backgroundPositionX: this.bgPosObjs[index].posX,
            backgroundPositionY: this.bgPosObjs[index].posY
        });

    }


    private resize(): void {

        if (this.selectCompFlag) return;

        
        var w: number = window.innerWidth;
        var h: number = window.innerHeight;

        this.element.css({
            height: h + 'px'/*,
            backgroundPositionX: w * .5 - 200 + 'px',
            backgroundPositionY:h * .5 - 350 + 'px'*/
        });

        this.menuContainer.css({
            marginTop: (h - 456) * .5 + 'px'
        });
    }

} 