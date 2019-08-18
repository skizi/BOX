module CameraManager {

    var cameraY: number = 1000;
    var cameraRadius:number = 1500;
    var cameraRot:number = 0;
    export var camera: THREE.PerspectiveCamera;
    var speed: number = 10;
    var loopTime: number = 60;

    var cameraMovePoints: Array<THREE.Vector3> = [];
    var cameraMoveSpline: THREE.SplineCurve3;

    var moveSpline: CameraMoveSpline;




    export function init():void {

        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        camera = new THREE.PerspectiveCamera( fov, aspect, 1, 20000 );

        camera.position.set(0, cameraY, -cameraRadius);
        camera.lookAt(new THREE.Vector3());

    }


    //CameraManagerのanimateはバグ対策の為にVars.tsにて実行させている。
    export function animate() {
        
        if (/*Input.alt &&*/ true ) {
            cameraRot += .1;
            var radian = cameraRot * Vars.toRad;
            var x = Math.cos(radian) * cameraRadius;
            var z = Math.sin(radian) * cameraRadius;
            camera.position.set(x, cameraY, z);
            camera.lookAt(new THREE.Vector3());
        } else {
            //camera.position.z += 10;
            //camera.position.x += 10;
        }
        


        if ( moveSpline ) moveSpline.animate();
    }



    export function addCameraMovePoints( _cameraMovePoints: Array<THREE.Vector3> ):void {

        moveSpline = new CameraMoveSpline(camera, _cameraMovePoints, loopTime );

    }


    
    /*
    var direction: THREE.Vector3 = doorPosition[0].clone().sub(camera.position.clone()).normalize();
    var targetVec:THREE.Vector3 = camera.position.clone().add(direction.multiplyScalar(speed));
    camera.position = targetVec;*/

}