class MoveSpline {

    public loopTime: number;
    public object: THREE.Object3D;
    public moveSpline: THREE.SplineCurve3;


    constructor(_object: THREE.Object3D, movePoints:Array<THREE.Vector3> , _loopTime:number ) {

        this.object = _object;
        this.moveSpline = new THREE.SplineCurve3( movePoints );
        this.loopTime = _loopTime;

        this.animate();
        
    }


    public animate():void {

        requestAnimationFrame(() => this.animate());

        var time = Date.now();
        var looptime = this.loopTime * 1000;
        var t = (time % looptime) / looptime;

        var pos: THREE.Vector3 = <THREE.Vector3>this.moveSpline.getPointAt(t);
        this.object.position = pos;
        
    }


}