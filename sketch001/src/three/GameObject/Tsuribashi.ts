class Tsuribashi extends GameObject {

    public data: any;


    constructor(stageIndex: number, index: number) {

        super();

        this.reset(stageIndex, index);


        this.size.copy(MeshManager.getSize(this.mesh));
        this.size.set(this.size.x, this.size.z, this.size.y);
        
    }


    public reset(stageIndex: number, index: number): void {

        this.data = StageData.stages[stageIndex]['tsuribashis'][index];

        this.name = 'tsuribashi' + index;
        this.assetName = 'tsuribashi';
        this.rigidName = 'tsuribashiCollision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        //add mesh
        if (!this.mesh) this.setMesh(null, 'groundGrass', true, false);

        //初期化された瞬間にvisible:falseにすると
        //visible:trueした時にconsoleにエラーが大量に吐き出されてしまうので
        //setTimeoutで.5秒後にvisible:falseしている
        setTimeout(function () {
            this.setVisible(false);
        }.bind(this), 1000);


        if (this.data.visible) {
            var index: number = this.setRigidBodyManyShape();
        }
    }

}