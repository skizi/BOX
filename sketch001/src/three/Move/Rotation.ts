module Move.rotation {

    export var objects: any = {};



    export function add(name: string, speed:number) {

        objects[name] = {};
        objects[name].name = name;
        objects[name].targetPosition = new THREE.Vector3();
        objects[name].moveTargets = [];
        objects[name].moveTargetsLength = 0;
        objects[name].moveTargetsIdex = 0;
        objects[name].lastMoveTargetsIdex = -1;
        objects[name].rot = 0;
        objects[name].speed = speed;
        objects[name].interVal = setInterval(interVal.bind(this), 6000, name);
    }


    function interVal(name:string): void {

        objects[name].moveTargetsIdex++;
        if (objects[name].moveTargetsIdex > objects[name].moveTargetsLength - 1) objects[name].moveTargetsIdex = 0;

    }


    export function setMoveTargets(name: string, targets: Array<THREE.Vector3>): void {

        objects = MoveTargetsManager.setMoveTargets(objects, name, targets);
    }


    export function updateMoveTargets(name: string, targets: Array<THREE.Vector3>): void {

        objects = MoveTargetsManager.updateMoveTargets(objects, name, targets);
    }


    export function clearMoveTargets(name: string): void {

        objects = MoveTargetsManager.clearMoveTargets(objects, name);

    }

    export function render(name:string): void {

        if (!objects[name].moveTargetsLength) return;

        objects[name].rot += objects[name].speed * Vars.delta * 20;
        if (objects[name].rot > 360) objects[name].rot = 0;
        var radian: number = objects[name].rot * Vars.toRad;
        var x: number = 5 * Math.cos(radian);
        var z: number = 5 * Math.sin(radian);
        var i: number = objects[name].moveTargetsIdex;
        objects[name].targetPosition.x = objects[name].moveTargets[i].x + x;
        objects[name].targetPosition.z = objects[name].moveTargets[i].z + z;

        PhysicsManager.setTargetPosition(objects[name].rigidBodyIndex, objects[name].targetPosition);

    
    }

}