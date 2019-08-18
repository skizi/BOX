module Move.mouse {

    export var objects: any = {};



    export function add(target: any, speed: number, speedChageRange: number = null, maxSpeed:number = 1) {

        var name: string = target.name;
        objects[name] = {};
        objects[name].target = target;
        objects[name].name = name;
        objects[name].targetPosition = new THREE.Vector3();
        objects[name].speed = speed;
        objects[name].speedChageRange = speedChageRange;
        objects[name].maxSpeed = maxSpeed;
        objects[name].ammoId = -1;

    }


    export function render(name: string): void {

        objects[name].targetPosition.copy(Vars.mousePosition);

        var a: THREE.Vector3 = objects[name].targetPosition.clone();
        a.y = 0; 
        var b: THREE.Vector3 = objects[name].target.position.clone();
        b.y = 0;
        var distance: number = a.distanceTo(b);
        if (distance < 1) {
            objects[name].target.speed = 0;
            return;
        }

        var speed: number = objects[name].speed;
        if (objects[name].speedChageRange &&
            distance > objects[name].speedChageRange) speed = objects[name].maxSpeed;
        objects[name].target.speed = speed;
        var rigidBodyIndex: number = objects[name].target.rigidBodyIndex;


        PhysicsManager.setLinearVelocity(rigidBodyIndex, objects[name].targetPosition, speed);

    }
}