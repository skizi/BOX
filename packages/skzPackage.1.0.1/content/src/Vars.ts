module Vars {

    export var toRad:number = Math.PI / 180;
    export var stageWidth: number = 0;
    export var stageHeight: number = 600;
    export var windowHalfX: number = 0;
    export var windowHalfY: number =0;
    export var mouseX: number = 0;
    export var mouseY: number = 0;
    export var mousePosition: THREE.Vector3 = new THREE.Vector3();

    export var debug: HTMLElement;

    var raycaster = new THREE.Raycaster();
    export var raycastPlane: THREE.Mesh;
    var octree;
    var intersected;
    var baseColor = 0x333333;
    var intersectColor = 0x00D66B;
    var raycastTargets: Array<THREE.Mesh> = [];

    export var scene: THREE.Scene;
    

    export function init() {

        debug = document.getElementById( "debug" );

        //addRaycastPlane
        var geometry:THREE.PlaneGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
        var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, visible:false });
        //var material2: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({ color:0xff00ff, opacity:.1, transparent:true });//opacity:0だとエラー
        raycastPlane = new THREE.Mesh(geometry, material);
        raycastPlane.rotation.x = 270 * Vars.toRad;
        

        octree = new THREE.Octree({
            undeferred: false,
            depthMax: Infinity,
            objectsThreshold: 8,
            overlapPct: 0.15
        });
        octree.add(raycastPlane, { useFaces: false });
        raycastTargets.push( raycastPlane );

        animate();

    }


    function raycast() {


        var vector: THREE.Vector3 = ThreeManager.screen2world();
        vector.sub(CameraManager.camera.position.clone()).normalize()
        raycaster.set(CameraManager.camera.position.clone(), vector);
        var intersections = raycaster.intersectObjects(raycastTargets, true);

        return intersections;

    }


    function octreeRaycast() {

        var vector: THREE.Vector3 = ThreeManager.screen2world();
        vector.sub(CameraManager.camera.position.clone()).normalize()
        raycaster.set(CameraManager.camera.position.clone(), vector);
        var numFaces: number = 0;
        var octreeObjects = octree.search(raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction);
        var intersections = raycaster.intersectOctreeObjects(octreeObjects);
        var numObjects = octreeObjects.length;

        for (var i = 0, il = numObjects; i < il; i++) {

            numFaces += octreeObjects[i].faces.length;

        }


        octree.update();

        return intersections;

    }

    
    function animate() {

        requestAnimationFrame(() => animate());

        if (CameraManager.camera) {
            raycastPlane.position.copy( CameraManager.camera.position );
            raycastPlane.position.y = 10;
        }


        //var intersections = octreeRaycast();
        var intersections = raycast();


        if (intersections.length > 0) {

            if (intersected != intersections[0].object) {

                //if (intersected) intersected.material.color.setHex(baseColor);

                intersected = intersections[0].object;
                //intersected.material.color.setHex(intersectColor);
            }

            mousePosition = intersections[0].point;
            //debug.innerHTML = "Hit @ " + intersections[0].point.z;
            //Vars.debug.innerHTML = "y:" + Vars.mousePosition.y + ", z:" + Vars.mousePosition.z;
            document.body.style.cursor = 'pointer';

        } else if (intersected) {

            //intersected.material.color.setHex(baseColor);
            intersected = null;

            document.body.style.cursor = 'auto';

        }



        //raycastバグ対策の為raycast計算後にCameraManagerのanimate実行
        CameraManager.animate();
    }




}