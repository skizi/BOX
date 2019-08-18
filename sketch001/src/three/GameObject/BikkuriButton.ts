///<reference path="GameObject.ts"/>
///<reference path="../StageData.ts"/>
class BikkuriButton extends GameObject {

    private data: any;
    private particleIndex: number = 0;
    private callBackFunc: Function;

    private lastHitTime: number = 0;
    private hitInterval: number = 3;

    public hitRadius: number = 2;

    private starParticle2: StarParticle2;


    
    constructor(stageIndex: number, index: number, particleIndex:number){

        super();

        this.particleIndex = particleIndex;

        this.starParticle2 = new StarParticle2();
        ParticleManager.setParticle(this.starParticle2, 'starParticle2BikkuriButton' + particleIndex);
        this.add(this.starParticle2);



        //set physics
        this.rigidData = {
            shapeType: 'box',
            size: { x: 2, y: 2, z: 2 },
            mass: 0
        };


        this.reset(stageIndex, index);
    }


    public reset(stageIndex: number, index: number): void {
        
        this.data = StageData.stages[stageIndex]['bikkuriButtons'][index];

        this.name = 'bikkuriButton0' + index;
        this.assetName = 'bikkuriButton0';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        if(!this.mesh) this.setMesh(null, 'bikkuriButton1', false, false);

        switch (this.data.type) {

            case 'bridge':
                MaterialManager.setMaterial(this.mesh, 'bikkuriButton1');
                break;

            case 'small':
                MaterialManager.setMaterial(this.mesh, 'bikkuriButton2');
                break;

        }

        this.setVisible(true);


        this.setRigidBody();

    }


    public hit(target: any): void {

        if (Vars.elapsedTime - this.lastHitTime < this.hitInterval) return;
        this.lastHitTime = Vars.elapsedTime;


        //effect
        ParticleManager.on('starParticle2BikkuriButton' + this.particleIndex);
        setTimeout(function () {
            ParticleManager.off('starParticle2BikkuriButton' + this.particleIndex);
        }.bind(this), 50);

        //callBack
        this.data.hitCallBack();
        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(1.5, 1.5, 1.5), 200, TWEEN.Easing.Cubic.Out, 0, this.hitTweenCompStep1.bind(this));

        SoundManager.play(5, false);
    }

    private hitTweenCompStep1(): void {

        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(1, 1, 1), 500, TWEEN.Easing.Bounce.Out);

    }
}