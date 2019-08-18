
'use strict'

var abTestCompFlag = false;
var SUPPORT_TRANSFERABLE = false;
var transferableMessage = self.webkitPostMessage || self.postMessage;

var platform = 'pc';

var asmFlag = true;

var deltaTime = 1 / 30;
var fps = 32;



var renderFlag = true;


function libInit() {

    //http://cx20.hatenablog.com/entry/2014/06/28/235423
    //http://jsrun.it/assets/k/Z/b/G/kZbGI
    //cannon.jsはバージョンによって複合シェイプまわりにバグが存在するらしく、
    //rigidBodyをremoveした際に関係のないrigidBodyがremoveされてしまうバグがおきていた。
    //上記のサイトのバージョンのcannnon.jsは安定しているようなので、それを使う。
    importScripts('cannon0.4.3.js');
    importScripts('three.min.js');

}


//
var interval = null;
var dynamicsWorld;

var characterMaterial;
var groundMaterial;

function init() {

    dynamicsWorld = new CANNON.World();
    dynamicsWorld.gravity.set(0, -10, 0);
    dynamicsWorld.broadphase = new CANNON.NaiveBroadphase();

    mousePosition = new THREE.Vector3();
    
    var shape = getShape({
        type: 'sphere',
        size: [1]
    });
    catchDummyBody = new CANNON.RigidBody(1, shape);
    catchDummyBody.position.set(0, 50, 0);
    dynamicsWorld.add(catchDummyBody);
    
    compoundShape = new CANNON.Compound();

    characterMaterial = new CANNON.Material();
    groundMaterial = new CANNON.Material();
    var contactMaterial = new CANNON.ContactMaterial(
                                    groundMaterial,
                                    characterMaterial,
                                    0.0,      //摩擦
                                    0.0    //バネ
                                );
    dynamicsWorld.addContactMaterial(contactMaterial);

}






var group1 = 1;
var group2 = 2;

var mousePosition;

var playerBody;

var groundBodies = [];
var groundBodiesLength = 0;
var compoundShape;
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

var fromMessages = [];
var fromMessagesLength = 0;

var joints = [];
var jointsLength = 0;




function setLinearVelocity(index) {

    var body = bodiesArray[index];
    if (!body || body.setPositionFlag) return;

    var pos = body.position;
    pos = new THREE.Vector3(pos.x, pos.y, pos.z);
    var a = body.targetPos.clone();
    a.y = 0;
    var b = pos.clone();
    b.y = 0;
    var distance = a.distanceTo(b);


    //setLinearVelocity
    var speed = body.speed;
    var moveDirection = a.clone().sub(b.clone()).normalize();
    moveDirection.multiplyScalar(speed);
    body.velocity.x = moveDirection.x;  //velocity.yに-10をしているとなぜか表示が大きくバグることがあったので注意
    body.velocity.z = moveDirection.z;
    
}


var toRad = Math.PI / 180;
function setRigidBodyManyShape(obj, adjust) {

    var shape = getShape({
        type: 'box',
        size: [obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]]
    });

    var pos = new CANNON.Vec3(obj[12 + adjust], obj[13 + adjust], obj[14 + adjust]);
    var q = new CANNON.Quaternion(obj[15 + adjust], obj[16 + adjust], obj[17 + adjust], obj[18 + adjust]);
    compoundShape.addChild(shape, pos, q);

    //count
    manyShapeCount++;
    if (manyShapeCount == manyShapeLength) addRigidBodyManyShape(obj, adjust);
}


function addRigidBodyManyShape(obj, adjust) {

    var body = createRigidBody(obj, adjust, compoundShape, 0, groundMaterial, 0, false);
    
    compoundShape = new CANNON.Compound();
    manyShapeCount = 0;

}


function setKinematic(index) {


}



function setRigidBody(obj, adjust) {

    switch (obj[12 + adjust]) {

        case 0:
            var shape = getShape({
                type: 'sphere',
                size: [obj[5 + adjust]]
            });
            break;

        case 1:
            shape = getShape({
                type: 'box',
                size: [obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]]
            });
            break;


        case 2:
            shape = getShape({
                type: 'cylinder',
                size: [obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]]
            });
            break;

    }

    var body = createRigidBody(obj, adjust, shape, obj[14 + adjust], characterMaterial, obj[16 + adjust], true);
    if (obj[15 + adjust]) playerBody = body;

}


function getShape(obj) {

    switch (obj.type) {

        case 'box':
            var shape = new CANNON.Box(new CANNON.Vec3(
                obj.size[0] * .5,
                obj.size[1] * .5,
                obj.size[2] * .5
                ));
            break;

        case 'cylinder':
            shape = new CANNON.Cylinder(
                obj.size[0] * .5,
                obj.size[2] * .5,
                obj.size[1],
                5
                );
            break;

        case 'sphere':
            shape = new CANNON.Sphere(obj.size[0] * .5);
            break;
    }


    return shape;
}


var  toRot = (180 / Math.PI);
//createRigidBody
function createRigidBody(obj, adjust, shape, mass, material, noRotateFlag, singleShapeFlag) {
    /*
    if (mass == 0) {
        var type = CANNON.Body.STATIC;
    } else {
        type = CANNON.Body.DYNAMIC;
    }*/
    var body = new CANNON.RigidBody(mass, shape, material);
    body.position.set(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
    body.quaternion.set(obj[8 + adjust], obj[9 + adjust], obj[10 + adjust], obj[11 + adjust]);
    body.angularVelocity.set(0,0,0);
    dynamicsWorld.add(body);
    

    body.allowSleep = false;  //眠らない
    body.noRotateFlag = noRotateFlag;
    if (noRotateFlag) {
        body.invInertia.set(0, 0, 0);
    }

    body.moveFlag = mass;
    body.deadFlag = false;
    body.forceFlag = false;
    body.setPositionFlag = false; //setPositionを実行した同フレーム内でsetLinearVelocityを実行すると、
    body.speed = 1;               //setPositionがキャンセルされてしまうのでその対策用のフラグ
    body.index = obj[1 + adjust];
    body.targetPos = new THREE.Vector3();
    body.shapeId = -1;
    if (singleShapeFlag)  body.shapeId = obj[12 + adjust];

    

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

    dynamicsWorld.remove(body);
    bodiesArray[index] = null;

}


function removeRigidBodies() {

    for (var i = 0; i < bodiesArrayLength; i++) {
        dynamicsWorld.remove(bodiesArray[0]);
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

    
    var joint = getJointToBody(catchBody, catchDummyBody, new THREE.Vector3(0, 0, 0));
    
    joint.index = joints.length;
    joints.push(joint);
    jointsLength = joints.length;
    catchJointIndex = joint.index;
    dynamicsWorld.addConstraint(joint);
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

    body.position.set(x, y, z);
}


function setQuaternion(index, x, y, z, w) {

    var body = bodiesArray[index];
    if (!body) return;

    body.quaternion.set(x, y, z, w);
}



function setScale(index, size) {

    //cannon.jsではrigidBodyやshapeのスケールを後で変えれない為、rigidBodyを作り直す

    var body = bodiesArray[index];

    switch (body.shapeId) {

        case 0:
            var shape = getShape({
                type: 'sphere',
                size: [size.x]
            });
            break;

        case 1:
        case 2:
            shape = getShape({
                type: 'box',
                size: [size.x, size.y, size.z]
            });
            break;

    }

    var obj = getBodyProperty(index);

    dynamicsWorld.remove(body);
    body = new CANNON.RigidBody(obj.mass, shape);
    bodiesArray[index] = body;
    dynamicsWorld.add(body);

    setBodyProperty(index, obj);

}


function getBodyProperty(index) {

    var body = bodiesArray[index];

    var obj = {};
    obj.mass = body.mass;
    obj.noRotateFlag = body.noRotateFlag;
    obj.moveFlag = body.moveFlag;
    obj.deadFlag = body.deadFlag;
    obj.forceFlag = body.forceFlag;
    obj.setPositionFlag = body.setPositionFlag;
    obj.speed = body.speed;
    obj.index = body.index;
    obj.targetPos = body.targetPos;
    obj.shapeId = body.shapeId;
    obj.pos = body.position;
    obj.q = body.quaternion;

    return obj;

}


function setBodyProperty(index, obj) {

    var body = bodiesArray[index];

    body.position.set(obj.pos.x, obj.pos.y, obj.pos.z);
    body.quaternion.set(obj.q.x, obj.q.y, obj.q.z, obj.q.w);
    body.noRotateFlag = obj.noRotateFlag;
    if (obj.noRotateFlag) {
        body.invInertia.set(0, 0, 0);
    }
    body.moveFlag = obj.moveFlag;
    body.deadFlag = obj.deadFlag;
    body.forceFlag = obj.forceFlag;
    body.setPositionFlag = obj.setPositionFlag;
    body.speed = obj.speed;
    body.index = obj.index;
    body.targetPos = obj.targetPos;
    body.shapeId = obj.shapeId;

}



function setRotationLimit(index, x, y, z) {

    var body = bodiesArray[index];

    
}


function resetVelocity(index) {

    var body = bodiesArray[index];

    body.velocity.set(0,0,0);
    body.angularVelocity.set(0,0,0);

    //
    setQuaternion(index, 0, 0, 0, 1);
}


//joint function
function getJoint(body, x, y, z) {

}


function getJointToBody(body1, body2, pos1) {

    var v1 = new CANNON.Vec3(pos1.x, pos1.y, pos1.z).vsub(body1.position);
    var antiRot = body1.quaternion.inverse();
    var pivot = antiRot.vmult(v1);

    return new CANNON.PointToPointConstraint(body1, pivot, body2, new CANNON.Vec3(0, 0, 0));
    
}


function getHingeJoint(body1, body2) {

    return new CANNON.HingeConstraint(body1, body2);

}


function setJointPosition(name, body, pos) {

}


function jointDelete(index) {

    var joint = joints[index];

    dynamicsWorld.removeConstraint(joint);
    joint = null;

}


//render
//if (interval) clearInterval(interval);
function simulate() {

    if (!renderFlag || !bodiesArrayLength) return;


    if (catchBody) catchMove();

    dynamicsWorld.step(deltaTime);

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
                var pos = bodiesArray[i].position;
                bufferArray[index + 1] = pos.x;
                bufferArray[index + 2] = pos.y;
                bufferArray[index + 3] = pos.z;

                var q = bodiesArray[i].quaternion;
                bufferArray[index + 4] = q.x;
                bufferArray[index + 5] = q.y;
                bufferArray[index + 6] = q.z;
                bufferArray[index + 7] = q.w;
                

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
                manyShapeLength = obj[19 + adjust];
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
                setScale(index, new THREE.Vector3(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]));
                break;

            case 15://'setJointToBody':
                var pos1 = new THREE.Vector3(obj[4 + adjust], obj[5 + adjust], obj[6 + adjust]);
                var body1 = bodiesArray[obj[2 + adjust]];
                var body2 = bodiesArray[obj[3 + adjust]];
                var joint = getJointToBody(body1, body2, pos1);
                joint.index = index;
                joints.push(joint);
                jointsLength = joints.length;
                dynamicsWorld.addConstraint(joint);
                break;

            case 16://'setHingeJoint':
                var body1 = bodiesArray[index];
                var body2 = bodiesArray[obj[2 + adjust]];
                var joint = getHingeJoint(body1, body2);
                joint.index = obj[3 + adjust];
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
                body.updateMassProperties();
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

                if (!setLinearVelocitys[index]) {
                    setLinearVelocitys[index] = 1;
                    bodiesArray[index].targetPos.set(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                    bodiesArray[index].speed = obj[5 + adjust] * 2;
                    setLinearVelocity(index);
                }
                break;

            case 25://'applyImpulse':
                var applyImpulseIndex = index;
                var strength = obj[8 + adjust] * 45;
                var pos = new THREE.Vector3(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                var impulseTargetPos = new THREE.Vector3(obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]);
                var impulseForce = pos.clone().sub(impulseTargetPos).normalize().multiplyScalar(strength).negate();
                impulseTargetPos = new CANNON.Vec3(impulseTargetPos.x, impulseTargetPos.y, impulseTargetPos.z);
                impulseForce = new CANNON.Vec3(impulseForce.x, impulseForce.y, impulseForce.z);
                var applyImpulseFlag = 1;
                break;

            case 26://'resetVelocity':
                resetVelocity(index);
                break;

            case 27://'stop':
                renderFlag = false;
                break;

            case 28://'start':
                renderFlag = true;
                break;

        }

        adjust += 21;
    }

    if (applyImpulseFlag) {
        bodiesArray[applyImpulseIndex].applyImpulse(impulseTargetPos, impulseForce, deltaTime);
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

            platform = data.platform;
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
