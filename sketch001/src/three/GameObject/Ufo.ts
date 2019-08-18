class Ufo extends GameObject {

    private targetObject: any;
    public ufoRayMesh: THREE.Mesh;
    private vacuumFlag: boolean = false;



    constructor() {

        super();

        this.name = 'ufo';
        this.position.y = 10;

        //add mesh
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['ufo']);
        this.mesh.name = 'ufo';
        this.mesh.position.set(0, 0, 0);
        //MaterialManager.setMaterial(this.mesh, 'groundGrass');
        this.setMouseEnabled(this.mesh, true);
        this.add(this.mesh);

        this.ufoRayMesh = MeshManager.duplicate(AssetManager.assets.objects['ufoRay']);
        this.ufoRayMesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.ufoRayMesh, 'ufoRay');
        this.add(this.ufoRayMesh);

        setInterval(this.setTargetObject.bind(this), 2000);

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }

    
    //-------------------------------setTargetObject------------------------------------
    private setTargetObject(): void {

        if (this.targetObject || this.vacuumFlag || !this.visible) return;

        for (var i: number = 0; i < Vars.objectsLength; i++) {
            if (Vars.objects[i].visible)this.targetObject = Vars.objects[i];
        }

        if (!this.targetObject) this.hide();
    }


    //-------------------------------vacuum------------------------------------
    private vacuumTargetObject(): void {

        this.vacuumFlag = true;
        TweenManager.addTweenRigidBodyPosition(this.targetObject, this.position, 500, TWEEN.Easing.Linear.None, 0, this.vacuumAnimeComp.bind(this));
        TweenManager.addTweenScale(this.targetObject.mesh, new THREE.Vector3(.1, .1, .1), 500, TWEEN.Easing.Linear.None);

    }


    private vacuumAnimeComp():void{

        this.vacuumFlag = false;

        this.targetObject.setVisible( false );
        this.targetObject.mesh.scale.multiplyScalar(10);
        this.targetObject.mesh.updateMatrix();

        this.targetObject = null;
    }


    private hide(): void {

        var pos: THREE.Vector3 = this.position.clone().add(new THREE.Vector3(0, 5, 0));
        TweenManager.addTweenPosition(this, pos, 500, TWEEN.Easing.Linear.None);
        TweenManager.addTweenScale(this, new THREE.Vector3(.1, .1, .1), 500, TWEEN.Easing.Linear.None, 0, this.fadeComp.bind(this));

    }


    private fadeComp(): void {

        this.setVisible(false);
        this.scale.multiplyScalar(10);
        this.updateMatrix();

    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!this.visible) return;


        if (this.targetObject && !this.vacuumFlag) {
    
            this.position.x += -(this.position.x - this.targetObject.position.x) / 10;
            var targetY: number = this.targetObject.position.y + 10;
            this.position.y += -(this.position.y - targetY) / 10;
            this.position.z += -(this.position.z - this.targetObject.position.z) / 10;

            var pos: THREE.Vector3 = this.position.clone();
            pos.y = 0;
            var targetPos: THREE.Vector3 = this.targetObject.position.clone();
            targetPos.y = 0;
            if (pos.distanceTo(targetPos) < 1 && !this.vacuumFlag) {
                this.vacuumTargetObject();
            }
        }
    }


}