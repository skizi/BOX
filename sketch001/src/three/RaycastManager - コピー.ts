module RaycastManager {

    export var type: string = 'normal';    //normal or octree

    var worker: any;
    var ab: Float32Array = new Float32Array(1);
    var SUPPORT_TRANSFERABLE: boolean = false;

    var activeMessage: string = 'messages1';
    var messagesLength: number = 900;
    var messages1: Float32Array = new Float32Array(messagesLength);
    var messages2: Float32Array = new Float32Array(messagesLength);
    var messagesIndex: number = 0;
    
    //export var mouseMesh: THREE.Mesh;
    export var mouseMeshY: number = .1;
    /*export var mouseTopMesh: THREE.Mesh;
    export var mouseTopMeshY: number = 10;
    var octree = new THREE.Octree({
        undeferred: false,
        depthMax: Infinity,
        objectsThreshold: 8,
        overlapPct: 0.15
    });*/
    //var intersected;
    //var raycastTargets: Array<THREE.Object3D> = [];

    //var cursorChangeTargets: Array<THREE.Object3D> = [];
    //var cursorChangeTargetsLength: number = 0;

    export var mouseOverTarget: any;
    export var downTarget: any;

    var objects: Array<any> = [];






    export function init(): void {

        initMessages(messages1);
        initMessages(messages2);



        // Worker
        if (!worker) worker = new Worker('js/raycastWorker.js');
        worker.transferableMessage = worker.webkitPostMessage || worker.postMessage;

        ab[0] = -1;
        worker.transferableMessage(ab, [ab.buffer]);
        if (ab.length === 0) {
            SUPPORT_TRANSFERABLE = true;
        }


        /*
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
        */


        worker.onmessage = function (e): any {

            var data = e.data;
            if (data.type) {
                if (data.type == 'workerScriptLoadComp') {
                    var supportFlag: number = 0;
                    if (SUPPORT_TRANSFERABLE) supportFlag = 1;
                    worker.postMessage({ type: 'init', supportTransFerable: supportFlag });
                }
            } else {


                post(data);


            }

        }

        //
        Vars.pushMouseDownFunc(mouseDown.bind(this));
        Vars.pushMouseMoveFunc(mouseMove.bind(this));
        Vars.pushMouseUpFunc(mouseUp.bind(this));


        animate();
    }



    function post(data: any): void {

        if (data) {
            var returnMessage: Float32Array = data.message;
            var workerMessage: Float32Array = data.worker;
        }


        if (activeMessage == 'messages1') {
            activeMessage = 'messages2';
            if (returnMessage) {
                messages2 = returnMessage;
                initMessages(messages2);
            }
            var sendMessage: Float32Array = messages1;
        } else {
            activeMessage = 'messages1';
            if (returnMessage) {
                messages1 = returnMessage;
                initMessages(messages1);
            }
            sendMessage = messages2;
        }



        if (SUPPORT_TRANSFERABLE) {
            if (workerMessage && workerMessage.buffer) {
                var data: any = { message: sendMessage, worker: workerMessage };
                worker.transferableMessage(data, [data.message.buffer, data.worker.buffer]);
            } else {
                data = { message: sendMessage };
                worker.transferableMessage(data, [data.message.buffer]);
            }
        } else {
            worker.transferableMessage(data); //ieは引数がないとバグる
        }

    }

    function initMessages(messages: Float32Array): void {

        for (var i: number = 0; i < messagesLength; i++) {
            messages[i] = -1;
        }
        messagesIndex = 0;

    }


    function setMessages(array: Array<number>): void {


        if (activeMessage == 'messages1') {
            var messages: Float32Array = messages1;
        } else {
            messages = messages2;
        }

        var length: number = array.length;
        var max: number = messagesIndex + length;
        var count: number = 0;
        for (var i: number = messagesIndex; i < max; i++) {
            messages[i] = array[count];
            count++;
        }

        messagesIndex += 9;
    }

    /*
    function raycast(raycaster: THREE.Raycaster): Array<THREE.Intersection> {

        var intersections: Array<THREE.Intersection> = raycaster.intersectObjects(raycastTargets, true);

        return intersections;

    }*/

    /*
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
    */

    export function add( targetObject:any, mouseOverTargetFlag:boolean = false ):void {
        /*
        octree.add(object, { useFaces: false });
        raycastTargets.push(object);

        if (mouseOverTargetFlag) {
            cursorChangeTargets.push(object);
            cursorChangeTargetsLength = cursorChangeTargets.length;
        }
        */

        var propertyArray: Float32Array = new Float32Array(9);
        propertyArray[0] = targetObject.position.x;
        propertyArray[1] = targetObject.position.y;
        propertyArray[2] = targetObject.position.z;

        propertyArray[3] = targetObject.rotation.x;
        propertyArray[4] = targetObject.rotation.y;
        propertyArray[5] = targetObject.rotation.z;

        propertyArray[6] = targetObject.scale.x;
        propertyArray[7] = targetObject.scale.y;
        propertyArray[8] = targetObject.scale.z;

        var meshData: Float32Array = MeshManager.readGeometry(targetObject);

        meshData = Utils.mergeFloat32Array([propertyArray, meshData]);

        var flag: number = 0;
        if (mouseOverTargetFlag) flag = 1;
        var data: any = {
            type: 'addMesh',
            property: propertyArray,
            meshData: meshData,
            name: targetObject.name,
            mouseOverTargetFlag:flag
        };
        worker.transferableMessage(data, [data.property.buffer, data.meshData.buffer]);

    }


    export function remove(name:string): void {
        /*
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
        */
        worker.transferableMessage({ type: 'removeMesh', name:name});
    }


    export function createRaycaster(object: any): number {

        var raycasterId: number = objects.length;
        objects.push(object);

        worker.transferableMessage({ type: 'createRaycaster', raycasterId: raycasterId });

        return raycasterId;
    }


    export function hitCheck(raycasterId:number, pos: THREE.Vector3, direction:THREE.Vector3, dist:number, type: number = 0) {

        setMessages([
            raycasterId,
            pos.x,
            pos.y,
            pos.z,
            direction.x,
            direction.y,
            direction.z,
            dist,
            type
        ]);

        /*
        var obj: any = {};
        var hitFlag:boolean = false;
        var _mouseOverFlag: boolean = false;
        var mouseOutFlag: boolean = false;
        var oldMouseOverTarget: any;
        if (mouseOverTarget) oldMouseOverTarget = mouseOverTarget;


        if (type == 'octree') {
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
        */
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

        requestAnimationFrame(() => animate());
        /*
        if (CameraManager.camera) {
            mouseMesh.position.copy(CameraManager.camera.position);
            mouseMesh.position.y = mouseMeshY;

            mouseTopMesh.position.copy(mouseMesh.position);
            mouseTopMesh.position.y = mouseMesh.position.y + mouseTopMeshY;
        }
        */


        if (downTarget) {
            downTarget.parent.drag();
        }
    }



}