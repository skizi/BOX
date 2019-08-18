///<reference path="GameObject.ts"/>
class Cloud extends GameObject {


    constructor() {

        super();

        this.name = 'cloud';
        this.position.y = 10;




        var cloudParticle: CloudParticle1 = new CloudParticle1();
        this.add(cloudParticle);

        var rainParticle: RainParticle1 = new RainParticle1();
        this.add(rainParticle);

        this.createMesh('box', new THREE.Vector3(3, 1, 3));
        this.mesh.name = 'cloud';
        this.setMouseEnabled(this.mesh, true);
        this.mesh.material.wireframe = true;
        this.mesh.material.visible = false;

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }


    public drag(): void {

        this.position.x += -(this.position.x - Vars.mousePosition.x) / 5;
        this.position.z += -(this.position.z - Vars.mousePosition.z) / 5;
    
    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        //DomManager.debug.html( this.position.y + "");


    }

}