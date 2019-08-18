class MouseNavi {

    private element: JQuery;
    private template: string = '<p></p>';
    public TF: JQuery;

    private showFlag: boolean = false;


    constructor() {

        var element = document.createElement('div');
        element.className = 'throw-navi';
        element.innerHTML = this.template;
        document.body.appendChild(element);
        
        this.element = $(element);
        this.element.css({display:'none'});
        
        this.TF = $(this.element.find('p')[0]);
        this.TF.html('右クリックで投げる')
        
        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }


    public show(): void {

        if (!this.showFlag) {
            this.element.removeClass('fade-out1');

            this.showFlag = true;
            this.element.stop().fadeIn(600);
            this.element.addClass('fade-in1');

            SoundManager.play(6, false);
        }
    }


    public hide(): void {

        this.element.removeClass('fade-in1');

        this.showFlag = false;
        this.element.stop().fadeOut(300);
        this.element.addClass('fade-out1');

    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());
        
        if (!this.showFlag) return;

        this.element.css({ left: Vars.mouseX + 10 + 'px', top: Vars.mouseY + 10 + 'px' });

    }
}