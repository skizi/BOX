module ThreeManager {

    var projector: THREE.Projector = new THREE.Projector();


    export function screen2world(): THREE.Vector3 {

        var mouse: THREE.Vector3 = new THREE.Vector3(Vars.mouseX, Vars.mouseY, .5);
        mouse.x = ( mouse.x / Vars.stageWidth ) * 2 - 1;
        mouse.y = - (mouse.y / Vars.stageHeight) * 2 + 1;
        projector.unprojectVector( mouse, CameraManager.camera);

        return mouse;
    }


    export function world2screen(object): THREE.Vector3 {
        /*
        var vector: THREE.Vector3 = new THREE.Vector3();
        projector.projectVector(vector.setFromMatrixPosition(object.matrixWorld), CameraManager.camera);

        vector.x = (vector.x * Vars.windowHalfX) + Vars.windowHalfX;
        vector.y = - (vector.y * Vars.windowHalfY) + Vars.windowHalfY;

        return vector;
        */

        var pos = object.position.clone();
        projector.projectVector(pos, CameraManager.camera);
        pos.x = (pos.x + 1) / 2 * Vars.stageWidth;
        pos.y = -(pos.y + 1) / 2 * Vars.stageHeight;

        return pos;
        
    }


    export function getMouseTo( target:THREE.Mesh ):Object {

        var worldToScreenVector = this.world2screen( target );
        var m = new THREE.Vector3( Vars.mouseX, Vars.mouseY, 0 );
        var dist = m.distanceTo(worldToScreenVector);
        var direction = m.sub(worldToScreenVector);
        var direction2 = direction.clone(); 
        direction.normalize();

        var x = 0;
        var z = 0;
        if (dist > 20 ) {
            x = -direction.x;
            z = -direction.y;
        }


        return { direction: new THREE.Vector3(x, 0, z), dist: dist, direction2:direction2 };

    }


    export function getCameraForward( vec:THREE.Vector3 ):THREE.Vector3 {

        var forward = getForward( CameraManager.camera );
        forward.y = 0;

        var right = new THREE.Vector3(forward.z, 0, -forward.x);

        var a = right.multiplyScalar(vec.x);
        var b = forward.multiplyScalar(vec.z);
        var direction:THREE.Vector3 = a.add(b);

        return direction;

    }


    function getForward( obj:THREE.Object3D ):THREE.Vector3 {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(obj.rotation);//, obj.eulerOrder
        return vector;
    }

}