module MoveTargetsManager {


    export function setMoveTargets(objects:any, name: string, targets: Array<THREE.Vector3>): any {

        objects[name].moveTargetsLength = targets.length;
        for (var i: number = 0; i < objects[name].moveTargetsLength; i++) {
            var pos: THREE.Vector3 = new THREE.Vector3().copy(targets[i]);
            pos.y = 0;
            objects[name].moveTargets.push(pos);

            if (i == 0) {
                objects[name].targetPosition.copy(objects[name].moveTargets[i]);
                PhysicsManager.setTargetPosition(objects[name].rigidBodyIndex, objects[name].targetPosition);
            }
        }

        return objects;
    }


    export function updateMoveTargets(objects: any, name: string, targets: Array<THREE.Vector3>): any {

        for (var i: number = 0; i < objects[name].moveTargetsLength; i++) {
            var pos: THREE.Vector3 = new THREE.Vector3().copy(targets[i]);
            pos.y = 0;
            objects[name].moveTargets[i] = new THREE.Vector3(pos.x, 0, pos.z);
        }

        objects[name].targetPosition.copy(objects[name].moveTargets[objects[name].moveTargetsIdex]);
        PhysicsManager.setTargetPosition(objects[name].rigidBodyIndex, objects[name].targetPosition);

        return objects;
    }


    export function clearMoveTargets(objects: any, name: string): any {

        for (var i: number = 0; i < objects[name].moveTargetsLength; i++) {
            objects[name].moveTargets[0] = null;
            objects[name].moveTargets.splice(0, 1);
        }
        objects[name].moveTargetsLength = 0;
        objects[name].moveTargetsIdex = 0;
        objects[name].lastMoveTargetsIdex = -1;
        objects[name].targetPosition = new THREE.Vector3();

        return objects;
    }





}