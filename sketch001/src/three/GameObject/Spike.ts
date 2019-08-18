///<reference path="GameObject.ts"/>
///<reference path="../StageData.ts"/>
class Spike extends GameObject {

    private data: any;

    public hitTarget: any;
    private hitArea: any = {};

    
    constructor(stageIndex: number, index: number){

        super();

        //set physics
        this.rigidData = {
            shapeType: 'box',
            mass: 0
        };

        this.reset(stageIndex, index);

    }


    public reset(stageIndex: number, index: number): void {

        this.data = StageData.stages[stageIndex]['spikes'][index];

        this.name = 'spike' + index;
        this.assetName = 'spike';
        this.rigidName = 'spikeCollision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        if (!this.mesh) this.setMesh(null, 'spike', false, false);

        this.setVisible(true);

        this.setRigidBody();

        RaycastManager.add(this.mesh, false);
    }


}