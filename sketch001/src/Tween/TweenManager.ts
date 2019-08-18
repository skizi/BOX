module TweenManager{


    export function addTweenPosition(object: any, targetPosition: THREE.Vector3, duration: number, easing: any, delay: number = 0, callBack: any = null, upDate:any = null): void {
        
        new TWEEN.Tween(object.position).to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
            .easing(easing).onComplete(callBack).delay(delay).onUpdate(upDate).start();

    }


    export function addTweenRigidBodyPosition(object: any, targetPosition: THREE.Vector3, duration: number, easing: any, delay: number = 0, callBack: any = null, upDate: any = null): void {

        var pos: THREE.Vector3 = object.position.clone();
        new TWEEN.Tween(pos).to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
            .easing(easing)
            .onUpdate((function (rigidBodyIndex, pos) {
                return function () {
                    PhysicsManager.setPosition(rigidBodyIndex, pos);
                    if (upDate)upDate();
                }
            }.bind(this))(object.rigidBodyIndex, pos)).onComplete(callBack).delay(delay).start();

    }


    export function addTweenQuaternion(object: any, targetQuaternion: THREE.Quaternion, duration: number, easing: any, delay: number = 0, callBack: any = null): void {

        new TWEEN.Tween(object.quaternion).to({ x: targetQuaternion.x, y: targetQuaternion.y, z: targetQuaternion.z, w: targetQuaternion.w }, duration)
            .easing(easing).onComplete(callBack).delay(delay).start();

    }


    export function addTweenRigidBodyQuaternion(object: any, targetQuaternion: THREE.Quaternion, duration: number, easing: any, delay: number = 0, callBack: any = null): void {

        var q: THREE.Quaternion = object.quaternion.clone();
        new TWEEN.Tween(q).to({ x: targetQuaternion.x, y: targetQuaternion.y, z: targetQuaternion.z, w: targetQuaternion.w }, duration)
            .easing(easing)
            .onUpdate((function (rigidBodyIndex, q) {
                return function () {
                    PhysicsManager.setQuaternion(rigidBodyIndex, q);
                }
            }.bind(this))(object.rigidBodyIndex, q)).onComplete(callBack).delay(delay).start();

    }


    export function addTweenScale(object: any, targetScale: THREE.Vector3, duration: number, easing: any, delay: number = 0, callBack: any = null): TWEEN.Tween {
        
        return new TWEEN.Tween(object.scale).to({ x: targetScale.x, y: targetScale.y, z: targetScale.z }, duration)
            .easing(easing)
            .onUpdate((function (object:any) {
                return function () {
                    object.updateMatrix();
                }
            }.bind(this))(object))
            .onComplete(callBack).delay(delay).start();

    }


    export function addTweenRigidBodyScale(object: any, targetScale: THREE.Vector3, duration: number, easing: any, delay: number = 0, callBack: any = null): void {

        new TWEEN.Tween(object.scale).to({ x: targetScale.x, y: targetScale.y, z: targetScale.z }, duration)
            .easing(easing)
            .onUpdate((function (object: any, rigidBodyIndex:number, scale:number) {
                return function () {
                    object.updateMatrix();
                    PhysicsManager.setScale(rigidBodyIndex, scale);
                }
            }.bind(this))(object, object.rigidBodyIndex, object.scale.x)).onComplete(callBack).delay(delay).start();

    }


    export function addTweenAlpha(object: any, targetAlpha: number, duration: number, easing: any, delay: number = 0, callBack: any = null): void {

        new TWEEN.Tween(object.material).to({ opacity: targetAlpha }, duration)
            .easing(easing)
            .onComplete(callBack)
            .onUpdate(function (self) { object.material.needsUpdate = true; }.bind(this))
            .delay(delay).start();

    }


    export function addTweenObj(object: any, property:any, duration: number, easing: any, delay: number = 0, callBack: any = null): void {

        new TWEEN.Tween(object).to(property, duration)
            .easing(easing)
            .onComplete(callBack)
            .delay(delay).start();

    }

}