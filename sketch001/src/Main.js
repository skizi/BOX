var Main = (function () {
    function Main() {
        Vars.stageWidth = window.innerWidth;
        Vars.stageHeight = window.innerHeight;

        this.awayView = new AwayView();

        //this.createJsView = new CreateJsView();
        //this.pixiView = new PixiView();
        window.onresize = this.resize.bind(this);
    }
    Main.prototype.resize = function () {
        Vars.stageWidth = window.innerWidth;
        Vars.stageHeight = window.innerHeight;

        if (this.awayView)
            this.awayView.resize();
        if (this.createJsView)
            this.createJsView.resize();
        if (this.pixiView)
            this.pixiView.resize();
    };
    return Main;
})();

window.onload = function () {
    var main = new Main();
};
//# sourceMappingURL=Main.js.map
