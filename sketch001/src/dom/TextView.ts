class TextView{


    private textView: HTMLElement;
    private TF:HTMLParagraphElement;
	private textAreaViewFlag: boolean = false;
	private textAreaStr: string = "";
	private nowTextAreaStr: string = "";
	private textAreaStrArray: Array<string> = [];
	private textAnimationCompFlag: Boolean = false;
	private textAnimeTimer: number = 0;
	private TEXT_ANIME_INTERVAL: number = .05;
	private kaigyoTiming: number = 21;

    private template: string = '<p></p>';

    private defaultY: number = Vars.stageHeight - 164;

    private visibleFlag: boolean = false;



	constructor(){

        this.textView = document.createElement('div');
        this.textView.className = 'text-view back';
        this.textView.innerHTML = this.template;
        this.textView.onclick = this.nextText.bind(this);
        document.body.appendChild(this.textView);

        this.TF = this.textView.getElementsByTagName('p')[0];

        var targetY: number = this.defaultY;
        $(this.textView).css({ top: targetY - 45 + 'px', opacity: 0 });

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));


        if (platform != 'pc') this.defaultY = Vars.stageHeight - 200;


        //resize
        this.resize();
        Vars.pushResizeFunc(this.resize.bind(this));
    }


	public animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!this.visibleFlag) return;

        this.textAnimeTimer -= Vars.delta;
        if (this.textAnimeTimer <= 0) {
            if (this.textAreaStrArray.length > 0) this.textWrite();
            this.textAnimeTimer = this.TEXT_ANIME_INTERVAL;
        }
			
	}


	private textWrite(): void{

        if (!this.textAnimationCompFlag) {
            var index: number = this.textAreaStr.length;
            var str: String = this.textAreaStrArray[0];
            if (index < str.length) {
                this.textAreaStr += str.substr(index, 1);
                this.TF.innerHTML = this.textAreaStr;
            }
            if (index >= str.length) {
                this.textAnimationCompFlag = true;
                //console.log("textAnimationComp");
            }

        }
			
	}


    public setText(str: string, autoFadeOutFlag:boolean): void{

        if (!this.textAreaViewFlag) {
            this.textAreaShow();
            this.textAnimationCompFlag = false;
        }

        this.textAreaStrArray.push(str);


        if (autoFadeOutFlag) {
            setTimeout(function () {
                this.refresh();
            }.bind(this), 3000);
        }
	}


    public nextText(): void{

        if (this.textAreaStrArray.length <= 0) return;


        if (this.textAnimationCompFlag) {
            this.textAreaStr = '';
            this.textAreaStrArray.shift();
            if (this.textAreaStrArray.length == 0) {
                this.textAreaHide();
            } else {
                this.textAnimationCompFlag = false;
            }
        } else {
            this.textAnimationCompFlag = true;
            this.textAreaStr = this.textAreaStrArray[0];
        }
        this.TF.innerHTML = this.textAreaStr;
			
    }


    public refresh(): void {

        this.textAreaStr = '';
        this.textAreaStrArray = [];
        this.textAreaHide();
        this.textAnimationCompFlag = true;

    }


	private textAreaShow(): void{

        this.textAreaViewFlag = true;
        this.textView.style.display = 'block'
        this.textView.className = 'text-view';
        var targetY: number = this.defaultY;
        $(this.textView).css({ top: targetY - 40 + 'px', opacity: 0 });
        $(this.textView).stop().animate({ top: targetY, opacity: 1 }, { duration:700, easing:'easeOutBack'});

        this.visibleFlag = true;
	}

	private textAreaHide(easing: boolean = true): void{

        this.textAreaViewFlag = false;
        var targetY:number = this.defaultY - 20;

        $(this.textView).stop().animate({ top: targetY, opacity: 0 }, { duration: 200, easing:'easeOutCubic', complete: this.textAreaHideComp.bind(this)});
        
	}

	private textAreaHideComp(): void{

        this.textView.style.display = 'none';
        this.visibleFlag = false;
		
	}


    private resize(): void {

        this.defaultY = Vars.stageHeight - 164;
        if (platform != 'pc') this.defaultY = Vars.stageHeight - 200;

        if (this.textAreaViewFlag) {
            $(this.textView).css({ top: this.defaultY + 'px' });
        }
    }


}