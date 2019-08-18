module CameraMove.closeUp{

    var y: number = 7;
    var targetY: number = 7;
    var radius: number = 0;
    var targetRadius: number = 8;


    export var cameraTarget: THREE.Object3D = new THREE.Object3D();





    function distMove(): void {
        
        y += -(y - targetY) / 10;
        radius += -(radius - targetRadius) / 10;

    }


    export function render(camera:any):THREE.Vector3 {

        distMove();

        var direction: THREE.Vector3 = cameraTarget.position.clone().sub(camera.position.clone()).normalize().negate();
        var pos: THREE.Vector3 = cameraTarget.position.clone().add(direction.multiplyScalar(radius));
        pos.y = y;

        return pos;
    }


}