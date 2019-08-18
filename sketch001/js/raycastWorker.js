'use strict'
importScripts('three.min.js', 'Octree.js');

var abTestCompFlag = false;
var SUPPORT_TRANSFERABLE = false;
var transferableMessage = self.webkitPostMessage || self.postMessage;




var raycasterType = 'normal';    //normal or octree
var raycasters = [];

var scene = new THREE.Scene();

var objects = {};
var raycastTargets = [];
var intersected;

//mouse
var mouseMesh;
var mouseMeshY = .1;
var mouseTopMesh;
var mouseTopMeshY = 10;
var octree = new THREE.Octree({
    undeferred: false,
    depthMax: Infinity,
    objectsThreshold: 8,
    overlapPct: 0.15
});

var cursorChangeTargets = [];
var cursorChangeTargetsLength = 0;

var mouseOverTarget;

//
var activeBufferArray = 1;
var bufferArray1 = new Float32Array(1);
var bufferArray2 = new Float32Array(1);
var bufferArrayLength = 0;






function init(){

    
    //add mouseMesh
    var geometry = new THREE.PlaneGeometry(300, 300, 10, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe:true, visible: false });
    mouseMesh = new THREE.Mesh(geometry, material);
    mouseMesh.rotation.x = 270 * Vars.toRad;
    mouseMesh.name = 'mouseMesh';
    scene.add(mouseMesh);
    add(mouseMesh);

    mouseTopMesh = new THREE.Mesh(geometry, material);
    mouseTopMesh.rotation.x = 270 * Vars.toRad;
    mouseTopMesh.name = 'mouseTopMesh';
    scene.add(mouseTopMesh);
    add(mouseTopMesh);


}

function addMesh(property, meshData, name, mouseOverTargetFlag) {

    var geometry = createGeometry(meshData);
    var mesh = new THREE.Mesh(geometry, new MeshBasicMaterial());
    mesh.position.set(property[0], property[1], property[2]);
    mesh.rotation.set(property[3], property[4], property[5]);
    mesh.scale.set(property[6], property[7], property[8]);
    scene.add(mesh);

    add(mesh, mouseOverTargetFlag);
}

function add(mesh, mouseOverTargetFlag) {
        
    octree.add(mesh, { useFaces: false });
    raycastTargets.push(mesh);
    objects[mesh.name] = mesh;

    if (mouseOverTargetFlag) {
        cursorChangeTargets.push(mesh);
        cursorChangeTargetsLength = cursorChangeTargets.length;
    }

}


function createGeometry(meshData){
    
    var geometry = new THREE.Geometry();

    var count = 0;
    var index = 0;
    var length = meshData[0];
    for (var i = 0; i < length; i++) {
        var a = 2 + i * 3;
        var vec = new THREE.Vector3(
            meshData[a],
            meshData[a + 1],
            meshData[a + 2]
            );
        geometry.vertices.push(vec);
    }

    var vLength = meshData[0] * 3;
    var count = 0;
    var index = 0;
    var length = meshData[1];
    for (var i = 0; i < length; i++) {
        var n = 2 + vLength + i * 6;
        var a = meshData[n];
        var b = meshData[n + 1];
        var c = meshData[n + 2];

        var normal = new THREE.Vector3(
            meshData[n + 3],
            meshData[n + 4],
            meshData[n + 5]
            );

        var face = new THREE.Face3(a, b, c, normal);
        geometry.faces.push(face);

    }

    geometry.computeFaceNormals();

    return geometry;

}


function remove(name) {

    //octree
    octree.remove(objects[name]);

    //raycastTargets
    var index = -1;
    for (var i = 0; i < raycastTargets.length; i++) {
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

    scene.remove(objects[name]);
    objects[name] = null;
}


function hitCheck(raycaster, dist, mouseRaycasterFlag) {
        
    var obj = {};
    var hitFlag = false;
    var _mouseOverFlag = false;
    var mouseOutFlag = false;
    var oldMouseOverTarget;
    if (mouseOverTarget) oldMouseOverTarget = mouseOverTarget;


    if (raycasterType == 'octree') {
        var intersections = octreeRaycast(raycaster);
    } else {
        intersections = raycast(raycaster);
    }
    var intersectionsLength = intersections.length;

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
            if (mouseRaycasterFlag) {
                for (var i = 0; i < intersectionsLength; i++) {
                    for (var j = 0; j < cursorChangeTargetsLength; j++) {
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

    if (mouseRaycasterFlag) {
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
}


function raycast(raycaster) {

    var intersections = raycaster.intersectObjects(raycastTargets, true);

    return intersections;

}


function octreeRaycast(raycaster) {

    var numFaces = 0;
    var octreeObjects = octree.search(raycaster.ray.origin, raycaster.far, true, raycaster.ray.direction);
    var intersections = raycaster.intersectOctreeObjects(octreeObjects);
    var numObjects = octreeObjects.length;

    for (var i = 0, il = numObjects; i < il; i++) {

        numFaces += octreeObjects[i].faces.length;

    }


    octree.update();

    return intersections;

}








self.onmessage = function (event) {

    var data = event.data;


    if (!abTestCompFlag) {
        abTestCompFlag = true;
        return;
    }


    if (data.type) {

        switch(data.type) {

            case 'init':
                if (data.supportTransFerable) SUPPORT_TRANSFERABLE = true;
                init();
                transferableMessage({ type: 'initComp' });
                break;

        
            case 'addMesh':
                addMesh(data.property, data.meshData, data.name, data.mouseOverTargetFlag);
                break;


            case 'removeMesh':
                remove(data.name);
                break;

            case 'createRaycaster':
                var raycaster = new THREE.Raycaster(
                    new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2]),
                    new THREE.Vector3(data.direction[0], data.direction[1], data.direction[2])
                    );
                raycasters[data.raycasterId] = raycaster;
                break;
        }

    } else {

        if (data.message && data.message[0] != -1) {
            var message = data.message;
            var pos = new THREE.Vector3(
                    raycasters[message[1]],
                    raycasters[message[2]],
                    raycasters[message[3]]
                );
            var direction = new THREE.Vector3(
                    raycasters[message[4]],
                    raycasters[message[5]],
                    raycasters[message[6]]
                );
            raycasters[message[0]].set(pos, direction);
            var hitObj = hitCheck(raycasters[message[0]], message[7], message[8]);

            if (activeBufferArray == 1) {
                bufferArray1 = new Float32Array(bufferArrayLength);
            } else {
                bufferArray2 = new Float32Array(bufferArrayLength);
            }
        }

        

        dataCash = data;
        var fps = 16;
        setTimeout(post.bind(this), fps);

    }
}


var dataCash;
function post() {
    var data = dataCash;


    if (data.message) {
        var message = data.message;
        var returnMessage = data.worker;
    }

    if (activeBufferArray == 1) {
        activeBufferArray = 2;
        if (returnMessage) {
            bufferArray2 = returnMessage;
        }
        var sendMessage = bufferArray1;
    } else {
        activeBufferArray = 1;
        if (returnMessage) {
            bufferArray1 = returnMessage;
        }
        sendMessage = bufferArray2;
    }

    var data = { message: message, worker: sendMessage };


    if (SUPPORT_TRANSFERABLE) {
        self.transferableMessage(data, [data.message.buffer, data.worker.buffer]);
    } else {
        self.transferableMessage(data); //ieは引数がないとバグる
    }

}

postMessage({ type: 'workerScriptLoadComp' });