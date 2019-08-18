module Move.stalker {

    export var objects: any = {};



    export function add(object: any, target: any, speed: number, distance: number = 5) {

        var name: string = object.name;
        objects[name] = {};
        objects[name].object = object;
        objects[name].target = target;
        objects[name].speed = speed;
        objects[name].distance = distance;

    }


    export function render(name: string): void {

        var a: THREE.Vector3 = objects[name].object.position.clone();
        a.y = 0; 
        var b: THREE.Vector3 = objects[name].target.position.clone();
        b.y = 0;
        var distance: number = a.distanceTo(b);
        if (distance > objects[name].distance) {
            return;
        }


        

        var speed: number = objects[name].speed;
        var rigidBodyIndex: number = objects[name].object.rigidBodyIndex;
        PhysicsManager.setLinearVelocity(rigidBodyIndex, b, speed);

    }
}