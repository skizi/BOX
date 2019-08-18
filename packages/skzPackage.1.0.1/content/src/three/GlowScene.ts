class GlowScene extends THREE.Scene {


    constructor (){

        super();

        GlowCameraManager.init();
        this.initLight();



    }


    private initLight(): void {

        var light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(300, 1000, -100);
        this.add(light);

    }

}