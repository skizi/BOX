class HitPointContainer {

    private element: JQuery;

    public visibleFlag: boolean = false;

    public hitPoint: number = 3;
    private maxLength: number = 3;
    private hitPointTxt: JQuery;
    private hearts: Array<JQuery> = [];

    private removeLastTime: number = 0;




    constructor() {

        //container
        this.element = $('#hit-point-container');


        //hitpoints
        this.hitPointTxt = $(this.element.find('img')[0]);
        this.hitPointTxt.css({ visibility:'hidden'});


        //hearts
        for (var i: number = 0; i < this.maxLength; i++) {
            var element = $(this.element.find('img')[i + 1]);
            element.css({ visibility: 'hidden' });
            this.hearts.push(element);
        }


    }


    public fadeIn(): void {

        this.visibleFlag = true;
        if (this.element.css('display') == 'none') this.element.css({display:'block'});

        //hitpoints
        if (this.hitPointTxt.css('visibility') != 'visible') {
            this.hitPointTxt.css({ visibility: 'visible' });
            this.hitPointTxt.addClass('fade-in0');
        }

        //hearts
        for (var i: number = 0; i < this.maxLength; i++) {
            this.hearts[i].removeClass();
            this.hearts[i].css({ visibility: 'hidden' });
            setTimeout(function () {
                arguments[0].css({ visibility: 'visible' });
                arguments[0].addClass('fade-in0');
            }.bind(this), (i + 1) * 500, this.hearts[i]);
        }
        
        setTimeout(function () {
            for (var i: number = 0; i < this.maxLength; i++) {
                var flag: boolean = this.heartActiveCheck(i);
                if (flag) this.hearts[i].removeClass();
                setTimeout(function () {
                    var i: number = arguments[0];
                    var flag: boolean = this.heartActiveCheck(i);
                    if(flag) this.hearts[i].addClass('heart-beat0');
                }.bind(this), i * 500, i);
            }
        }.bind(this), 2500);
    }


    private heartActiveCheck(i:number): boolean {

        var flag: boolean = true;
        if (i == 0) {
            if (this.hitPoint < 1) flag = false;
        } else if (i == 1) {
            if (this.hitPoint < 2) flag = false;
        } else if (i == 2) {
            if (this.hitPoint < 3) flag = false;
        }

        return flag;
    }


    public remove(): void {

        if (this.hitPoint == 0) return;

        if (Vars.elapsedTime - this.removeLastTime < .5) return;
        this.removeLastTime = Vars.elapsedTime;

        this.hitPoint--;
        this.hearts[this.hitPoint].removeClass();
        this.hearts[this.hitPoint].addClass('fade-out0');

        if (this.hitPoint == 0) {
            this.visibleFlag = false;
            StageManager.gameOver();
        }
    }


    public add(): void {

        if(this.hitPoint >= this.maxLength) return;

        this.hearts[this.hitPoint].removeClass();
        this.hearts[this.hitPoint].addClass('fade-in0');

        setTimeout(function () {
            var heart = arguments[0];
            heart.removeClass();
            heart.addClass('heart-beat0');
        }.bind(this), 1000, this.hearts[this.hitPoint]);
        this.hitPoint++;

    }


    public reset(): void {
        
        this.hitPoint = 3;

    }

}