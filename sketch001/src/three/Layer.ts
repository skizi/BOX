class Layer extends THREE.Scene {

    //public camera: THREE.OrthographicCamera;
    public camera: THREE.PerspectiveCamera;
    private tunnelMesh: THREE.Mesh;



    constructor() {

        super();

        var w: number = Vars.stageWidth * .5;
        var h: number = Vars.stageHeight * .5;
        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, .1, 1000);

        /*this.camera = new THREE.OrthographicCamera(
                -w, w, h, -h, .1, 100
            );
        */
        this.camera.position.z = -10;



        var geometry = new THREE.CylinderGeometry(50, 50, 1000, 40, 40, true);
        this.tunnelMesh = new THREE.Mesh(geometry, MaterialManager.tunnelMaterial);
        this.tunnelMesh.castShadow = true;
        this.add(this.tunnelMesh);

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));

    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!RendererManager.layerFlag) return;

        //tunnelMesh
        var pos: THREE.Vector3 = this.camera.position.clone();
        var forward: THREE.Vector3 = ThreeManager.getForward(this.camera);
        pos.add(forward.multiplyScalar(50));
        this.tunnelMesh.position.copy(pos);

        this.tunnelMesh.lookAt(this.camera.position);
        this.tunnelMesh.rotation.x += 90 * Math.PI / 180;
    }

}