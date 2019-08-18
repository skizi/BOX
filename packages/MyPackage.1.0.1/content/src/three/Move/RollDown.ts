class RollDown {

    private objects: Array<THREE.Object3D> = [];
    private length: number = 0;
    private time: number = 0;
    public standby: boolean = true;


    constructor( _objects:Array<THREE.Object3D>, _time:number ) {

        this.objects = _objects;
        this.length = _objects.length;
        this.time = _time;

    }


    public start() {

        var x: number = 1000 * Math.random() - 500;
        var z: number = CameraManager.camera.position.z + 1000;
        for (var i: number = 0; i < this.length; i++) {
            this.objects[i].position.set(x, 1000, z);
            new TWEEN.Tween(this.objects[i].position).to({ y: 0 }, this.time).delay(i * 200)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(function (self) { this.standby = true; }.bind(this)).start();

        }
        

    }



}