
'use strict'

var abTestCompFlag = false;
var SUPPORT_TRANSFERABLE = false;
var transferableMessage = self.webkitPostMessage || self.postMessage;

var browser = 0;//0:othre, 1:safari, 2:ie
var platform = 'pc';

var asmFlag = true;

var deltaTime = 1;
var last = Date.now();
var fps = 16;
var worldStep = 2;



var renderFlag = true;


function libInit() {

    importScripts('Oimo.js');
    importScripts('three.min.js');

}


//
var interval = null;
var dynamicsWorld;

function init() {

    dynamicsWorld = new OIMO.World(1 / 60, 2, 8);
    dynamicsWorld.worldscale(1);
    dynamicsWorld.gravity = new THREE.Vector3(0, -10, 0);
    dynamicsWorld.clear();
    mousePosition = new THREE.Vector3();
    catchDummyBody = new OIMO.Body({ type: ['sphere'], size: [.5], pos: [0, 0, 0], move: true, world: dynamicsWorld }).body;
    
}






var group1 = 1;
var group2 = 2;

var mousePosition;

var playerBody;

var groundBodies = [];
var groundBodiesLength = 0;
var shapes = [];
var manyShapeLength = 0;
var manyShapeCount = 0;
var groundQuaternion;
var groundAxis;
var groundRadian = 0;
var reverseFlag = false;

var bodies = {};
var bodiesArray = [];
var bodiesArrayLength = 0;
var catchBody;
var catchDummyBody;
var catchJointIndex = -1;

var activeBufferArray = 1;
var bufferArray1 = new Float32Array(1);
var bufferArray2 = new Float32Array(1);
var bufferArrayLength = 0;


var joints = [];
var jointsLength = 0;




function setLinearVelocity(index) {

    var body = bodiesArray[index];
    if (!body || body.setPositionFlag) return;

    var pos = body.getPosition();
    var a = body.targetPos.clone();
    a.y = 0;
    var b = pos.clone();
    b.y = 0;
    var distance = a.distanceTo(b);


    //setLinearVelocity
    var speed = body.speed;
    var moveDirection = a.clone().sub(b.clone()).normalize();
    moveDirection.multiplyScalar(speed);
    body.linearVelocity.x = moveDirection.x;
    body.linearVelocity.y = -1;
    body.linearVelocity.z = moveDirection.z;

}


var toRad = Math.PI / 180;
function setRigidBodyManyShape(obj, adjust) {
    
    var shape = getShape({
        type: 'box',
        size: [obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]],
        position: [obj[11 + adjust], obj[12 + adjust], obj[13 + adjust]],
        rotation: [obj[14 + adjust] * toRad, obj[15 + adjust] * toRad, obj[16 + adjust] * toRad],
        density: obj[18 + adjust]
    });
    shapes.push(shape);

    //count
    manyShapeCount++;
    if (manyShapeCount == manyShapeLength) addRigidBodyManyShape(obj, adjust);
}


function addRigidBodyManyShape(obj, adjust) {
    
    var body = createRigidBody(obj, adjust, shapes, 0);

    manyShapeCount = 0;
    shapes = [];
}


function setKinematic(index) {


}



function setRigidBody(obj, adjust) {

    switch (obj[11 + adjust]) {

        case 0:
            var type = 'sphere';
            var size = [obj[5 + adjust]];
            break;

        case 1:
        case 2:
            type = 'box';
            size = [obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]];
            break;

    }


    var shape = getShape({
        type:type,
        size: size,
        density: obj[13 + adjust]
    });
    var body = createRigidBody(obj, adjust, [shape], obj[14 + adjust]);
    if (obj[15 + adjust]) playerBody = body;

}


function getShape(obj) {

    var sc = new OIMO.ShapeConfig();
    if (obj.density != 0) sc.density = obj.density;
    if (obj.position) {
        var pos = getVec3(obj.position);
        sc.relativePosition = new OIMO.Vec3(pos[0], pos[1], pos[2]);
    }
    if (obj.rotation) {
        var x = obj.rotation[0];
        var y = obj.rotation[1];
        var z = obj.rotation[2];
        sc.relativeRotation = OIMO.EulerToMatrix(x, y, z);
    }


    switch (obj.type) {

        case 'box':
        case 'cylinder':
            var s = getVec3(obj.size);
            var shape = new OIMO.BoxShape(sc, s[0], s[1], s[2]);
            break;

        case 'sphere':
            var shape = new OIMO.SphereShape(sc, obj.size[0] * OIMO.INV_SCALE);
            break;
    }


    return shape;
}

function getVec3(vec) {

    var pos = new OIMO.Vec3(vec[0], vec[1], vec[2]);
    pos.scale(pos, OIMO.INV_SCALE);
    return [pos.x, pos.y, pos.z];

}

function getRotation(rot) {

    var rot = rot.map(function (x) { return x * OIMO.TO_RAD; });
    var tmp = OIMO.EulerToAxis(rot[0], rot[1], rot[2]);

    return tmp;//tmp[0], tmp[1], tmp[2], tmp[3]
}

var  toRot = (180 / Math.PI);
//createRigidBody
function createRigidBody(obj, adjust, shapes, moveFlag) {

    var pos = getVec3([obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]]);
    //var rot = getRotation([obj[8 + adjust], obj[9 + adjust], obj[10 + adjust]]);
    var body = new OIMO.RigidBody(
        pos[0], pos[1], pos[2]/*,
        rot[0], rot[1], rot[2], rot[3]*/
        );

    var length = shapes.length;
    for (var i = 0; i < length; i++) {
        body.addShape(shapes[i]);
    }
    if (moveFlag) {
        body.setupMass(0x1, false);
        body.allowSleep = true;
    } else {
        body.setupMass(0x2, false);//第二引数にfalseを入れるのは大切。falseを入れないと
                                    //複数shapeを含むrigidBodyの原点がかならず rigidBodyの中心になってしまい
                                    //描画がおかしくなるので
    }

    dynamicsWorld.addRigidBody(body);
    


    body.moveFlag = moveFlag;
    body.deadFlag = false;
    body.forceFlag = false;
    body.setPositionFlag = false; //setPositionを実行した同フレーム内でsetLinearVelocityを実行すると、
    body.speed = 1;               //setPositionがキャンセルされてしまうのでその対策用のフラグ
    body.index = obj[1 + adjust];
    body.targetPos = new THREE.Vector3();
    if (shapes.length == 1) body.noRotFlag = obj[16 + adjust];
    

    //bodies[obj[1 + adjust]] = body;
    bodiesArray.push(body);
    bodiesArrayLength = bodiesArray.length;
    bufferArrayLength = bodiesArrayLength * 8 + 1;
    if (activeBufferArray == 1) {
        bufferArray1 = new Float32Array(bufferArrayLength);
        bufferArray1[0] = bufferArrayLength;
    } else {
        bufferArray2 = new Float32Array(bufferArrayLength);
        bufferArray2[0] = bufferArrayLength;
    }
   
    simulate();

    return body;
}




//removeすると完全に各プロパティを殺してしまう模様
function removeRigidBody(index) {
    var body = bodiesArray[index];

    dynamicsWorld.removeRigidBody(body);
    bodiesArray[index] = null;

}


function removeRigidBodies() {

    for (var i = 0; i < bodiesArrayLength; i++) {
        dynamicsWorld.removeRigidBody(bodiesArray[0]);
        delete bodiesArray[0];
        bodiesArray.splice(0, 1);
    }
    bodies = {};
    bodiesArray = [];
    bodiesArrayLength = 0;

    manyShapeCount = 0;
}

/*
function addRigidBody(index) {
    var body = bodiesArray[index];
    body.deadFlag = false;
}
*/

//addJoint({type:type, body1:bones[0], body2:bones[1], pos1:[0,0,0], pos2:[-d,0,0], axe1:[1,0,0], axe2:[1,0,0], min:10, max:20, collision:false, show:true });
//objectCatch
function objectCatch(index) {

    catchBody = bodiesArray[index];

    
    var joint = getJointToBody(catchBody, catchDummyBody, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
    
    joint.index = joints.length;
    joints.push(joint);
    jointsLength = joints.length;
    catchJointIndex = joint.index;
}


function catchMove() {

    setPosition(catchDummyBody, mousePosition.x, mousePosition.y, mousePosition.z)
    setQuaternion(catchBody.index, 0, 0, 0, 1);

}


function objectRelease() {

    jointDelete(catchJointIndex);
    resetVelocity(catchBody.index);
    catchBody = null;

}


function objectThrows() {

    jointDelete(catchJointIndex);
    catchBody = null;

}



//functions
function setPosition(index, x, y, z) {

    var body = bodiesArray[index];
    if (!body) return;

    body.setPositionFlag = true;
    setTimeout(function () {
        if (body) body.setPositionFlag = false;
    }.bind(this), 100);

    resetVelocity(index);

    body.setPosition(new THREE.Vector3(x, y, z));
}


function setQuaternion(index, x, y, z, w) {

    var body = bodiesArray[index];
    if (!body) return;

    body.setQuaternion(new THREE.Quaternion(x, y, z, w));
}



function setScale(index, size) {



}


function setRotationLimit(index, x, y, z) {

    var body = bodiesArray[index];

    //body.angularVelocity.y = 0;
    body.angularVelocity.x = x;
    body.angularVelocity.y = y;
    body.angularVelocity.z = z;

}


function resetVelocity(index) {

    var body = bodiesArray[index];

    body.linearVelocity.x = 0;
    body.linearVelocity.y = 0;
    body.linearVelocity.z = 0;
    body.angularVelocity.x = 0;
    body.angularVelocity.y = 0;
    body.angularVelocity.z = 0;

    //
    setQuaternion(index, 0, 0, 0, 1);
}


//joint function
function getJoint(body, x, y, z) {

}


function getJointToBody(body1, body2, pos1, pos2) {

    var obj = {
        type: 'jointDistance',
        body1: body1,
        body2: body2,
        pos1: pos1,
        pos2: pos2,
        axe1: [1, 0, 0],
        axe2: [1, 0, 0],
        min: 10,
        max: 20,
        collision: true,
        show: true,
        world: dynamicsWorld
    };

    return new OIMO.Link(obj);
}


function getHingeJoint(body, _pos, _vec) {//軸の位置と軸の方向

    var obj = {
        type: 'jointHinge',
        body1: body1,
        body2: body2,
        pos1: pos1,
        pos2: pos2,
        axe1: [1, 0, 0],
        axe2: [1, 0, 0],
        min: 10,
        max: 20,
        collision: true,
        show: true,
        world: dynamicsWorld
    };

    return new OIMO.Link(obj);
}


function setJointPosition(name, body, pos) {

}


function jointDelete(index) {

    var joint = joints[index];

    dynamicsWorld.removeJoint(joint);
    joint = null;

}


//render
//if (interval) clearInterval(interval);
function simulate() {

    if (!renderFlag || !bodiesArrayLength) return;


    if (catchBody) catchMove();

    dynamicsWorld.step();

    //配列の長さが変わっていたら初期化する
    if (activeBufferArray == 1) {
        if (!bufferArray1[bufferArrayLength - 1]) {
            bufferArray1 = new Float32Array(bufferArrayLength);
            bufferArray1[0] = bufferArrayLength;
        }
        simulateStep2(bufferArray1);
    } else {
        if (!bufferArray2[bufferArrayLength - 1]) {
            bufferArray2 = new Float32Array(bufferArrayLength);
            bufferArray2[0] = bufferArrayLength;
        }
        simulateStep2(bufferArray2);
    }

}


function simulateStep2(bufferArray) {

    //moveFlagの立っているrigidBodyのみthree.jsのmeshを動かすようにする。
    //複数のshapeを含むrigidBodyは原点の位置が必ず各shapeの中心になってしまうので
    //Object3Dにまとめられたmeshなどを照らし合わせたときにおかしくなる。
    for (var i = 0; i < bodiesArrayLength; i++) {

        var index = i * 8 + 1;
        if (bodiesArray[i]) {//rigidBodyがnullじゃなかったら

            if (bodiesArray[i].moveFlag) {

                bufferArray[index] = bodiesArray[i].index;
                var pos = bodiesArray[i].getPosition();
                bufferArray[index + 1] = pos.x;
                bufferArray[index + 2] = pos.y;
                bufferArray[index + 3] = pos.z;

                if (bodiesArray[i].noRotFlag) {
                    bufferArray[index + 4] = 0;
                    bufferArray[index + 5] = 0;
                    bufferArray[index + 6] = 0;
                    bufferArray[index + 7] = 1;
                } else {
                    var q = bodiesArray[i].getQuaternion();
                    bufferArray[index + 4] = q.x;
                    bufferArray[index + 5] = q.y;
                    bufferArray[index + 6] = q.z;
                    bufferArray[index + 7] = q.w;
                }

            } else {
                bufferArray[index] = -1;
            }

        } else {
            bufferArray[index] = -1;
        }

    }

}


function readMessage(obj) {

    var setLinearVelocitys = {};
    var messagesLength = obj[0] / 21;


    var adjust = 1;
    for (var i = 0; i < messagesLength; i++) {
        

        var index = obj[1 + adjust];    //bodyIndex
        switch (obj[0 + adjust]) {

            case 0://'init':
                break;

            case 1://'setMousePosition':
                mousePosition.set(index, obj[2 + adjust], obj[3 + adjust]);
                break;

            case 2://'setTargetPosition':
                bodiesArray[index].targetPos.set(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                break;

            case 3://'setReverseFlag':
                if (index == 1) {
                    reverseFlag = true;
                } else {
                    reverseFlag = false;
                }
                break;

            case 4://'setSpeed':
                bodiesArray[index].speed = obj[2 + adjust];
                break;

            case 5://'setRigidBodyManyShape':
                manyShapeLength = obj[17 + adjust];
                setRigidBodyManyShape(obj, adjust);
                break;

            case 6://'setRigidBody':
                setRigidBody(obj, adjust);
                break;

            case 7://'setKinematic':
                setKinematic(index);
                break;

            case 8://'setCollision':
                break;

            case 9://'objectCatch':
                objectCatch(obj[1, adjust]);
                break;

            case 10://'objectRelease':
                objectRelease();
                break;

            case 11://'objectThrows':
                objectThrows();
                break;

            case 12://'setPosition':
                setPosition(index, obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                break;

            case 13://'setQuaternion':
                setQuaternion(index, obj[2 + adjust], obj[3 + adjust], obj[4 + adjust], obj[5 + adjust]);
                break;

            case 14://'setScale':
                setScale(index, obj[2 + adjust]);
                break;

            case 15://'setJointToBody':
                var pos1 = new THREE.Vector3(obj[4 + adjust], obj[5 + adjust], obj[6 + adjust]);
                var pos2 = new THREE.Vector3(obj[7 + adjust], obj[8 + adjust], obj[9 + adjust]);
                var body1 = bodiesArray[obj[2 + adjust]];
                var body2 = bodiesArray[obj[3 + adjust]];
                var joint = getJointToBody(body1, body2, pos1, pos2)
                joint.index = index;
                joints.push(joint);
                jointsLength = joints.length;
                break;

            case 16://'setHingeJoint':
                var pos = new THREE.Vector3(obj[3 + adjust], obj[4 + adjust], obj[5 + adjust]);
                var vec = new THREE.Vector3(obj[6 + adjust], obj[7 + adjust], obj[8 + adjust]);
                var body = bodiesArray[index];
                var joint = getHingeJoint(body, pos, vec);
                joint.index = obj[2 + adjust];
                joints.push(joint);
                jointsLength = joints.length;
                break;

            case 17://'jointDelete':
                jointDelete(index);
                break;

            case 18://'setForceFlag':
                if (obj[2 + adjust]) {
                    bodiesArray[index].forceFlag = true;
                    resetVelocity(index);
                } else {
                    bodiesArray[index].forceFlag = false;
                }
                break;

            case 19://'setRotationLimit':
                setRotationLimit(index, obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                break;

            case 20://'setMassProps':
                var body = bodiesArray[index];
                body.mass = obj[2 + adjust];
                break;

            case 21://'removeRigidBody':
                removeRigidBody(index);
                break;

            case 22://'removeRigidBodies':
                removeRigidBodies();
                break;

            case 23://'addRigidBody':
                //addRigidBody(index);
                break;

            case 24://'setLinearVelocity':
                
                if (bodiesArray[index] && !setLinearVelocitys[index]) {
                    setLinearVelocitys[index] = 1;
                    bodiesArray[index].targetPos.set(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                    bodiesArray[index].speed = obj[5 + adjust];
                    setLinearVelocity(index);
                }
                break;

            case 25://'applyImpulse':
                var applyImpulseIndex = index;
                var strength = obj[8 + adjust];
                var pos = new THREE.Vector3(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                var impulseTargetPos = new THREE.Vector3(obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]);
                var impulseForce = pos.clone().sub(impulseTargetPos).normalize().multiplyScalar(strength).negate();
                var applyImpulseFlag = 1;
                break;

            case 26://'resetVelocity':
                resetVelocity(index);
                break;

            case 27://'stop':
                //renderFlag = false;
                break;

            case 28://'start':
                renderFlag = true;
                break;

        }

        adjust += 21;
    }

    if (applyImpulseFlag) {
        bodiesArray[applyImpulseIndex].applyImpulse(impulseTargetPos, impulseForce);
    }


}



//worker message
self.onmessage = function (event) {

    var data = event.data;


    if (!abTestCompFlag) {
        abTestCompFlag = true;
        return;
    }


    if (data.type) {

        if (data.type == 'init') {

            browser = data.browser;
            platform = data.platform;
            if (platform != 'pc') {
                fps = 32;
                worldStep = 4;
            }
            interval = setInterval(simulate, fps); //16 = 1000 / 60
            if (data.supportTransFerable) SUPPORT_TRANSFERABLE = true;
            libInit();
            init();
            transferableMessage({ type: 'initComp' });

        }

    } else {

        if (data.message && data.message[0] != 0) {
            readMessage(data.message);
        }

        dataCash = data;
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
