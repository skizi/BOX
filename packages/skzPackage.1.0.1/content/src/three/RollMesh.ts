///<reference path="../Vars.ts"/>

class RollMesh extends THREE.Mesh {

    public defaultPosition: THREE.Vector3 = new THREE.Vector3();
    private rot: number = 0;
    private radius: number = 200;
    private speed: number = 10;



    constructor( g:THREE.Geometry, m:any ) {

        super(g, m);

        this.speed = this.speed * Math.random();

        this.animate();

    }


    animate() {

        requestAnimationFrame(() => this.animate());

        this.rot += this.speed;
        
        var radian = this.rot * Vars.toRad;
        var x = Math.cos(radian) * this.radius;
        var z = Math.sin(radian) * this.radius;
        this.position = this.defaultPosition.clone().add(new THREE.Vector3(x, 0, z));

    }

}
