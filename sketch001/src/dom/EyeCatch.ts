class EyeCatch {

    private element: JQuery;
    private titleContainer: JQuery;
    private title: JQuery;
    private template: string =
    '<div class="title-container">' +
        '<h2></h2>' +
    '</div>';

    public callBack: Function;




    constructor (){

        //
        this.element = $('<div>');
        this.element.attr({
            id: 'eye-catch'
        });
        this.element.append(this.template);
        this.element.css({ opacity: 0 });
        this.element.animate({ opacity: 1 }, { duration: 1000 });
        $(document.body).append(this.element);


        //titleContainer
        this.titleContainer = $(this.element.find('.title-container')[0]);

        //title
        this.title = $(this.element.find('h2')[0]);


        //resize
        this.resize();
        Vars.pushResizeFunc( this.resize.bind(this) );

        //
        this.titleContainer.addClass('fade-out2');
        this.element.css({display:'none'});
    }



    public show(stageNo:number): void {
        
        this.element.fadeIn(1000, this.showComp.bind(this));

        this.titleContainer.css({display:'none'});
        setTimeout(function () {
            this.titleContainer.css({ display: 'block' });
            this.titleContainer.removeClass('fade-out2').addClass('fade-in2');
        }.bind(this), 800);

        this.title.html('stage ' + stageNo + ' start!');
    }

    private showComp(): void {

        this.callBack('showComp');

    }


    public hide(): void{

        this.titleContainer.removeClass('fade-in2').addClass('fade-out2');
        this.element.delay(500).fadeOut(1000, this.hideComp.bind(this));

    }

    private hideComp(): void {

        this.callBack('hideComp');

    }



    private resize(): void {

        var w: number = Vars.stageWidth;
        var h: number = Vars.stageHeight;

        this.element.css({
            height: h + 'px'
        });

        this.titleContainer.css({
            marginTop: (h - 300) * .5 + 'px'
        });
    }



}