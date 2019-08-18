module GroundManager {

    var initFlag: boolean = false;
    var positions: Array<Array<THREE.Vector3>> = [];
    export var groundSize: THREE.Vector3 = new THREE.Vector3( 10000, 10000, 10000 );
    export var grounds: Array<THREE.Mesh> = [];
    var oldCameraPos: THREE.Vector3 = new THREE.Vector3();



    export function init():void {

        for (var i: number = 0; i < 3; i++) {
            positions[i] = [];
            for (var j: number = 0; j < 3; j++) {
                positions[i].push( new THREE.Vector3() );
            }
        }

    }


    export function initGround(meshs: Array<THREE.Mesh>): Array<THREE.Mesh> {

        var index: number = 0;
        var length: number = meshs.length;
        for (var i: number = 0; i < 9; i++) {
            var mesh: THREE.Mesh = MeshManager.duplicate(meshs[index] );
            grounds.push(mesh);
            index++;
            if (index == length) index = 0;
        }

        setPositions();
        setGroundPosition();

        initFlag = true;

        return grounds;
    }
    

    function setPositions():void {

        var cameraPos: THREE.Vector3 = getCameraPos();
        if (cameraPos.x != oldCameraPos.x ||
            cameraPos.z != oldCameraPos.z ) scrollGround( cameraPos );
        
        var pluseX: number = -1;
        var pluseZ: number = -1;
        for (var i: number = 0; i < 3; i++) {
            for (var j: number = 0; j < 3; j++) {
                var x: number = cameraPos.x + pluseX;
                var z: number = cameraPos.z + pluseZ;
                positions[i][j] = new THREE.Vector3( x, 0, z );
                pluseZ++;
            }
            pluseZ = -1;
            pluseX++;
        }

        oldCameraPos = cameraPos.clone();
    }


    function getCameraPos(): THREE.Vector3 {

        var pos: THREE.Vector3 = CameraManager.camera.position.clone();
        var x: number = Math.round(pos.x / groundSize.x);
        var y: number = Math.round(pos.y / groundSize.y);
        var z: number = Math.round(pos.z / groundSize.z);

        return new THREE.Vector3(x, y, z);

    }


    function setGroundPosition(): Array<THREE.Mesh> {

        var index: number = 0;
        for (var i: number = 0; i < 3; i++) {
            for (var j: number = 0; j < 3; j++) {
                var x: number = positions[i][j].x * groundSize.x;
                var z: number = positions[i][j].z * groundSize.z;
                grounds[index].position.set(x, 0, z);
                index++;
            }
        }

        return grounds;

    }


    export function update():void {

        if (initFlag) {
            setPositions();
            setGroundPosition();
        }
    }


    function scrollGround( cameraPos:THREE.Vector3 ): void {

        var index: number = 0;
        var g = [];
        for (var i: number = 0; i < 3; i++) {
            g[i] = [];
            for (var j: number = 0; j < 3; j++) {
                g[i].push( grounds[index] );
                index++;
            }
        }


        var x: number = cameraPos.x - oldCameraPos.x;
        var z: number = cameraPos.z - oldCameraPos.z;

        if (x > 0) {
            var xg = g.shift();
            g.push(xg);
        } else if (x < 0) {
            xg = g.pop();
            g.unshift(xg);
        }


        if (z > 0) {
            for (i = 0; i < 3; i++) {
                zg = g[i].shift();
                g[i].push(zg);
            }
        } else if (z < 0) {
            for (i = 0; i < 3; i++) {
                var zg = g[i].pop();
                g[i].unshift(zg);
            }
        }


        var index: number = 0;
        for (var i: number = 0; i < 3; i++) {
            for (var j: number = 0; j < 3; j++) {
                grounds[index] = g[i][j];
                index++;
            }
        }

    }


}