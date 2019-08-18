module Move.flip {

    var downFlag: boolean = false;
    var index: number = -1;

    var flipCheckObjDefaultPos: THREE.Vector3 = new THREE.Vector3(0, 0, 15);

    var flipDist: number = 40;


    export var objects:Array<any> = [];
    var objectsLength: number = 0;

    var initFlag: boolean = false;



    export function init(target:any, callBack:Function) {

        //add flipCheckObj
        var flipCheckObj: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(.5, 3, 3), new THREE.MeshBasicMaterial({ wireframe: true, visible: false }));
        flipCheckObj.position.copy(flipCheckObjDefaultPos.clone());
        target.add(flipCheckObj);


        var name: string = target.name;
        objects[objectsLength] = {};
        objects[objectsLength].name = name;
        objects[objectsLength].target = target;
        objects[objectsLength].flipCheckObj = flipCheckObj;
        objects[objectsLength].rotateDir = new THREE.Vector3();
        objects[objectsLength].lastRotY = 0;
        objects[objectsLength].groundRot = new THREE.Vector3();
        objects[objectsLength].targetRot = new THREE.Vector3();
        objects[objectsLength].targetRotDefault = new THREE.Vector3();
        objects[objectsLength].callBack = callBack;
        target.flipIndex = objectsLength;
        objectsLength = objects.length;
        

        if (!initFlag) {
            initFlag = true;
            //Vars.pushMouseDownFunc(mouseDown.bind(this));
            //Vars.pushMouseUpFunc(mouseUp.bind(this));
            
            //flipAnimate();
            Vars.setAnimateFunc(flipAnimate.bind(this));
        }
    }



    //-------------------------mouse event-------------------------
    export function mouseDown(_index:number): void {

        if (_index == -1) return;
        index = _index;

        downFlag = true;

        var pos: THREE.Vector3 = Vars.mousePosition.clone().sub( objects[index].target.position.clone() );
        Vars.downDirection = ThreeManager.getXZDirection(pos);
        //for (var i: number = 0; i < objectsLength; i++) {
        objects[index].rotateDir = new THREE.Vector3(Vars.downDirection.z, 0, -Vars.downDirection.x);
        objects[index].lastRotY = objects[index].targetRot.y;
        //}
    }


    export function mouseUp(): void {

        downFlag = false;

    }


    function flipAnimate(): void {

        //requestAnimationFrame(() => flipAnimate());

        if (index == -1) return;
        /*
        //名前にgroundが入っていないdownTargetはreturn
        if (RaycastManager.downTarget) {
            var name: string = RaycastManager.downTarget.name;
            if (name.indexOf('ground') == -1) return;
        }*/

        //for (var i: number = 0; i < objectsLength; i++) {
        var nowObject: any = objects[index];
        if (!nowObject) return;

        if (nowObject.reverseAnimationFlag) {
            reverseAnimation(nowObject);
        } else {
            if (downFlag) {
                if (Vars.mouseDragDistX < Vars.mouseDragDistY) {
                    dragRotXZ(nowObject);
                } else {
                    //dragRotY(nowObject);
                }
            } else {
                returnDefaultRot(nowObject);
            }
        }

        Vars.groundUp = nowObject.target.localToWorld(new THREE.Vector3(0, 1, 0));
        Vars.groundRot.copy(nowObject.groundRot);
        //}
    }



    //ドラッグしたときの地面の縦回転
    function dragRotXZ(nowObject:any): void {

        var rot: number = Vars.mouseDragOffsetY;
        if (Vars.mouseDragDistY > flipDist) {
            reverse(nowObject, rot);
        } else {
            var absX = Math.abs(nowObject.rotateDir.x);
            var absZ = Math.abs(nowObject.rotateDir.z);
            if (absX) {
                nowObject.targetRot.x = rot * nowObject.rotateDir.x * Vars.delta * 40 + nowObject.targetRotDefault.x;
            } else if (absZ) {
                var adjust: number = flipCheck(nowObject);
                nowObject.targetRot.z = rot * adjust * nowObject.rotateDir.z * Vars.delta * 40 + nowObject.targetRotDefault.z;
            }
            rotate(nowObject, 10);
        }


    }


    //ドラッグしたときの地面の横回転
    function dragRotY(nowObject:any): void {

        nowObject.targetRot.y = nowObject.lastRotY + Vars.mouseDragOffsetX * Vars.delta;
        rotate(nowObject, 10);

    }


    function returnDefaultRot(nowObject:any): void {

        if (nowObject.groundRot.distanceTo(nowObject.targetRotDefault) > .1) {//.1以下に近づける
            nowObject.targetRot.x = nowObject.targetRotDefault.x;
            nowObject.targetRot.z = nowObject.targetRotDefault.z;
            rotate(nowObject, 5);
        } else {//0に戻す
            nowObject.groundRot.x = nowObject.targetRotDefault.x;
            nowObject.groundRot.z = nowObject.targetRotDefault.z;

            var euler: THREE.Euler = new THREE.Euler(
                nowObject.groundRot.x * Vars.toRad,
                nowObject.groundRot.y * Vars.toRad,
                nowObject.groundRot.z * Vars.toRad
                );
            PhysicsManager.setQuaternion(nowObject.rigidBodyIndex, new THREE.Quaternion().setFromEuler(euler));
        }

    }


    function flipCheck(nowObject:any): number {

        //z軸のみ、x軸に一度反転、z軸に一度反転するとドラッグ時の動きが変になるため調整する
        var adjust: number = 1;
        var pos: THREE.Vector3 = new THREE.Vector3();
        pos.setFromMatrixPosition(nowObject.flipCheckObj.matrixWorld);
        pos.sub(nowObject.target.position.clone());
        if (pos.distanceTo(flipCheckObjDefaultPos.clone()) > 1) adjust *= - 1;

        return adjust;
    }


    function rotate(nowObject, easing: number): void {

        nowObject.groundRot.x += -(nowObject.groundRot.x - nowObject.targetRot.x) / easing;
        nowObject.groundRot.y += -(nowObject.groundRot.y - nowObject.targetRot.y) / easing;
        nowObject.groundRot.z += -(nowObject.groundRot.z - nowObject.targetRot.z) / easing;


        var euler: THREE.Euler = new THREE.Euler(
            nowObject.groundRot.x * Vars.toRad,
            nowObject.groundRot.y * Vars.toRad,
            nowObject.groundRot.z * Vars.toRad
            );
        PhysicsManager.setQuaternion(nowObject.rigidBodyIndex, new THREE.Quaternion().setFromEuler(euler));


    }




    function reverse(nowObject:any, rot: number): void {

        downFlag = false;


        var absX: number = Math.abs(nowObject.rotateDir.x);
        var absZ: number = Math.abs(nowObject.rotateDir.z);
        if (absX) {//x軸
            if (rot > 0) {//down mouse move
                if (nowObject.rotateDir.x > 0) {
                    nowObject.targetRotDefault.x += 180;
                    //DomManager.debug.html( "down +x");
                } else {
                    nowObject.targetRotDefault.x -= 180;
                    //DomManager.debug.html( "down -x");
                }
            } else {//up mouse move
                if (nowObject.rotateDir.x < 0) {
                    nowObject.targetRotDefault.x += 180;
                    //DomManager.debug.html( "up +x");
                } else {
                    nowObject.targetRotDefault.x -= 180;
                    //DomManager.debug.html( "up -x");
                }
            }
        } else {//z軸
            var adjust: number = flipCheck(nowObject) * -1;
            if (rot > 0) {//down mouse move
                if (nowObject.rotateDir.z > 0) {
                    nowObject.targetRotDefault.z -= 180 * adjust;
                    //DomManager.debug.html( "down -z");
                } else {
                    nowObject.targetRotDefault.z += 180 * adjust;
                    //DomManager.debug.html( "down +z");
                }
            } else {//up mouse move
                if (nowObject.rotateDir.z < 0) {
                    nowObject.targetRotDefault.z -= 180 * adjust;
                    //DomManager.debug.html( "up -z");
                } else {
                    nowObject.targetRotDefault.z += 180 * adjust;
                    //DomManager.debug.html( "up +z");
                }
            }
        }



        if (Vars.reverseFlag) {
            Vars.reverseFlag = false;
        } else {
            Vars.reverseFlag = true;
        }

        Vars.targetRotDefault.copy(nowObject.targetRotDefault);

        nowObject.reverseAnimationFlag = true;



        if (nowObject.callBack) nowObject.callBack('flipStart' );
    }


    function reverseAnimation(nowObject:any): void {

        if (nowObject.groundRot.distanceTo(nowObject.targetRotDefault) > .01) {
            nowObject.targetRot.x = nowObject.targetRotDefault.x;
            nowObject.targetRot.z = nowObject.targetRotDefault.z;
            rotate(nowObject, 5);
        } else {
            reverseAnimationComp(nowObject);
        }

    }


    function reverseAnimationComp(nowObject:any): void {

        nowObject.reverseAnimationFlag = false;


        if (nowObject.callBack) nowObject.callBack('flipEnd' );
        flipEnd();
    }

    export function flipEnd(): void {


    }

}