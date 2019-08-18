class Item extends GameObject {

    private maxLifeTime: number = 10;
    private startLifeTime: number = 0;

    private fadeFlag: boolean = false;
    private fadeTime: number = 1000;


    

    constructor(name:string, url:string, maxLifeTime:number){

        super();

        this.name = name;
        this.maxLifeTime = maxLifeTime;
        this.startLifeTime = Vars.elapsedTime;


        this.createSprite(url);

        this.rigidData.bodyName = this.name;
        this.rigidData.shapeType = 'sphere';
        this.rigidData.size = .5;
        
        this.setRigidBody();

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }


    
    //-------------------------lifeTimeCheck----------------------------------
    private lifeTimeCheck(): void {

        if (this.fadeFlag == true) return;

        if (Vars.elapsedTime - this.startLifeTime > this.maxLifeTime) {
            this.fadeFlag = true;
            new TWEEN.Tween(this.sprite.material).to({ opacity: 0 }, this.fadeTime)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(function (self) { this.sprite.material.needsUpdate = true; }.bind(this))
                .onComplete(function (self) { this.dead(); }.bind(this)).start();
        }
    }


    private dead(): void {

        this.deadFlag = true;
        this.visible = false;
        PhysicsManager.setPosition(this.rigidBodyIndex, new THREE.Vector3(0, 100, 0));
        //移動する前にmassが0に設定されてしまう為、少しタイミングをずらす。
        setTimeout(function () {
                PhysicsManager.setMassProps(this.rigidBodyIndex, 0);
        }.bind(this), 10);

    }


    public revive(pos:THREE.Vector3): void {

        if (!this.deadFlag) return;
        this.fadeFlag = false;
        this.deadFlag = false;
        this.visible = true;
        this.startLifeTime = Vars.elapsedTime;

        this.sprite.material.opacity = 1;
        this.sprite.material.needsUpdate = true;
        PhysicsManager.setMassProps(this.rigidBodyIndex,1);
        PhysicsManager.setPosition(this.rigidBodyIndex, pos);

    }

    
    //-------------------------move----------------------------------
    private movement(): void {

        if (this.position.y < -10 && !this.deadFlag) {
            PhysicsManager.setPosition(this.rigidBodyIndex, new THREE.Vector3(0, 5, 0));
        }

        //this.lookAt(CameraManager.camera.position);
        //this.rotation.x = 0;

    }

    
    //-------------------------render----------------------------------
    private animate(): void {

        //requestAnimationFrame(() => this.animate());


        this.lifeTimeCheck();
        this.movement();

    }


}