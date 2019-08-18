module Move.turn {

    export var objects: any = {};






    export function add(target: any) {

        var name: string = target.name;
        objects[name] = {};
        objects[name].target = target;
        objects[name].name = name;
        objects[name].targetPosition = new THREE.Vector3();
        objects[name].moveTargets = [];
        objects[name].moveTargetsLength = 0;
        objects[name].moveTargetsIdex = 0;
        objects[name].lastMoveTargetsIdex = -1;
        objects[name].moveTargetChangeDist = 1.5;

    }


    export function setMoveTargets(name:string, targets: Array<THREE.Vector3>): void {

        objects = MoveTargetsManager.setMoveTargets(objects, name, targets);
    }


    export function updateMoveTargets(name:string, targets: Array<THREE.Vector3>): void {

        objects = MoveTargetsManager.updateMoveTargets(objects, name, targets);
    }


    export function clearMoveTargets(name: string): void {

        objects = MoveTargetsManager.clearMoveTargets(objects, name);

    }


    export function render(name:string): void{

        if (!objects[name].moveTargetsLength) return;

        var pos: THREE.Vector3 = new THREE.Vector3().copy(objects[name].target.position);
        pos.y = 0;
        var dist: number = pos.distanceTo(objects[name].targetPosition);
        var range: number = objects[name].moveTargetChangeDist;
        if (dist < range) {

            //if (objects[name].moveTargetsIdex == objects[name].lastMoveTargetsIdex) return;
            objects[name].lastMoveTargetsIdex = objects[name].moveTargetsIdex;

            objects[name].moveTargetsIdex++;
            if (objects[name].moveTargetsIdex > objects[name].moveTargetsLength - 1) objects[name].moveTargetsIdex = 0;

            objects[name].targetPosition.copy(objects[name].moveTargets[objects[name].moveTargetsIdex]);
            PhysicsManager.setTargetPosition(objects[name].rigidBodyIndex, objects[name].targetPosition);

        }

    }



}