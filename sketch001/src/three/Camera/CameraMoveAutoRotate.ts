module CameraMove.autoRotate {

    var x: number = 0;
    export var y: number = 30;
    var z: number = 0;
    export var targetY: number = 30;
    export var rot: number = 90;
    export var targetRot: number = 90;

    export var radius: number = 11;
    export var targetRadius: number = 11;


    export var cameraTarget: THREE.Object3D;
    export var defaultCameraTarget: THREE.Object3D = new THREE.Object3D();

    export var speed: number = 50;
    export var loopFlag: boolean = false;


    var compFlag: boolean = false;
    var lastPos: THREE.Vector3 = new THREE.Vector3();
    var callBack: Function;



    
    //-------------------------init-------------------------
    export function init(_callBack:Function = null): void{

        callBack = _callBack;

        compFlag = false;
        rot = targetRot = 0;
        cameraTarget = defaultCameraTarget;

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

        if (compFlag) {
            return lastPos;
        }

        targetRot += speed * Vars.delta;
        if (targetRot > 360 && !loopFlag) {
            compFlag = true;
            if (callBack)callBack();
            return lastPos;
        }

        distMove();
        cameraRotate();
        

        lastPos.set(x, y, z);
        return new THREE.Vector3(x, y, z);

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