class Camera extends THREE.PerspectiveCamera {

    public type: string = 'rotate';

    public y: number = 4;
    public radius: number = 5;
    public cameraRot: number = 0;
    public cameraTarget: THREE.Object3D = new THREE.Object3D();
    public cameraTargetDefault: THREE.Object3D = new THREE.Object3D();

    private speed: number = 10;
    private loopTime: number = 60;





    constructor(fov:number, aspect:number, near:number, far:number) {

        super(fov, aspect, near, far);

        this.position.set(0, this.y, -this.radius);
        this.lookAt(this.cameraTarget.position);

    }


    public animate() {

        if (this.type == 'rotate') {
            this.cameraRot += .1;
            var radian = this.cameraRot * Vars.toRad;
            var x = Math.cos(radian) * this.radius;
            var z = Math.sin(radian) * this.radius;
            this.position.set(x, this.y, z);
            this.lookAt(this.cameraTarget.position);
        } else if ('spline') {

            CameraMove.spline.render();

        } else if ('standard'){
            this.position.z += .1;
        }


    }



    public addMovePoints(_cameraMovePoints: Array<THREE.Vector3>): void {

        CameraMove.spline.init(_cameraMovePoints, this.loopTime);

    }


}