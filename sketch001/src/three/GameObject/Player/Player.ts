///<reference path="../NekoGameObject.ts"/>
class Player extends NekoGameObject{

    private materials: Array<THREE.Material> = [];
    private textures: Array<THREE.Texture> = [];

    private height: number = 2;
    private lastDirection: THREE.Vector3 = new THREE.Vector3();
    private walkSpeed: number = 3;
    private runSpeed: number = 6;

    private forceFlag: boolean = false;
    private fallFlag: boolean = false;


    //
    public ground: any;
    public moveTargetOPointsLength: number = 0;
    public moveTargetUPointsLength: number = 0;

    //particle
    private runSmorkParticle: RunSmorkParticle;

    private runSoundId: number = -1;
    private runSoundVolume: number = .5;

    //
    public minScale: number = 1;

    private callBack: Function;

    private line: THREE.Line;


    public stageClearFlag: boolean = false;




    constructor() {

        super(new THREE.Vector3(0, .1, 0));


        this.name = 'player';

        /*if (this.debugFlag) {
            this.setProperty();
            this.animate();
        }
        */


        this.mesh = MeshManager.getAnimationMesh(AssetManager.playerGeometry, MaterialManager.playerMaterials);
        //this.mesh = MeshManager.getSkeletalAnimationMesh(AssetManager.playerGeometry, MaterialManager.playerMaterials);
        this.mesh.castShadow = true;
        this.add(this.mesh);



        this.setProperty();
        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));

    }


    private setProperty(): void {

        this.moveFlag = false;

        //animation
        this.animationStep = 4;
        this.animationFps = 40 / this.animationStep;
        this.setMorphAnimationKey('walk', 0, 10);
        this.setMorphAnimationKey('run', 11, 15);
        this.setMorphAnimationKey('default', 16, 20);
        this.setMorphAnimationKey('caught', 21, 22);
        this.setMorphAnimationKey('defaultCatch', 23, 27);
        this.setMorphAnimationKey('walkCatch', 28, 37);
        this.setMorphAnimationKey('runCatch', 38, 42);
        this.setMorphAnimationKey('throw', 43, 55);
        this.setMorphAnimationKey('jump', 55, 61);
        this.playAnimation('walk');

        
        //this.setBoneAnimations(AssetManager.playerGeometry);
        //this.playAnimation('Actions');



        this.meshForwardNegateFlag = true;

        //physics
        this.rigidData = {
            shapeType: 'sphere',
            size: .5,
            mass: 40,
            mouseEnabled: true,
            origin: new THREE.Vector3(0, -1, 0),
            noRotFlag:true
        };

        this.setRigidBody();

        PhysicsManager.setRotationLimit(this.rigidBodyIndex, new THREE.Vector3(0, 0, 0));

        this.hitRadius = 1.6;

        //set moveType
        //this.setMoveType({type:'turn'});
        //this.setMoveType({type:'rotation', speed:5});
        this.setMoveType({ type: 'mouse', speed: this.walkSpeed, speedChangeRange: 3, maxSpeed: this.runSpeed });
        

        //set shadow
        //this.setShadow(['ground0']);


        //set scale
        this.minScale = 1;
        this.setDefaultScale(2);
        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.defaultScale, this.defaultScale, this.defaultScale), 1000, TWEEN.Easing.Elastic.Out);

        if (Vars.quality != 'low') this.runSmorkParticle = new RunSmorkParticle(this);
        
        this.runSoundId = SoundManager.play(9, true, 0);
        SoundManager.setInstanceVolume(this.runSoundId, 0);


        /*
        //debug
        var array: Array<THREE.Vector3> = [];
        array[0] = new THREE.Vector3(0, 0, 0);
        array[1] = new THREE.Vector3(1, 0, 0);
        this.line = ThreeManager.getLine(array, 0xff0000);
        SceneManager.scene.add(this.line);
        */

        Vars.pushRightClickFunc(this.rightClickHandler.bind(this));
        
        //初期化された瞬間にvisible:falseにすると
        //visible:trueした時にconsoleにエラーが大量に吐き出されてしまうので
        //setTimeoutで.1秒後にvisible:falseしている
        setTimeout(function () {
            this.visible = false;
        }.bind(this), 100);
    }


    //-------------------------start-------------------------
    public start(): void {

        this.visible = true;
        this.mesh.scale.copy(new THREE.Vector3(.01, .01, .01));
        this.mesh.updateMatrix();
        this.nowTween = TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.nowScale, this.nowScale, this.nowScale), 500, TWEEN.Easing.Elastic.Out, 0, this.startComp.bind(this));
        
    }

    private startComp(): void {

        this.playAnimation('jump');
        
        SceneManager.scene.starParticle1.position.set(0, 0, 0);
        ParticleManager.on('starParticle1');
        setTimeout(function () {
            ParticleManager.off('starParticle1');
        }.bind(this), 1000);
        
        setTimeout(function (): void {
            this.moveFlag = true;
        }.bind(this), 1000);

    }
    
    //-------------------------animation-------------------------
    private animate(): void {

        //requestAnimationFrame(() => this.animate());


        if (this.moveFlag || this.stageClearFlag) {
            this.catchTargetMove();
            this.setState();
        }

    }


    private setState(): void {
        
        if (this.throwingFlag || this.deadFlag) return;

        if (this.stageClearFlag) {

            this.playAnimation('jump');
            if (Vars.quality != 'low') this.runSmorkParticle.off();
            SoundManager.setInstanceVolume(this.runSoundId, 0);

            var direction:THREE.Vector3 = Vars.mousePosition.clone().sub(this.position.clone()).normalize();
            this.lastDirection.copy(direction);

            //rotation
            this.setLookAt(direction);
            return;
        }



        //move
        //groundの角度が10度を越える場合はプレイヤーを坂の頂上を向くようにする
        if (Vars.downDirection.x != 0) {
            var rot: number = Vars.groundRot.z - Vars.targetRotDefault.z;
        } else {
            rot = Vars.groundRot.x - Vars.targetRotDefault.x;
        }
        rot = Math.abs(rot);

        //地面の角度を考慮してプレイヤーの向きを決定
        if (rot > 10) {
            direction = Vars.downDirection.clone();
            //マウスドラッグの方向が下の場合はdirectionを反転させる
            if (Vars.mouseDragOffsetY > 0) {
                direction.multiplyScalar(-1);
            }
            if (this.catchingFlag) {
                this.playAnimation('runCatch');
            } else {
                this.playAnimation('run');
            }
            if (Vars.quality != 'low') this.runSmorkParticle.on();
            SoundManager.setInstanceVolume(this.runSoundId, this.runSoundVolume);
            if (!this.forceFlag) {
                this.forceFlag = true;
                PhysicsManager.setForceFlag(this.rigidBodyIndex, this.forceFlag);
            }
        } else {
            if (this.speed > 0 ) {

                direction = this.getMoveProp().targetPosition.clone().sub(this.position.clone()).normalize();
                if (this.speed == this.runSpeed) {
                    if (this.catchingFlag) {
                        this.playAnimation('runCatch');
                    } else {
                        this.playAnimation('run');
                    }
                    if (Vars.quality != 'low') this.runSmorkParticle.on();
                    SoundManager.setInstanceVolume(this.runSoundId, this.runSoundVolume);
                } else {
                    if (this.catchingFlag) {
                        this.playAnimation('walkCatch');
                    } else {
                        this.playAnimation('walk');
                    }
                    if (Vars.quality != 'low') this.runSmorkParticle.off();
                    SoundManager.setInstanceVolume(this.runSoundId, 0);
                }
            } else {
                if (this.catchingFlag) {
                    this.playAnimation('defaultCatch');
                } else {
                    this.playAnimation('default');
                }
                if (Vars.quality != 'low') this.runSmorkParticle.off();
                SoundManager.setInstanceVolume(this.runSoundId, 0);
                direction = this.lastDirection;
            }

            if (this.forceFlag) {
                this.forceFlag = false;
                PhysicsManager.setForceFlag(this.rigidBodyIndex, this.forceFlag);
            }
        }

        this.lastDirection.copy(direction);


        /*
        if (this.line) {
            this.line.position.copy(this.position);
            var array: Array<THREE.Vector3> = [];
            array[0] = new THREE.Vector3();
            array[1] = new THREE.Vector3().copy(direction.clone().multiplyScalar(50));
            ThreeManager.setLinePos(this.line, array);
        }*/


        //rotation
        this.setLookAt(direction);

    }


    public setLookAt(direction:THREE.Vector3): void {

        direction.y = 0;
        this.mesh.lookAt(this.mesh.position.clone().add(direction));

    }


    private catchTargetMove(): void {

        if (!this.catchingFlag) return;
        
        this.catchTarget.rotation.copy(this.mesh.rotation);
        var forward: THREE.Vector3 = ThreeManager.getForward(this.mesh).negate();//blenderでflipYZしてるせいかmeshのforwardが反転しているのでnegateする
        var catchTargetPos: THREE.Vector3 = forward.multiplyScalar(this.catchTargetPosition.z);
        catchTargetPos.y = this.catchTargetPosition.y;
        this.catchTarget.position.copy(catchTargetPos);
        
    }



    public nekoGOAnimate(): void {

        //requestAnimationFrame(() => this.nekoGOAnimate());

        if (this.position.y < -10 && this.rigidFlag && !this.deadFlag) {

            //if (DomManager.hitPointContainer.hitPoint > 1) {
                PhysicsManager.resetVelocity(this.rigidBodyIndex);
                PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
                this.show(1000, 1000 * Math.random());
            //}

            if(this.moveFlag) DomManager.hitPointContainer.remove();
        }

    }


    public catching(): void {

        SoundManager.play(7, false);

    }


    //-------------------------mouse event-------------------------


    //アイテムを持っている場合は投げる
    private rightClickHandler(): void {

        this.releaseAction();


    }


    public releaseAction():void{

        if (!this.throwingFlag && this.catchingFlag) {
            this.setThrowingAnimation();
            setTimeout(function () {
                this.release();
                DomManager.mouseNavi.hide();
                SoundManager.play(4, false);
            }.bind(this), 600);
        }

    }


    public setThrowingAnimation(): void {

        this.throwingFlag = true;
        this.playAnimation('throw');
        setTimeout(function () {
            this.throwingFlag = false;
        }.bind(this), 1000);

    }

    
    //-------------------------public-------------------------
    

    public setPlayerMoveTargets(type: string): void {

        if (!this.moveTargetOPointsLength || !this.moveTargetOPointsLength) return;


        if (type == 'reset') this.getMover().clearMoveTargets('player');

        if (Vars.reverseFlag) {
            var targets: Array<THREE.Vector3> = this.getMoveTargets('ura');
        } else {
            targets = this.getMoveTargets('omote');
        }

        if (type == 'update') this.getMover().updateMoveTargets('player', targets);
        if (type == 'reset') this.getMover().setMoveTargets('player', targets);

    }

    private getMoveTargets(type: string): Array<THREE.Vector3> {

        var targets: Array<THREE.Vector3> = [];

        var length: number = this.moveTargetOPointsLength;
        if (type == 'ura') length = this.moveTargetUPointsLength;
        for (var i: number = 0; i < length; i++) {
            if (type == 'omote') {
                var pos: THREE.Vector3 = this.ground.moveTargetOPoints[i].position.clone();
            } else {
                pos = this.ground.moveTargetUPoints[i].position.clone();
            }
            pos = this.ground.localToWorld(pos);
            //if (i == 0) this.revivePosition.copy(pos);
            targets.push(pos);
        }

        return targets;
    }



    //------------------------------hit-----------------------------
    public hit(hitTarget: any): void {

        if (hitTarget.assetName == 'zako') {
            if (Vars.inGameFlag) DomManager.hitPointContainer.remove();
        }

    }


    public groundHit(object: any): void {

        var name: string = object.name;

        if (this.deadFlag) return;

        if (DomManager.hitPointContainer.hitPoint > 1) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
            PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
            this.show(1000, 1000 * Math.random());
        } else {
            TweenManager.addTweenScale(this.mesh, new THREE.Vector3(.01, .01, .01), 700, TWEEN.Easing.Elastic.Out);

            SceneManager.scene.starParticle1.position.copy(this.position);
            ParticleManager.on('starParticle1');
            setTimeout(function () {
                ParticleManager.off('starParticle1');
            }.bind(this), 500);
        }

        DomManager.hitPointContainer.remove();
    }

    
    //------------------------------etc-----------------------------
    public restart(): void {

        this.deadFlag = false;
        this.playAnimation('default');
        if (Vars.quality != 'low') this.runSmorkParticle.off();
        this.mesh.scale.set(.01, .01, .01);
        this.mesh.updateMatrix();

    }

}