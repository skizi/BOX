module RaycastManager {

    export var raycastType: string = 'normal';    //normal or octree

    export var mouseMesh: THREE.Mesh;
    export var mouseMeshY: number = .1;
    export var mouseTopMesh: THREE.Mesh;
    export var mouseTopMeshY: number = 10;
    var octree = new THREE.Octree({
        undeferred: false,
        depthMax: Infinity,
        objectsThreshold: 8,
        overlapPct: 0.15
    });
    var intersected;
    var baseColor = 0x333333;
    var intersectColor = 0x00D66B;
    var raycastTargets: Array<THREE.Object3D> = [];

    var cursorChangeTargets: Array<THREE.Object3D> = [];
    var cursorChangeTargetsLength: number = 0;

    export var mouseOverTarget: any;
    export var downTarget: any;


    export function init(): void {

        


        //add mouseMesh
        var geometry:THREE.PlaneGeometry = new THREE.PlaneGeometry(300, 300, 10, 10);
        var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe:true, visible: false });
        mouseMesh = new THREE.Mesh(geometry, material);
        mouseMesh.rotation.x = 270 * Vars.toRad;
        mouseMesh.name = 'mouseMesh';
        SceneManager.scene.add(mouseMesh);
        add(mouseMesh);

        mouseTopMesh = new THREE.Mesh(geometry, material);
        mouseTopMesh.rotation.x = 270 * Vars.toRad;
        mouseTopMesh.name = 'mouseTopMesh';
        SceneManager.scene.add(mouseTopMesh);
        add(mouseTopMesh);


        //
        Vars.pushMouseDownFunc(mouseDown.bind(this));
        Vars.pushMouseMoveFunc(mouseMove.bind(this));
        Vars.pushMouseUpFunc(mouseUp.bind(this));


        //animate();
        Vars.setAnimateFunc(animate.bind(this));
    }



    function raycast(raycaster: THREE.Raycaster): Array<THREE.Intersection> {

        var intersections: Array<THREE.Intersection> = raycaster.intersectObjects(raycastTargets, true);

        return intersections;

    }


    function octreeRaycast(raycaster: THREE.Raycaster) {

        var numFaces: number = 0;
        var octreeObjects:Array<any> = octree.search(raycaster.ray.origin, raycaster.far, true, raycaster.ray.direction);
        var intersections = raycaster.intersectOctreeObjects(octreeObjects);
        var numObjects = octreeObjects.length;

        for (var i = 0, il = numObjects; i < il; i++) {

            numFaces += octreeObjects[i].faces.length;

        }


        octree.update();

        return intersections;

    }


    export function add( object:THREE.Object3D, mouseOverTargetFlag:boolean = false ):void {
        
        octree.add(object, { useFaces: false });
        raycastTargets.push(object);

        if (mouseOverTargetFlag) {
            cursorChangeTargets.push(object);
            cursorChangeTargetsLength = cursorChangeTargets.length;
        }

    }


    export function remove(object:THREE.Object3D): void {

        var name: string = object.name;

        //octree
        octree.remove(object);

        //raycastTargets
        var index: number = -1;
        for (var i: number = 0; i < raycastTargets.length; i++) {
            if (raycastTargets[i].name == name) index = i;
        }
        if (index != -1) raycastTargets.splice(index, 1);

        //cursorChangeTargets
        index = -1;
        for (i = 0; i < cursorChangeTargetsLength; i++) {
            if (name == cursorChangeTargets[i].name) index = i;
        }
        if (index != -1) cursorChangeTargets.splice(index, 1);
        cursorChangeTargetsLength = cursorChangeTargets.length;

    }


    export function hitCheck(raycaster, dist, type:string = '') {
        
        var obj: any = {};
        var hitFlag:boolean = false;
        var _mouseOverFlag: boolean = false;
        var mouseOutFlag: boolean = false;
        var oldMouseOverTarget: any;
        if (mouseOverTarget) oldMouseOverTarget = mouseOverTarget;


        if (raycastType == 'octree') {
            var intersections = octreeRaycast(raycaster);
        } else {
            intersections = raycast(raycaster);
        }
        var intersectionsLength: number = intersections.length;

        if (intersectionsLength > 0) {

            
            //intersectedと新しく取得したオブジェクトが違ったら一番最初にピッキングしたオブジェクトを代入
            if (intersected != intersections[0].object) {
                intersected = intersections[0].object;
            }


            //ピッキングしたオブジェクトが指定距離内にあったらフラグを立てる
            var distance = intersections[0].distance;
            if (distance > 0 && distance < dist) {
                hitFlag = true;
                obj.intersections = intersections;

                //マウスカーソル方向を示しているraycasterの場合はmouseOver処理をする。
                if (type == 'mouse') {
                    for (var i: number = 0; i < intersectionsLength; i++) {
                        for (var j: number = 0; j < cursorChangeTargetsLength; j++) {
                            if (intersections[i].object.name == cursorChangeTargets[j].name && intersections[i].object.visible) {
                                if (!_mouseOverFlag) mouseOverTarget = intersections[i].object;
                                _mouseOverFlag = true;
                            }
                        }
                    }
                }
            }

        } else if (intersected) {

            //intersections.lengthが0ならintersectedにnullを代入
            intersected = null;

        }

        if (type == 'mouse') {
            if (_mouseOverFlag) {
                document.body.style.cursor = 'pointer';
                mouseOverTarget.parent.mouseOver();
            } else {
                mouseOverTarget = null;
            }

            if (mouseOverTarget != oldMouseOverTarget) {
                document.body.style.cursor = 'auto';
                if (oldMouseOverTarget) oldMouseOverTarget.parent.mouseOut();
            }
        }

        obj.hitFlag = hitFlag;
        

        return obj;

        /*
        var intersections = raycast();

        var length = intersections.length;
        if (length > 0) {
            var index = length - 1;
            var distance = intersections[index].distance;
            if (distance > 0 && distance < dist) {
                hitFlag = true;
            }
        }

        if (hitFlag) obj = intersections[index];
        obj.hitFlag = hitFlag;

        return obj;
        */
    }



    export function getFirstPointByName(intersections:any, name:string): THREE.Vector3 {
        var length: number = intersections.length;
        var point: THREE.Vector3;
        for (var i: number = 0; i < length; i++) {
            if (intersections[i].object.name == name && !point) {
                point = new THREE.Vector3().copy( intersections[i].point );
            }
        }

        return point;
    }


    export function getFirstObjectByName(intersections: any, name: string): THREE.Vector3 {
        var length: number = intersections.length;
        var object: any;
        for (var i: number = 0; i < length; i++) {
            if (intersections[i].object.name == name && !object) {
                object = intersections[i];
            }
        }

        return object;
    }  

    
    //-------------------------mouse event-------------------------
    var downFlag: boolean = false;
    function mouseDown(): void {

        //マウスオーバーしていて
        //.1秒以内にmouseUpされなければ対象にmouseDownイベント
        if (mouseOverTarget) {
            mouseOverTarget.parent.mouseClick();

            downFlag = true;
            var downX: number = Vars.mouseX;
            var downY: number = Vars.mouseY;

            setTimeout(function () {
                if (!Vars.downFlag ||
                    downX != Vars.mouseX ||
                    downY != Vars.mouseY ||
                    !mouseOverTarget) return;
                downTarget = mouseOverTarget;
                downTarget.parent.mouseDown();
            }.bind(this), 100);
        }
    }


    function mouseMove(): void {

        if (mouseOverTarget) {
            mouseOverTarget.parent.mouseMove();
        }

    }


    function mouseUp(): void {

        //downTargetがいる場合は対象にmouseUpイベント
        //downTargetがいない場合でなおかつmouseOverTargetがいたら対象にclickイベント
        if (downFlag) {
            if (downTarget) {
                downTarget.parent.mouseUp();
                downTarget = null;
            } else {

                if (Vars.mouseDragDistX == 0 &&
                    Vars.mouseDragDistY == 0 &&
                    mouseOverTarget) {
                    //mouseOverTarget.parent.mouseClick();
                }

            }
        }

        downFlag = false;
    }


    
    //-------------------------animation-------------------------
    function animate() {

        //requestAnimationFrame(() => animate());

        if (CameraManager.camera) {
            mouseMesh.position.copy(CameraManager.camera.position);
            mouseMesh.position.y = mouseMeshY;

            mouseTopMesh.position.copy(mouseMesh.position);
            mouseTopMesh.position.y = mouseMesh.position.y + mouseTopMeshY;
        }



        if (downTarget) {
            downTarget.parent.drag();
        }
    }



}