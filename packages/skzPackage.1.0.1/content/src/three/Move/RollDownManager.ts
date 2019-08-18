class RollDownManager{

    private rollDowns: Array<any> = [];
    private interval: any;
    private length: number = 5;


    constructor( _objects:Array<THREE.Object3D>, time:number ){

        for (var i: number = 0; i < this.length; i++) {
            var rollDown: RollDown = new RollDown( _objects, time );
            this.rollDowns.push(rollDown);
        }

        this.interval = setInterval(this.add.bind(this), 5000);
    }


    add(): void {

        var addFlag: boolean = false;
        var length: number = this.rollDowns.length;
        for (var i: number = 0; i < length; i++) {

            if (this.rollDowns[i].standby && !addFlag) {
                this.rollDowns[i].standby = false;
                this.rollDowns[i].start();
                addFlag = true;
            }

        }
    }


    remove(): void {

        clearInterval(this.interval);

    }


} 