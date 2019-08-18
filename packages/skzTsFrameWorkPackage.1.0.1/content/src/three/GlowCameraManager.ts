module GlowCameraManager {

    export var camera: THREE.PerspectiveCamera;




    export function init(): void {

        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        camera = new THREE.PerspectiveCamera(fov, aspect, 1, 20000);
        camera.position.set(0, 400, -700);
        camera.lookAt( new THREE.Vector3() );

        animate();

    }


    function animate(): void {

        requestAnimationFrame(() => animate());

        camera.position.copy( CameraManager.camera.position );
        camera.rotation = CameraManager.camera.rotation;
        camera.lookAt(new THREE.Vector3());

    }



}