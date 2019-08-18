/*

下記のようにしないのはメモリリーク対策の為
var shape = new Ammo.btBoxShape(new Ammo.btVector3(s / 2, s / 2, s / 2));

*/

'use strict'
//var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 };
//var Module = { TOTAL_STACK: 5242880, TOTAL_MEMORY: 67108864, FAST_MEMORY: 2097152 };
//http://code.playcanvas.com/ammo.3c2cc63.js

var abTestCompFlag = false;
var SUPPORT_TRANSFERABLE = false;
var transferableMessage = self.webkitPostMessage || self.postMessage;

var browser = 0;//0:othre, 1:safari, 2:ie
var platform = 'pc';

var asmFlag = true;

var deltaTime = 1;
var last = Date.now();
var fps = 32;
var worldStep = 4;



var renderFlag = true;


function libInit() {

    //ammo.js ammoAsm.jsでは存在する関数などに違いがある模様
    //ammo.js公式のものは関数が少ない。physi.jsに入っているammo.jsは関数がちゃんと用意されている。
    if (browser == 1) {
        importScripts('ammo_physijs.js');
        asmFlag = false;
    } else {
        importScripts('ammo.js');
    }


    importScripts('three.min.js');


}


//
var interval = null;
var collisionConfiguration;
var dispatcher;
var overlappingPairCache;
var solver;
var dynamicsWorld;
var gravity;

function init() {

    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    overlappingPairCache = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    gravity = new Ammo.btVector3(0, -10, 0);
    dynamicsWorld.setGravity(gravity);
    Ammo.destroy(gravity);

    mousePosition = new THREE.Vector3();


}




/*
function contactPairTest(rigid1, rigid2) {
    var callback = new Ammo.ConcreteContactResultCallback();
    var result = false;
    Ammo.customizeVTable(callback, [{
            original: Ammo.ConcreteContactResultCallback.prototype.addSingleResult,
            replacement: function(tp, cp, colObj0, partid0, index0, colObj1, partid1, index1) {
                    result = true;
                }
    }]);
    dynamicsWorld.contactPairTest(rigid1.rigidBody, rigid2.rigidBody, callback);
    Ammo.destroy(callback);
    return result;
}*/


/*
var resultCallback = new Ammo.ConcreteContactResultCallback();
resultCallback.addSingleResult = function (
    manifoldPoint,
    collisionObjectA,
    id0,
    index0,
    collisionObjectB,
    id1,
    index1
) {
    console.log("contact!");
    
    var manifold = Ammo.wrapPointer(manifoldPoint.ptr, Ammo.btManifoldPoint);
    var localPointA = manifold.get_m_localPointA();
    var localPointB = manifold.get_m_localPointB();
    
}*/


var group1 = 1;
var group2 = 2;

var mousePosition;

var playerBody;

var groundBodies = [];
var groundBodiesLength = 0;
var compoundShapes = [];
var compoundShapesIndex = 0;
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
var catchJointIndex = -1;

var activeBufferArray = 1;
var bufferArray1 = new Float32Array(1);
var bufferArray2 = new Float32Array(1);
var bufferArrayLength = 0;


var joints = [];
var jointsLength = 0;




//applyImpulse、setLinearVelocityは使える模様。そのほかは検証中
//setVelocityはたとえ代入する値がAmmo.btVector3(0, 0, 0)でもrigidBodyには力がかかり動きは停止する
function setLinearVelocity(index) {
    
    var body = bodiesArray[index];
    if (!body || body.setPositionFlag) return;

    var transform = new Ammo.btTransform();
    body.getMotionState().getWorldTransform(transform);
    var origin = transform.getOrigin();
    var pos = new THREE.Vector3(origin.x(), origin.y(), origin.z());
    if (asmFlag) Ammo.destroy(origin); //error on ammo_physijs.js


    var a = body.targetPos.clone();
    a.y = 0;
    var b = pos.clone();
    b.y = 0;
    var distance = a.distanceTo(b);
   

    /*
    //applyImpulse  //ボールを投げる時になどに使うっぽい？
    var strength = 4;
    var force = pos.clone().sub(body.targetPos).normalize().multiplyScalar(strength).negate();
    var offset = pos.clone().sub(body.targetPos).normalize();
    var ammoForce = new Ammo.btVector3(force.x, 0, force.z);
    var ammoOffset = new Ammo.btVector3(offset.x, 0, offset.z);
    body.applyImpulse(ammoForce, ammoOffset);

    Ammo.destroy(ammoForce);
    Ammo.destroy(ammoOffset);
    */

        
    //setLinearVelocity
    //var linearFactor = new Ammo.btVector3(1, 1, 1);
    //body.setLinearFactor(linearFactor);
    //Ammo.destroy(linearFactor);
    var speed = body.speed;
    var moveDirection = a.clone().sub(b.clone()).normalize();
    moveDirection.multiplyScalar(speed);
    var moveDirectionAmmo = new Ammo.btVector3(moveDirection.x, -7, moveDirection.z);
    body.setLinearVelocity(moveDirectionAmmo);
    Ammo.destroy(moveDirectionAmmo);

    /*
    //applyForce 検証中
    var strength = 5;
    var force = pos.clone().sub(body.targetPos).normalize().multiplyScalar(strength / distance).negate();
    var ammoForce = new Ammo.btVector3(force.x, 0, force.z);
    var offset = pos.clone().sub(body.targetPos);
    var ammoOffset = new Ammo.btVector3(offset.x, offset.y, offset.z);
    body.applyForce(ammoForce, ammoOffset)

    Ammo.destroy(ammoForce);
    Ammo.destroy(ammoOffset);
    */
    /*
    //applyCentralImpulse
    var strength = 1;
    var force = pos.clone().sub(body.targetPos).normalize().multiplyScalar(strength).negate();
    var ammoForce = new Ammo.btVector3(force.x, 0, force.z);
    body.applyCentralImpulse(ammoForce);
    */


    //setAngularFactor
    var angularFactor = new Ammo.btVector3(0, 0, 0);
    body.setAngularFactor(angularFactor);
    //body.setAngularVelocity(new Ammo.btVector3(0, rotY, 0));
    Ammo.destroy(angularFactor);
    
    body.getMotionState().setWorldTransform (transform);
    body.setCenterOfMassTransform(transform);


    //destroy
    Ammo.destroy(transform);

}




function setRigidBodyManyShape(obj, adjust) {

    if (!compoundShapes[compoundShapesIndex]) {
        compoundShapes[compoundShapesIndex] = new Ammo.btCompoundShape();
    }

    var size = new Ammo.btVector3(obj[5 + adjust] * .5, obj[6 + adjust] * .5, obj[7 + adjust] * .5);
    var shape = new Ammo.btBoxShape(size);
    Ammo.destroy(size);
    
    var transform = new Ammo.btTransform();
    transform.setIdentity();

    var origin = new Ammo.btVector3(obj[12 + adjust], obj[13 + adjust], obj[14 + adjust]);
    transform.setOrigin(origin);
    Ammo.destroy(origin);

    var rotation = new Ammo.btVector4(obj[15 + adjust], obj[16 + adjust], obj[17 + adjust], obj[18 + adjust]);
    transform.setRotation(rotation);
    Ammo.destroy(rotation);

    compoundShapes[compoundShapesIndex].addChildShape(transform, shape);
    Ammo.destroy(transform);


    //count
    manyShapeCount++;
    if (manyShapeCount == manyShapeLength) addRigidBodyManyShape(obj, adjust);
}


function addRigidBodyManyShape(obj, adjust) {
    //if (bodiesArray[obj[1 + adjust]]) dynamicsWorld.removeRigidBody(bodiesArray[obj[1 + adjust]]);
    var body = createRigidBody(obj, adjust, compoundShapes[compoundShapesIndex], obj[20 + adjust], true, compoundShapesIndex);
    dynamicsWorld.addRigidBody(body, group1, group1);
    
    manyShapeCount = 0;
    compoundShapesIndex++;
}


function setKinematic(index){

    //回転できるように
    //ttp://www.continuousphysics.com/Bullet/BulletFull/classbtCollisionObject.html
    /*
    CF_STATIC_OBJECT = 1,
    CF_KINEMATIC_OBJECT = 2,
    CF_NO_CONTACT_RESPONSE = 4,
    CF_CUSTOM_MATERIAL_CALLBACK = 8,
    CF_CHARACTER_OBJECT = 16,
    CF_DISABLE_VISUALIZE_OBJECT = 32,
    CF_DISABLE_SPU_COLLISION_PROCESSING = 64 


    #define ACTIVE_TAG 1
    #define ISLAND_SLEEPING 2
    #define WANTS_DEACTIVATION 3
    #define DISABLE_DEACTIVATION 4
    #define DISABLE_SIMULATION 5
    */

    bodiesArray[index].setCollisionFlags(bodiesArray[index].getCollisionFlags() | 2);//CF_KINEMATIC_OBJECT
    bodiesArray[index].setActivationState(4);//DISABLE_DEACTIVATION
    
}




//init collision
var collisionCount = 0;
function setCollision(obj, adjust) {

    var size = new Ammo.btVector3(obj[4 + adjust] * .5, obj[5 + adjust] * .5, obj[6 + adjust] * .5);
    var shape = new Ammo.btBoxShape(size);
    Ammo.destroy(size);
    var body = createRigidBody(obj, adjust, shape, 0, true);
    dynamicsWorld.addRigidBody(body, group1, group1);

    body.setCollisionFlags(body.getCollisionFlags() | 2);//CF_KINEMATIC_OBJECT
    body.setActivationState(4);//DISABLE_DEACTIVATION

}



function setRigidBody(obj, adjust) {
    
    var shape = getShape(obj, adjust);
    var body = createRigidBody(obj, adjust, shape, obj[14 + adjust], true);
    dynamicsWorld.addRigidBody(body, group1, group1);
    if (obj[15 + adjust]) playerBody = body;

}


function getShape(obj, adjust) {

    var shape;


    if (obj[12 + adjust] == 0) {
        var size = obj[5 + adjust] * .5;
    } else {
        size = new Ammo.btVector3(obj[5 + adjust] * .5, obj[6 + adjust] * .5, obj[7 + adjust] * .5);
    }
    
    switch (obj[12 + adjust]) {

        case 0://sphere
            shape = new Ammo.btSphereShape(size);
            break;

        case 1://box
            shape = new Ammo.btBoxShape(size);
            break;

        case 2://cylinder
            shape = new Ammo.btCylinderShape(size);
            break;
    }
    if (obj[12 + adjust] != 0) Ammo.destroy(size);

    return shape;
}


//get rigidbody
function createRigidBody(obj, adjust, shape, _mass, moveFlag, _compoundShapesIndex) {

    var transform = new Ammo.btTransform();
    transform.setIdentity();

    var origin = new Ammo.btVector3(obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
    transform.setOrigin(origin);
    Ammo.destroy(origin);

    var rotation = new Ammo.btVector4(obj[8 + adjust], obj[9 + adjust], obj[10 + adjust], obj[11 + adjust]);
    transform.setRotation(rotation);
    Ammo.destroy(rotation);


    var mass = _mass;
    var localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);//これがないと回転しない

    var myMotionState = new Ammo.btDefaultMotionState(transform);
    Ammo.destroy(transform);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
    Ammo.destroy(localInertia);

    var body = new Ammo.btRigidBody(rbInfo);
    Ammo.destroy(rbInfo);

    //body.name = obj.name;
    body.setSleepingThresholds(0,0);
    body.moveFlag = moveFlag;
    body.deadFlag = false;
    body.forceFlag = false;
    body.setPositionFlag = false; //setPositionを実行した同フレーム内でsetLinearVelocityを実行すると、
    body.speed = 1;               //setPositionがキャンセルされてしまうのでその対策用のフラグ
    body.index = obj[1 + adjust];
    if (_compoundShapesIndex) body.compoundShapesIndex = _compoundShapesIndex;
    body.targetPos = new THREE.Vector3();
    body.setDamping(.1, .1);
    body.setRestitution(.1);
    body.setFriction(.5);   //default .5


    //var asCollision = Ammo.castObject(body, Ammo.btCollisionObject);
    
    //bodies[obj[1 + adjust]] = body;
    bodiesArray.push(body);
    bodiesArrayLength = bodiesArray.length;

    bufferArrayLength = bodiesArrayLength * 8 + 1;
    if (activeBufferArray == 1) {
        bufferArray1 = new Float32Array(bufferArrayLength);
        bufferArray1[0] = bufferArrayLength;
    }else{
        bufferArray2 = new Float32Array(bufferArrayLength);
        bufferArray2[0] = bufferArrayLength;
    }

    simulate();

    return body;
}




//removeすると完全に各プロパティを殺してしまう模様
function removeRigidBody(index) {
    var body = bodiesArray[index];
    var shapesIndex = -1;
    if (body.compoundShapesIndex &&
        !isNaN(body.compoundShapesIndex)) {
        shapesIndex = body.compoundShapesIndex
    }
    if (shapesIndex != -1) {
        Ammo.destroy(compoundShapes[shapesIndex]);
        compoundShapes[shapesIndex] = null;
    }
    
    dynamicsWorld.removeRigidBody(body);
    Ammo.destroy(body);
    bodiesArray[index] = null;
    
}


function removeRigidBodies() {

    for (var i = 0; i < bodiesArrayLength; i++) {
        dynamicsWorld.removeRigidBody(bodiesArray[0]);
        Ammo.destroy(bodiesArray[0]);
        delete bodiesArray[0];
        bodiesArray.splice(0, 1);
    }
    bodies = {};
    bodiesArray = [];
    bodiesArrayLength = 0;

    manyShapeCount = 0;
}


function addRigidBody(index) {
    var body = bodiesArray[index];
    dynamicsWorld.addRigidBody(body);
    body.deadFlag = false;
}


//objectCatch
function objectCatch(index) {

    catchBody = bodiesArray[index];

    var vec = new Ammo.btVector3(0, 0, 0);
    catchBody.setLinearVelocity(vec);
    Ammo.destroy(vec);

    var joint = getJoint(catchBody, 0, 0, 0);
    joint.index = joints.length;
    joints.push(joint);
    jointsLength = joints.length;
    catchJointIndex = joint.index;
}


function catchMove(){

    setJointPosition('catch', catchBody, mousePosition);
    setQuaternion(catchBody.index, 0, 0, 0, 1);
    
}


function objectRelease() {

    jointDelete(catchJointIndex);
    resetVelocity(catchBody.index);
    /*setTimeout(function (index) {
        resetVelocity(index)
    }.bind(null, catchBody.index), 500);*/
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

    var transform = new Ammo.btTransform();
    body.getMotionState().getWorldTransform(transform);

    var origin = new Ammo.btVector3(x, y, z);
    transform.setOrigin(origin);
    Ammo.destroy(origin);

    body.setCenterOfMassTransform(transform);
    //body.getMotionState().setWorldTransform(transform);
    
    Ammo.destroy(transform);

}


function setQuaternion(index, x, y, z, w) {

    var body = bodiesArray[index];
    if (!body) return;

    var transform = new Ammo.btTransform();
    body.getMotionState().getWorldTransform(transform);


    var q = new Ammo.btQuaternion(
            x,
            y,
            z,
            w
        );
    transform.setRotation(q);
    Ammo.destroy(q);

    body.getMotionState().setWorldTransform(transform);
    Ammo.destroy(transform);

}



function setScale(index, size) {

    var body = bodiesArray[index];

    var sizeVec = new Ammo.btVector3(size, size, size);
    body.getCollisionShape().setLocalScaling(sizeVec);
    Ammo.destroy(sizeVec);

}


function setRotationLimit(index, x, y, z) {

    var body = bodiesArray[index];

    var angularFactor = new Ammo.btVector3(x, y, z);
    body.setAngularFactor(angularFactor);
    Ammo.destroy(angularFactor);

}


function resetVelocity(index) {

    var body = bodiesArray[index];

    var vec = new Ammo.btVector3(0, 0, 0);
    body.setLinearVelocity(vec);
    body.setAngularVelocity(vec);
    Ammo.destroy(vec);

    //
    setQuaternion(index, 0, 0, 0, 1);
}


//joint function
function getJoint(body, x, y, z) {
    var pivot0 = new Ammo.btVector3(x, y, z);
    var joint = new Ammo.btPoint2PointConstraint(body, pivot0);
    dynamicsWorld.addConstraint(joint, true);

    Ammo.destroy(pivot0);

    return joint;
}


function getJointToBody(body1, body2, pos1, pos2) {
    var pivot1 = new Ammo.btVector3(pos1.x, pos1.y, pos1.z);
    var pivot2 = new Ammo.btVector3(pos2.x, pos2.y, pos2.z);
    var joint = new Ammo.btPoint2PointConstraint(body1, body2, pivot1, pivot2);
    dynamicsWorld.addConstraint(joint, false);//つなげた同士の衝突を行わない場合はtrue

    Ammo.destroy(pivot1);
    Ammo.destroy(pivot2);

    return joint;
}


function getHingeJoint(body, _pos, _vec) {//軸の位置と軸の方向

    var pos = new Ammo.btVector3(_pos.x, _pos.y, _pos.z);
    var vec = new Ammo.btVector3(_vec.x, _vec.y, _vec.z);

    var joint = new Ammo.btConeTwistConstraint(body, pos, vec);
    dynamicsWorld.addConstraint(joint, true);

    Ammo.destroy(pos);
    Ammo.destroy(vec);

    return joint;
}


function setJointPosition(name, body, pos) {

    var joint = getJointByName(name);
    if (!joint) return;

    var pivot = new Ammo.btVector3(pos.x, pos.y, pos.z);
    joint.setPivotB(pivot);
    Ammo.destroy(pivot);

}


function jointDelete(index) {

    var joint = joints[index];

    dynamicsWorld.removeConstraint(joint);
    Ammo.destroy(joint);
    joint = null;

}


//render
//if (interval) clearInterval(interval);
function simulate() {
    
    if (!renderFlag || !bodiesArrayLength) return;


    if (catchBody) catchMove();
    /*
    var now = Date.now();
    deltaTime = now - last;
    last = now;
    */
    //ammo.js example : deltaTime, 2
    //1/60, 5
    //タイムステップ幅，最大サブステップ数
    //より安定した動作が必要なときは内でさらに時間を分割することもできる。それがサブステップである
    dynamicsWorld.stepSimulation(fps, worldStep);//.016 = 1 / 60


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
        simulateStep2( bufferArray2 );
    }
    
}


function simulateStep2(bufferArray) {
    
    for (var i = 0; i < bodiesArrayLength; i++) {

        var index = i * 8 + 1;
        if (bodiesArray[i]) {//rigidBodyがnullじゃなかったら
            var transform = new Ammo.btTransform();
            bodiesArray[i].getMotionState().getWorldTransform(transform);
            //bodiesArray[i].getCenterOfMassTransform(transform);

            bufferArray[index] = bodiesArray[i].index;
            var origin = transform.getOrigin();
            bufferArray[index + 1] = origin.x();
            bufferArray[index + 2] = origin.y();
            bufferArray[index + 3] = origin.z();
            var rotation = transform.getRotation();
            bufferArray[index + 4] = rotation.x();
            bufferArray[index + 5] = rotation.y();
            bufferArray[index + 6] = rotation.z();
            bufferArray[index + 7] = rotation.w();

            Ammo.destroy(transform);
        } else {
            bufferArray[index] = -1;
            bufferArray[index + 1] = 0;
            bufferArray[index + 2] = 0;
            bufferArray[index + 3] = 0;
            bufferArray[index + 4] = 0;
            bufferArray[index + 5] = 0;
            bufferArray[index + 6] = 0;
            bufferArray[index + 7] = 0;
        }


        /*
        dynamicsWorld.performDiscreteCollisionDetection();
        dynamicsWorld.contactTest(
            bodiesArray[i],
            resultCallback
        );
        dynamicsWorld.contactPairTest(groundBody, bodiesArray[i], resultCallback);
        */
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
                setCollision(obj, adjust);
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
                return; //asm対応版ammo.jsはヒンジジョイントがまだ実装されていない
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
                    var vec = new Ammo.btVector3(0, 0, 0);
                    bodiesArray[index].setLinearVelocity(vec); //慣性を一度リセット
                    bodiesArray[index].setAngularVelocity(vec);
                    Ammo.destroy(vec);
                } else {
                    bodiesArray[index].forceFlag = false;
                }
                break;

            case 19://'setRotationLimit':
                setRotationLimit(index, obj[2 + adjust], obj[3 + adjust], obj[4 + adjust]);
                break;

            case 20://'setMassProps':
                var vec = new Ammo.btVector3(1, 1, 1);
                var body = bodiesArray[index];
                body.setMassProps(obj[2 + adjust], vec);
                Ammo.destroy(vec);
                break;

            case 21://'removeRigidBody':
                removeRigidBody(index);
                break;

            case 22://'removeRigidBodies':
                removeRigidBodies();
                break;

            case 23://'addRigidBody':
                addRigidBody(index);
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
                var targetPos = new THREE.Vector3(obj[5 + adjust], obj[6 + adjust], obj[7 + adjust]);
                var force = pos.clone().sub(targetPos).normalize().multiplyScalar(strength).negate();
                var offset = pos.clone().sub(targetPos).normalize();
                var ammoForce = new Ammo.btVector3(force.x, force.y, force.z);
                var ammoOffset = new Ammo.btVector3(offset.x, force.y, offset.z);
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
        bodiesArray[applyImpulseIndex].applyImpulse(ammoForce, ammoOffset);
        Ammo.destroy(ammoForce);
        Ammo.destroy(ammoOffset);
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
