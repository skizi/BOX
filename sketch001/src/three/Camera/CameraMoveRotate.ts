module CameraMove.rotate {

    var x: number = 0;
    var y: number = 9;
    var z: number = 0;
    export var targetY: number = 9;
    var rot: number = 90;
    var targetRot: number = 90;
    var lastRot: number = 0;
    var radius: number = 11;
    export var targetRadius: number = 11;

    var direction: number = 1;

    export var cameraTarget: THREE.Object3D;
    export var defaultCameraTarget: THREE.Object3D = new THREE.Object3D();

    var radiusPluseFlag: boolean = false;




    
    //-------------------------init-------------------------
    export function init(): void{

        cameraTarget = defaultCameraTarget;

        if (platform == 'pc') {
            Vars.pushMouseDownFunc(mouseDown.bind(this));
        } else {
            Vars.pushRightClickFunc(mouseDown.bind(this));
        }
        Vars.pushMouseUpFunc(mouseUp.bind(this));
        Vars.pushMouseMoveFunc(mouseMove.bind(this));

        cameraRotate();
    }


    //-------------------------mouse event-------------------------
    function mouseDown(): void {

        lastRot = targetRot;

    }


    function mouseUp(): void {


    }


    function mouseMove(): void {

        if (platform != 'pc' && !Vars.multiTouchFlag) return;

        //名前にgroundが入っていないdownTargetはreturn
        if (RaycastManager.downTarget) {
            var name: string = RaycastManager.downTarget.name;
            if (name.indexOf('ground') == -1) return;
        }

        if (Vars.downFlag) {
            targetRot = lastRot + Vars.mouseDragOffsetX * 8 * Vars.delta;
            /*if (Vars.mouseDragOffsetX > 0) {
                this.direction = 1;
            } else {
                this.direction = -1;
            }*/
        }
        
    }



    
    //-------------------------animate-------------------------
    function distMove(): void {
        
        y += -(y - targetY) / 10;
        radius += -(radius - targetRadius) / 10;

    }


    function cameraRotate(): void {

        rot += -(rot - targetRot) / 10;
        var radian = rot * Vars.toRad;
        x = Math.cos(radian) * radius + cameraTarget.position.x;
        z = Math.sin(radian) * radius + cameraTarget.position.z;

    }


    export function render(): THREE.Vector3 {

        if (Vars.mousePosition.distanceTo(Vars.lastMousePosition) != 0) {
            distMove();
            cameraRotate();
        }
        
        LightManager.setTargetPos(cameraTarget.position);

        return new THREE.Vector3(x, y, z);

    }


    export function setTweenCameraTargetPos(targetPos: THREE.Vector3): void {

        cameraTarget = defaultCameraTarget;

        var upDate: Function = function () {
            cameraRotate();
            distMove();
        }
        TweenManager.addTweenPosition(cameraTarget, targetPos, 500, TWEEN.Easing.Cubic.Out, 0, null, upDate.bind(this));

    }


    export function setCameraTarget(target:THREE.Object3D):void {

        cameraTarget = target;

    }


    export function pluseRadius(pluse:number): void {

        if (targetRadius > 50) return;

        radiusPluseFlag = true;
        targetY += pluse;
        targetRadius += pluse;

        setTimeout(function () {
            radiusPluseFlag = false;
        }.bind(this), 1000);
    }


    export function refresh():void {

        y = targetY;
        radius = targetRadius;


        rot = targetRot;
        var radian = rot * Vars.toRad;
        x = Math.cos(radian) * radius + cameraTarget.position.x;
        z = Math.sin(radian) * radius + cameraTarget.position.z;

    }
}