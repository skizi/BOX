class Time extends PIXI.DisplayObjectContainer {

    private text: PIXI.Text;
    private bg: PIXI.Sprite;
    private time: number = 99;

    public pauseFlag: boolean = false;



    constructor() {

        super();

        var bgTexture: PIXI.Texture = PIXI.Texture.fromFrame('timeBg10');
        this.bg = new PIXI.Sprite(bgTexture);
        this.bg.position.x = -6;
        this.bg.position.y = 60;
        if (platform != 'pc') this.bg.position.y = 70;
        this.bg.width = 76;
        this.bg.height = 7;
        this.addChild(this.bg);

        this.text = new PIXI.Text('99', {
            font: '70px arbonnie',
            fill: '#ffffff'
        });
        this.addChild(this.text);



        setInterval(this.timer.bind(this), 1000);
        this.stop();
    }


    public start(resetFlag:boolean = false): void {

        if (resetFlag) {
            this.time = 99;
            this.text.setText(99 + '');
        }
        this.pauseFlag = false;

    }


    public stop(): void {

        this.pauseFlag = true;

    }


    public pause(): void {

        if (this.pauseFlag) {
            this.pauseFlag = false;
        } else {
            this.pauseFlag = true;
        }

    }


    private timer() {

        if (this.pauseFlag || this.time == 0) return;

        this.time--;
        if (this.time < 1) {
            this.time = 0;
            this.pauseFlag = true;

            StageManager.gameOver();
        }

        var str: string = this.time + '';
        if (this.time < 10) str = '0' + this.time;

        this.text.setText(str);

    }

}