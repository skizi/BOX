module CaughtManager {

    var object: any;
    var target: any;
    export var height: number = 2;

    //caught
    var caughtRay: THREE.Raycaster;
    var caughtRayCount: number = 0;
    var maxCaughtRayCount: number = 4;
    var adjustCaughtTime: number = 3;




    export function init():void{

        caughtRay = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));

    }


    export function caughtRayReder(_object:any, _target:any): void {

        object = _object;
        target = _target;

        if (Vars.elapsedTime - object.lastCaughtTime < adjustCaughtTime) return;

        if (!object.caughtFlag) {

            //10フレームに一度だけcaughtRayの計算を行う
            caughtRayCount++;
            if (maxCaughtRayCount > caughtRayCount) return;
            caughtRayCount = 0;


            caughtRay.ray.origin = object.position;

            var obj: any = RaycastManager.hitCheck(caughtRay, 10);
            if (obj.hitFlag) {
                var name: string = 'caughtCollisionO';
                if (Vars.reverseFlag) name = 'caughtCollisionU';
                var point: THREE.Vector3 = RaycastManager.getFirstPointByName(obj.intersections, name);
                if (!point) return;

                point.x = object.position.x;
                point.z = object.position.z;
                var distance: number = object.position.distanceTo(point);
                if (distance < .5) {

                    caught(point);

                }
            }
        }

    }



    function caught(point: THREE.Vector3): void {

        //playAnimation('caught');

        PhysicsManager.setForceFlag(object.rigidBodyIndex, true);
        object.caughtFlag = true;
        object.lastCaughtTime = Vars.elapsedTime;
        var ground: THREE.Object3D = SceneManager.scene.getObjectByName('ground', false);

        //プレイヤーの方向を地面の中心点へ向けるため内部のmeshを回転させる
        //ぶら下がる動きを再現しようとするとbulletの方で回転角度を制御する必要があるため
        //内部のメッシュを一時的に回転させている
        var direction: THREE.Vector3 = ThreeManager.getXZDirection(object.position).negate();
        object.lookAt(object.position.clone().add(direction));
        object.mesh.quaternion.copy(object.quaternion);

        //裏・表の世界で変わるプレイヤーのサイズに合わせて
        //btPoint2PointConstraintに渡すプレイヤーの相対位置の調整
        /*if (Vars.reverseFlag) {
            var y: number = reverseSize * height / 2;
            var radius: number = .5 * reverseSize;
        } else {
            */
            var y: number = height / 2;
            var radius:number = .5;
        //}
        var adjust: THREE.Vector3 = direction.multiplyScalar(radius);
        var pos: THREE.Vector3 = new THREE.Vector3(adjust.x, y, adjust.z);

        //btPoint2PointConstraintに渡す地面の相対位置を調整しつつ地面のローカル座標に変換
        var targetPos: THREE.Vector3 = point.clone().sub(adjust.clone().negate());
        targetPos = ground.worldToLocal(targetPos);

        //
        //PhysicsManager.setHingeJoint('player', pos, vec, 'caught');  //ヒンジジョイントはammo.jsにまだ実装されてない
        //なので、btPoint2PointConstraintで擬似的にヒンジジョイントを再現する
        object.caughtJointIndex = PhysicsManager.setJointToBody(target.rigidBodyIndex, object.rigidBodyIndex, targetPos, pos);

        //プレイヤーがぶら下がったときのゆれる方向を固定（ヒンジジョイントの動き再現）
        var vec: THREE.Vector3 = ThreeManager.getXZDirection(object.position);
        vec = new THREE.Vector3(Math.abs(vec.z), 0, Math.abs(-vec.x));  //なぜかマイナスの値を入れるとおかしな動きになるのでMath.absする
        PhysicsManager.setRotationLimit(object.rigidBodyIndex, vec);

    }



    export function releaseCaught(_object:any): void {

        if (!_object.caughtFlag) return;


        PhysicsManager.setForceFlag(_object.rigidBodyIndex, false);
        _object.caughtFlag = false;
        _object.mesh.rotation.set(0, 0, 0);
        var vec: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
        PhysicsManager.setRotationLimit(_object.rigidBodyIndex, vec);
        PhysicsManager.jointDelete(_object.caughtJointIndex);

        _object.lastCaughtTime = Vars.elapsedTime;
    }


}