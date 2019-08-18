class TreeMesh extends THREE.Mesh {

    public defaultPos: THREE.Vector3 = new THREE.Vector3();
    public defaultScale: number = 1;





    constructor(index:number, groundSize:THREE.Vector3, callBack:Function) {

        super(AssetManager.assets.objects['tree0'].geometry, AssetManager.assets.objects['tree0'].material);

        MaterialManager.setMaterial(this, 'groundGrass');
        MaterialManager.setMaterial(this, 'grassDepth');
        this.castShadow = true;

        //position
        var y: number = Math.round(Math.random()) * 1;
        if (y == 0) y = -1;
        this.position.x = Math.random() * groundSize.x - groundSize.x / 2;
        this.position.y = y * (groundSize.y / 2);
        this.position.z = Math.random() * groundSize.z - groundSize.z / 2;
        this.defaultPos.copy(this.position);

        //rotation
        this.rotation.set(-90 * Vars.toRad, 0, 0);
        if (y == -1) {
            this.rotation.x += 180 * Vars.toRad;
        }

        //scale
        var s: number = .5 + .5 * Math.random();
        this.defaultScale = s;



        this.scale.set(.01, .01, .01);
        this.updateMatrix();
        TweenManager.addTweenScale(this, new THREE.Vector3(this.defaultScale, this.defaultScale, this.defaultScale), 800, TWEEN.Easing.Elastic.Out, 100 * index, callBack);
    }



}