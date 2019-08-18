class NekoCamera extends Camera {

    private tweenFlag: boolean = false;
    private lastMover: any;
    public stopFlag: boolean = true;



    constructor(fov: number, aspect: number, near: number, far: number) {

        super(fov, aspect, near, far);


        CameraMove.rotate.init();
        /*
        var movePoints: Array<THREE.Vector3> = [
            new THREE.Vector3(0, 200, 0),
            new THREE.Vector3(0, 100, 20),
            new THREE.Vector3(0, 30, 30)
        ];*/
    }



    //-------------------------public-------------------------
    public opInit(): void {

        this.type = 'autoRotate';

        this.stopFlag = true;

        var length: number = StageManager.grounds.length;
        var minX: THREE.Vector3 = new THREE.Vector3();
        var maxX: THREE.Vector3 = new THREE.Vector3();
        var minZ: THREE.Vector3 = new THREE.Vector3();
        var maxZ: THREE.Vector3 = new THREE.Vector3();
        for (var i: number = 0; i < length; i++) {
            if (StageManager.grounds[i].addFlag) {
                var pos: THREE.Vector3 = StageManager.grounds[i].position.clone();
                if (minX.x > pos.x) minX.copy(pos);
                if (maxX.x < pos.x) maxX.copy(pos);
                if (minZ.z > pos.z) minZ.copy(pos);
                if (maxZ.z < pos.z) maxZ.copy(pos);
            }
        }
        var radiusX: number = Math.abs((maxX.x - minX.x) * .5);
        var radiusZ: number = Math.abs((maxZ.z - minZ.z) * .5);
        var radius: number = radiusX;
        if (radiusX < radiusZ) radius = radiusZ;
        radius += 30;


        CameraMove.autoRotate.init();
        CameraMove.autoRotate.speed = 50;
        CameraMove.autoRotate.loopFlag = false;
        CameraMove.autoRotate.y = CameraMove.autoRotate.targetY = 40;
        CameraMove.autoRotate.radius = CameraMove.autoRotate.targetRadius = radius;
        CameraMove.autoRotate.cameraTarget.position.set(minX.x + (maxX.x - minX.x) * .5, 0, minZ.z + (maxZ.z - minZ.z) * .5);
        this.cameraTarget.position.copy(CameraMove.autoRotate.cameraTarget.position);

        this.position.copy(CameraMove.autoRotate.render());
        this.lookAt(CameraMove.autoRotate.cameraTarget.position);

    }


    public opStart(): void {

        this.stopFlag = false;
        
        CameraMove.autoRotate.init(this.opCompStep1.bind(this));
    }


    private opCompStep1(): void {

        CoverManager.fadeOut('white', this.opCompStep2.bind(this));
        //this.opCompStep2();
    }

    public opCompStep2(): void{

        CoverManager.fadeIn('white');

        var player: Player = <Player>SceneManager.scene.getObjectByName('player', false);
        player.start();

        //set text
        //PixiManager.pixiParticle2.show();
        PixiManager.stageStartText.show();
        setTimeout(function () {
            //PixiManager.pixiParticle2.hide();
            PixiManager.stageStartText.hide();
        }.bind(this), 2000);

        CameraManager.stageStart(this.opCompStep3.bind(this));

    }

    private opCompStep3(): void {

        this.stopFlag = false;

        this.lastMover = CameraMove.rotate;
        this.typeChenge({ type: 'rotate', easingFlag: true });

        var player: Player = <Player>SceneManager.scene.getObjectByName('player', false);
        this.setCameraTarget(player);

        StageManager.opComp();
    }


    public flip(type: string): void {
        if (type == 'start') {
            this.typeChenge({ type: 'rotate', easingFlag: true });
        } else if (type == 'end') {
            //var ground: Ground = <Ground>SceneManager.scene.getObjectByName('ground', false);
            //ground.mouseClick();
        }
    }

    public oneRotation(): void {

        CameraMove.rotate.pluseRadius(5);

    }


    public typeChenge(obj: any): void {

        this.type = obj.type;
        if (obj.easingFlag) {
            var tweenCameraTarget: THREE.Object3D = new THREE.Object3D();
            tweenCameraTarget.position.copy(this.lastMover.cameraTarget.position);
        }


        switch (this.type) {

            case 'rotate':
                var pos: THREE.Vector3 = CameraMove.rotate.render();
                var cameraTarget: THREE.Object3D = CameraMove.rotate.cameraTarget;
                this.lastMover = CameraMove.rotate;
                break;

            case 'autoRotate':
                var pos: THREE.Vector3 = CameraMove.autoRotate.render();
                var cameraTarget: THREE.Object3D = CameraMove.autoRotate.cameraTarget;
                this.lastMover = CameraMove.autoRotate;
                break;

            case 'closeUp':
                CameraMove.closeUp.cameraTarget = obj.target;
                var pos:THREE.Vector3 = CameraMove.closeUp.render(this);
                cameraTarget = CameraMove.closeUp.cameraTarget;
                this.lastMover = CameraMove.closeUp;
                break;

            case 'spline':
                var pos: THREE.Vector3 = CameraMove.spline.render();
                var cameraTarget: THREE.Object3D = CameraMove.spline.cameraTarget;
                this.lastMover = CameraMove.spline;
                CameraMove.spline.startTime = 0;
                break;

            case 'debug':
                var pos: THREE.Vector3 = new THREE.Vector3(0, 1, 20);
                var cameraTarget: THREE.Object3D = new THREE.Object3D();
                cameraTarget.position.copy(new THREE.Vector3(0, 1, 0));
                break;
        }

        //カメラの位置とカメラtargetの位置をイージングさせつつ変更
        if (obj.easingFlag) {
            this.tweenFlag = true;
            var upDate: Function = function () {
                var pos: THREE.Vector3 = ThreeManager.easingVector3(tweenCameraTarget.position, cameraTarget.position, 2);
                tweenCameraTarget.position.copy(pos);
                this.lookAt(tweenCameraTarget.position);
            }
            TweenManager.addTweenPosition(this, pos, 1000, TWEEN.Easing.Cubic.Out, 0, this.tweenComp.bind(this), upDate.bind(this));
        }
    }


    private tweenComp(): void {

        this.tweenFlag = false;

    }

    
    //-------------------------move-------------------------
    public animate() {
        
        if(this.tweenFlag || !Vars.initCompFlag || this.stopFlag || !Vars.renderFlag)return;


        switch (this.type) {

            case 'autoRotate':
                this.position.copy(CameraMove.autoRotate.render());
                this.lookAt(CameraMove.autoRotate.cameraTarget.position);
                break;

            case 'rotate':
                this.position.copy(CameraMove.rotate.render());
                this.lookAt(CameraMove.rotate.cameraTarget.position);
                break;
            
            case 'closeUp':
                this.position.copy(CameraMove.closeUp.render(this));
                this.lookAt(this.cameraTarget.position);
                this.lookAt(CameraMove.closeUp.cameraTarget.position);
                break;

            case 'spline':
                this.position.copy(CameraMove.spline.render());
                this.lookAt(CameraMove.spline.cameraTarget.position);
                break;

        }
        
    }


    public setTweenCameraTargetPos(targetPos: THREE.Vector3): void {

        if (this.type != 'rotate') return;

        CameraMove.rotate.setTweenCameraTargetPos(targetPos);

    }


    public setCameraTarget(target: THREE.Object3D): void {

        CameraMove.rotate.setCameraTarget(target);

    }


    public positionRefresh(): void {

        if (this.type == 'rotate') {
            CameraMove.rotate.refresh();
        }

    }


    //-------------------------public-------------------------
    public gameOver(): void {

        this.type = 'autoRotate';

        
        CameraMove.autoRotate.init();
        CameraMove.autoRotate.speed = 10;
        CameraMove.autoRotate.loopFlag = true;
        CameraMove.autoRotate.y = CameraMove.autoRotate.targetY = CameraMove.rotate.targetY;
        CameraMove.autoRotate.radius = CameraMove.autoRotate.targetRadius = CameraMove.rotate.targetRadius;
        CameraMove.autoRotate.rot = CameraMove.autoRotate.targetRot = Math.atan2(this.position.z, this.position.x) * 180 / Math.PI;
        CameraMove.autoRotate.cameraTarget.position.copy(CameraMove.rotate.cameraTarget.position);
        this.cameraTarget.position.copy(CameraMove.rotate.cameraTarget.position);
        this.position.copy(CameraMove.autoRotate.render());
        this.lookAt(CameraMove.autoRotate.cameraTarget.position);

    }
}