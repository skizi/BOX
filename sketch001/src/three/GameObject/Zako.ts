class Zako extends NekoGameObject{

    private data: any = {};
    private lastHitTime: number = 0;


    constructor(stageIndex: number, index:number){

        super();

        this.player = <Player>SceneManager.scene.getObjectByName('player', false);
        this.maxHitCheckTime = .1;


        this.mesh = MeshManager.getAnimationMesh(AssetManager.zakoGeometry, [MaterialManager.zakoMaterial]);
        this.mesh.castShadow = true;
        this.add(this.mesh);

        this.setDefaultScale(2);

        this.setMouseEnabled(this.mesh, true);
        this.setCatchMouseEvents();


        //animation
        this.animationStep = 1;
        this.animationFps = 40 / this.animationStep;
        this.setMorphAnimationKey('walk', 0, 29);
        this.setMorphAnimationKey('tame', 30, 35);
        this.playAnimation('walk');


        this.reset(stageIndex, index);

        Vars.setAnimateFunc(this.animate.bind(this));
    }


    //-------------------------animation-------------------------
    private animate(): void {

        if (this.moveType && this.moveType != '') this.setState();

    }


    private setState(): void {

        if (this.moveType == 'attack' || this.catchFlag) return;

        if (this.position.distanceTo(this.player.position.clone()) < 3) {
            this.moveType = 'attack';
            this.playAnimation('tame');
            setTimeout(function () {
                this.attack();
            }.bind(this), 500);
        }


        switch (this.moveType) {

            case 'stalker':
                this.lookAtPlayer();
                break;

        }
    }


    private lookAtPlayer(): void {

        var targetPos: THREE.Vector3 = this.player.position.clone();
        var direction: THREE.Vector3 = targetPos.sub(this.position.clone()).normalize();
        direction.y = 0;
        this.mesh.lookAt(this.mesh.position.clone().add(direction));

    }


    private attack(): void {

        if (this.catchFlag) return;

        this.setHitTarget(this.player);

        this.lookAtPlayer();
        MaterialManager.zakoMaterial.uniforms.color.value = new THREE.Vector4(1, 0, 0, 1);
        this.mesh.material = MaterialManager.zakoMaterial;
        this.mesh.material.needsUpdate = true;

        //applyImpulse
        if (this.meshForwardNegateFlag) {
            var forward: THREE.Vector3 = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone()).negate();
        } else {
            forward = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone());
        }
        var targetPos: THREE.Vector3 = this.player.position.clone();
        PhysicsManager.applyImpulse(this.rigidBodyIndex, this.position.clone(), targetPos.clone(), 3);


        //
        setTimeout(function () {
            this.setMoveType({ type: 'stalker', target: this.player, speed: 4, range: 5 });
            this.playAnimation('walk');
            this.clearHitTargets();
        }.bind(this), 1000);
    }

    //-------------------------------reset----------------------------------
    public reset(stageIndex: number, index:number): void {

        this.data = StageData.stages[stageIndex]['zakos'][index];

        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        this.setVisible(true);
        this.hitPoint = 3;
        this.deadFlag = false;


        //physics
        this.rigidData = {
            shapeType: 'sphere',
            size: .3,
            mass: 1,
            mouseEnabled: false,
            origin: new THREE.Vector3(0, -1, 0),
            noRotFlag: true
        };

        this.setRigidBody();
        this.rigidBodyCheck();

        PhysicsManager.setRotationLimit(this.rigidBodyIndex, new THREE.Vector3(0, 0, 0));
    }


    private rigidBodyCheck(): void {

        if (this.rigidBodyIndex == -1) {
            setTimeout(this.rigidBodyCheck.bind(this), 500);
            return;
        }

        this.setMoveType({ type: 'stalker', target: this.player, speed: 4, range: 5 });
    }




    //------------------------------hit-----------------------------
    public hit(hitTarget: any): void {

        if (this.deadFlag) return;

        if (hitTarget.assetName == 'box0') {
            if (hitTarget.bulletFlag && Vars.elapsedTime - this.lastHitTime > .5) {
                this.lastHitTime = Vars.elapsedTime;
                this.hitPoint--;
                if (this.hitPoint < 1) this.dead();

                var pos: THREE.Vector3 = this.position.clone();
                pos.y += 1;
                SceneManager.scene.hitEffectParticle0.position.copy(pos);
                ParticleManager.on('hitEffectParticle0');
                setTimeout(function () {
                    ParticleManager.off('hitEffectParticle0');
                }.bind(this), 500);


                hitTarget.hitFlag = true;
                setTimeout(function () {
                    hitTarget.hitFlag = false;
                }, 500);
            }
            
        }

    }


    private dead(): void {

        this.deadFlag = true;

        console.log('dead zako!');
        
        this.setVisible(false);

        SceneManager.scene.starParticle1.position.copy(this.position);
        ParticleManager.on('starParticle1');
        setTimeout(function () {
            ParticleManager.off('starParticle1');
        }.bind(this), 500);

    }


    
    //-------------------------catch & release-------------------------
    public wasCaught(): void {
        
        this.moveType = '';

    }


    public bulletEnd(): void {

        PhysicsManager.setQuaternion(this.rigidBodyIndex, new THREE.Quaternion());
        this.setMoveType({ type: 'stalker', target: this.player, speed: 4, range: 5 });

    }

} 