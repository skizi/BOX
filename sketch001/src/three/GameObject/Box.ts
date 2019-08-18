///<reference path="NekoGameObject.ts"/>
///<reference path="../StageData.ts"/>
class Box extends NekoGameObject {

    private data: any;
    private callBackFunc: Function;
    public bulletFlag: boolean = false;

    public hitFlag: boolean = false;
    private returnPlayerFlag: boolean = false;
    private continueReleaseMissFlag: boolean = false;

    
    constructor(stageIndex: number, index: number){

        super();


        this.player = <Player>SceneManager.scene.getObjectByName('player', false);

        //set physics
        this.rigidData = {
            shapeType: 'box',
            mass: 1
        };


        this.reset(stageIndex, index);

        this.setCatchMouseEvents();
        Vars.pushRightClickFunc(this.rightClickHandler.bind(this));

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }


    public reset(stageIndex: number, index: number): void {
        
        this.data = StageData.stages[stageIndex]['boxs'][index];

        this.name = 'box0' + index;
        this.assetName = 'box0';
        this.rigidName = 'box0Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        if (!this.mesh) this.setMesh(null, 'box', false, true);
        this.show(500, 1000 * Math.random());

        this.setVisible(true);

        var index:number = this.setRigidBody();

    }




    //-------------------------mouse event-------------------------
    private rightClickHandler(): void {

        if (!this.bulletFlag && this.continueReleaseMissFlag) return;

        if (this.hitFlag) {
            this.continueRelease();
        } else {
            this.continueReleaseMissFlag = true;
            setTimeout(function () {
                this.continueReleaseMissFlag = false;
            }.bind(this), 2000);
        }
    }
    
    //-------------------------animate-------------------------
    private animate(): void {

        //requestAnimationFrame(() => this.animate());

    }
    /*
    //boxの集合アニメーション
    public mouseClick(): void {

        //this.callBackFunc(this.position.clone());

    }
    */
    
    //-------------------------release-------------------------
    public bulletStart(): void {

        this.maxHitCheckTime = .1;
        this.bulletFlag = true;

    }

    public bulletEnd(): void {

        this.maxHitCheckTime = .5;
        this.bulletFlag = false;

    }    


    public continueRelease(): void {

        if (this.returnPlayerFlag) return;
        this.returnPlayerFlag = true;

        var direction: THREE.Vector3 = this.player.position.clone().sub(this.position.clone()).normalize();

        var dist: number = this.position.clone().distanceTo(this.player.position.clone());
        var targetPos: THREE.Vector3 = direction.multiplyScalar(dist * .5).add(this.position.clone());
        targetPos.y += 2;

        TweenManager.addTweenRigidBodyPosition(this, targetPos, 200, TWEEN.Easing.Linear.None, 0, this.continueReleaseStep1Comp.bind(this));

    }


    private continueReleaseStep1Comp(): void {

        var targetPos: THREE.Vector3 = this.player.position.clone();
        TweenManager.addTweenRigidBodyPosition(this, targetPos, 200, TWEEN.Easing.Linear.None, 0, this.continueReleaseComp.bind(this));

    }


    private continueReleaseComp(): void{

        setTimeout(function () {
            this.returnPlayerFlag = false;
        }.bind(this), 1000);

        var releaseTarget: GameObject = this.player.getReleaseTarget();
        if (!releaseTarget) return;

        var direction: THREE.Vector3 = releaseTarget.position.clone().sub(this.player.position.clone()).normalize();
        this.player.setLookAt(direction);
        this.player.catcher(this, true);
        this.player.releaseAction();
    }

}