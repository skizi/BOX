class Warp extends GameObject {


    private data: any;
    private hitFlag: boolean = false;

    constructor(stageIndex: number, index: number) {

        super();

        this.reset(stageIndex, index);

        //add mesh
        this.setMesh(null, 'warp', false, false);

        //add particle
        if (Vars.quality != 'low') {
            var particle: WarpParticle1 = new WarpParticle1();
            ParticleManager.setParticle(particle, 'warpParticle1');
            this.add(particle);
        }

    }


    public hit(player: any): void {

        if (this.hitFlag || !this.visible) return;
        this.hitFlag = true;

        StageManager.stageClear();

    }


    public reset(stageIndex: number, index: number): void {

        this.data = StageData.stages[stageIndex]['warps'][index];

        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        this.hitFlag = false;
        this.setVisible(true);
    }

}