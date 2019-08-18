module OimoManager {


    var physicsWorker: any;
    var ab: Float32Array = new Float32Array(1);
    var SUPPORT_TRANSFERABLE: boolean = false;
    var catchMessageFlag: boolean = false;

    var physicsCheckTime: number = 0;
    var maxPhysicsCheckTime: number = .5;


    var browser: number = 0; //0:othre, 1:safari, 2:ie

    //rigidBodyに連携して動くオブジェクトのみ配列に格納する
    var meshs: Array<any> = [];
    var meshsLength: number = 0;
    var jointIndex: number = 0;


    //高速化の為messagesに常に21個単位で値が入るように
    //messagesAdjust関数などを使って配列を攻勢する。
    var activeMessage: string = 'messages1';
    var messagesLength: number = 1576;  //21 * 75 + 1(length保存用)
    var messages1: Float32Array = new Float32Array(messagesLength);
    var messages2: Float32Array = new Float32Array(messagesLength);
    var messagesIndex: number = 1;


    var postMessageFps = 0;
    var postMessageLastTime = 0;
    var postMessageDelta = 0;



    export function init(callBackFunc: Function) {

        initMessages(messages1);
        initMessages(messages2);



        // Worker
        if (!physicsWorker) physicsWorker = new Worker('js/oimoWorker.js');
        physicsWorker.transferableMessage = physicsWorker.webkitPostMessage || physicsWorker.postMessage;

        ab[0] = -1;
        physicsWorker.transferableMessage(ab, [ab.buffer]);
        if (ab.length === 0) {
            SUPPORT_TRANSFERABLE = true;
        }

        physicsWorker.onmessage = function (event) {

            catchMessageFlag = true;

            var data = event.data;

            if (data.type) {
                switch (data.type) {
                    case 'workerScriptLoadComp':
                        var ua = window.navigator.userAgent.toLowerCase();
                        if (ua.indexOf('chrome') != -1) {
                        } else if (ua.search(/iPhone/) != -1 ||
                            ua.search(/iPad/) != -1 ||
                            ua.search(/safari/) != -1) {
                            browser = 1;
                        }
                        if (ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1) browser = 2;

                        var supportFlag: number = 0;
                        if (SUPPORT_TRANSFERABLE) supportFlag = 1;
                        physicsWorker.transferableMessage({
                            type: 'init',
                            browser: browser,
                            supportTransFerable: supportFlag,
                            platform: platform
                        });
                        break;

                    case 'initComp':
                        post(null);
                        callBackFunc();
                        animate();
                        break;
                }



            } else {

                var workerData: Float32Array = data.worker;
                for (var i: number = 1; i < workerData[0]; i += 8) {
                    if (meshs[workerData[i]]) {//meshとrigidBodyがあれば
                        meshs[workerData[i]].position.set(workerData[i + 1], workerData[i + 2], workerData[i + 3]);
                        meshs[workerData[i]].quaternion.set(workerData[i + 4], workerData[i + 5], workerData[i + 6], workerData[i + 7]);
                    }
                }

                post(data);
            }


            //fps
            /*var postMessageTime = Date.now();
            postMessageDelta = postMessageTime - postMessageLastTime;
            postMessageLastTime = postMessageTime;

            postMessageFps = Math.floor(1000 / postMessageDelta);
            if (DomManager.debug) DomManager.debug.html('postMessageFps : ' + postMessageFps);
            */

        };

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
                physicsWorker.transferableMessage(data, [data.message.buffer, data.worker.buffer]);
            } else {
                data = { message: sendMessage };
                physicsWorker.transferableMessage(data, [data.message.buffer]);
            }
        } else {
            physicsWorker.transferableMessage(data); //ieは引数がないとバグる
        }

    }


    function initMessages(messages: Float32Array): void {

        messages[0] = 0;
        messagesIndex = 1;

    }


    function setMessages(array: Array<number>): void {
        //array = array.length, eventId, property0, property1, proerty2...

        if (activeMessage == 'messages1') {
            var messages: Float32Array = messages1;
        } else {
            messages = messages2;
        }

        var max: number = messagesIndex + array[0] - 1;
        var count: number = 1;
        for (var i: number = messagesIndex; i < max; i++) {
            messages[i] = array[count];
            count++;
        }

        messagesIndex += 21;

        messages[0] = messagesIndex - 1;

    }



    export function setTargetPosition(index: number, pos: THREE.Vector3): void {

        setMessages([6, 2, index, pos.x, pos.y, pos.z]);

    }


    export function setReverseFlag(reverseFlag: boolean): void {

        var flag: number = 1;
        if (!reverseFlag) flag = 0;

        setMessages([3, 3, flag]);


    }


    export function setSpeed(index: number, speed: number): void {

        setMessages([4, 4, index, speed]);


    }


    export function setRigidBodyManyShape(rigidMeshs: Array<THREE.Mesh>, moveObject: any, bodyName: string, mass: number): number {

        var index: number = meshsLength;

        var length: number = rigidMeshs.length;
        for (var i: number = 0; i < length; i++) {
            var mesh: THREE.Mesh = rigidMeshs[i];
            var array: Array<number> = [20, 5, index];//0, 1
            setPosArray(moveObject, array);//2, 3, 4
            setSizeArray(mesh, array);//5, 6, 7
            setRotationArray(moveObject, array);//8, 9, 10
            setPosArray(mesh, array);//11, 12, 13
            setRotationArray(mesh, array);//14, 15, 16
            array.push(length);//17
            array.push(mass);//18
            //console.log(array[15] + ", " + array[16] + ", " + array[17]);

            setMessages(array);
        }


        meshs.push(moveObject);
        meshsLength = meshs.length;

        return index;
    }


    export function setRigidBody(rigidMesh: THREE.Mesh, moveObject: THREE.Object3D, bodyName: string, shapeType: string, groupNo: number, mass: number, noRotFlag:boolean): number {

        var shapeId: number = 0;
        switch (shapeType) {

            case 'sphere':
                shapeId = 0;
                break;

            case 'box':
                shapeId = 1;
                break;

            case 'cylinder':
                shapeId = 2;
                break;

        }

        var index: number = meshsLength;

        var array: Array<number> = [18, 6, index];//0, 1,
        setPosArray(moveObject, array);// 2, 3, 4,
        setSizeArray(rigidMesh, array);// 5, 6, 7,
        setRotationArray(moveObject, array);// 8, 9, 10
        array.push(shapeId);// 11,
        array.push(groupNo); // 12,
        array.push(mass); // 13

        var moveFlag: number = 1;
        if (mass == 0) moveFlag = 0;
        array.push(moveFlag); // 14

        if (bodyName == 'player') {
            array.push(1); // 15
        } else {
            array.push(0);
        }

        var _noRotFlag: number = 0;
        if (noRotFlag) _noRotFlag = 1;
        array.push(_noRotFlag); //16

        setMessages(array);

        meshs.push(moveObject);
        meshsLength = meshs.length;

        return index;
    }



    export function setKinematic(index: number): void {

        setMessages([3, 7, index]);


    }




    export function setCollision(rigidMeshs: Array<THREE.Mesh>): void {



    }


    export function objectCatch(index: number): void {

        setMessages([3, 9, index]);

    }

    export function objectRelease(): void {

        setMessages([2, 10]);

    }

    export function objectThrows(): void {

        setMessages([2, 11]);

    }

    export function setPosition(index: number, pos: THREE.Vector3): void {

        setMessages([
            6,
            12,
            index,
            pos.x, pos.y, pos.z
        ]);

    }


    export function setQuaternion(index: number, q: THREE.Quaternion): void {

        setMessages([
            7,
            13,
            index,
            q.x, q.y, q.z, q.w
        ]);

    }


    export function setScale(index: number, scale: number): void {

        setMessages([
            4,
            14,
            index,
            scale
        ]);

    }


    export function setJointToBody(index1: number, index2: number, pos1: THREE.Vector3, pos2: THREE.Vector3): number {

        jointIndex++;

        setMessages([
            11,
            15,
            jointIndex,
            index1,
            index2,
            pos1.x, pos1.y, pos1.z,
            pos2.x, pos2.y, pos2.z
        ]);

        return jointIndex;
    }


    export function setHingeJoint(index: number, pos: THREE.Vector3, vec: THREE.Vector3): number {

        jointIndex++;

        setMessages([
            10,
            16,
            index,
            jointIndex,
            pos.x, pos.y, pos.z,
            vec.x, vec.y, vec.z
        ]);

        return jointIndex;
    }


    export function jointDelete(jointIndex: number): void {

        setMessages([
            3,
            17,
            jointIndex
        ]);

    }


    export function setForceFlag(index: number, _flag: boolean): void {

        var flag: number = 0;
        if (_flag) flag = 1;

        setMessages([
            4,
            18,
            index,
            flag
        ]);

    }


    export function setRotationLimit(index: number, vec: THREE.Vector3): void {

        setMessages([
            6,
            19,
            index,
            vec.x, vec.y, vec.z
        ]);

    }


    export function setMassProps(index: number, mass: number): void {

        setMessages([
            4,
            20,
            index,
            mass
        ]);

    }

    //削除する場合はmeshsにnullを代入する
    //すべてのrigidBodyを削除する時以外は配列meshsをリセットすることはない
    //spliceするとindex位置にずれが生じるので使わない
    export function removeRigidBody(moveTarget: any): void {

        if (moveTarget.rigidBodyIndex == -1) return;

        var index: number = moveTarget.rigidBodyIndex;
        meshs[moveTarget.rigidBodyIndex] = null;
        moveTarget.rigidBodyIndex = -1;
        moveTarget.rigidFlag = false;

        setMessages([3, 21, index]);

    }


    export function removeRigidBodies(): void {

        setMessages([2, 22]);

        var length: number = meshs.length;
        for (var i: number = 0; i < length; i++) {
            meshs[0].rigidBodyIndex = -1;
            meshs[0].rigidFlag = false;
            meshs.splice(0, 1);
        }
        meshs = [];

    }

    /*
    export function addRigidBody(index: number): void {
    
        setMessages([3, 23, index]);
    
    }
*/

    export function setLinearVelocity(index: number, targetPos: THREE.Vector3, speed: number): void {

        setMessages([7, 24, index, targetPos.x, targetPos.y, targetPos.z, speed]);

    }


    export function applyImpulse(index: number, pos: THREE.Vector3, targetPos: THREE.Vector3, strength: number): void {

        setMessages([
            10,
            25,
            index,
            pos.x, pos.y, pos.z,
            targetPos.x, targetPos.y, targetPos.z,
            strength
        ]);

    }


    export function resetVelocity(index: number): void {

        setMessages([
            3,
            26,
            index
        ]);

    }


    export function stop(): void {

        setMessages([2, 27]);

    }


    export function start(): void {

        setMessages([2, 28]);

    }


    //
    function setSizeArray(mesh: any, array: Array<number>): void {

        var size: THREE.Vector3 = MeshManager.getSize(mesh);

        array.push(size.x);
        array.push(size.y);
        array.push(size.z);

    }

    function setPosArray(mesh: any, array: Array<number>): void {

        var pos: THREE.Vector3 = mesh.position.clone();

        array.push(pos.x);
        array.push(pos.y);
        array.push(pos.z);
    }

    function setQuaternionArray(mesh: any, array: Array<number>): void {

        var q: THREE.Quaternion = mesh.quaternion.clone();

        array.push(q.x);
        array.push(q.y);
        array.push(q.z);
        array.push(q.w);

    }

    function setRotationArray(mesh: any, array: Array<number>): void {

        var rot: THREE.Euler = mesh.rotation.clone();

        array.push(rot.x * Vars.toRot);
        array.push(rot.y * Vars.toRot);
        array.push(rot.z * Vars.toRot);

    }


    function animate(): void {

        //requestAnimationFrame(() => animate());

        if (Vars.jointCatchFlag) {
            /*
            messages.push([
                1,  //1:setMousePosition
                Vars.mousePosition.x,
                Vars.mousePosition.y,
                Vars.mousePosition.z
            ]);*/
        }
    }

}