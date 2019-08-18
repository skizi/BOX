///<reference path="../StageData.ts"/>
class Block2 extends GameObject {

    private data: any;
    private callBackFunc: Function;


    
    constructor(stageIndex: number, index: number){

        super();

        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['block2']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'ground');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        //set physics
        this.rigidData = {
            shapeType: 'box',
            mass: 100
        };


        this.reset(stageIndex, index);
    }


    public reset(stageIndex: number, index: number): void {
        
        this.data = StageData.stages[stageIndex]['block2s'][index];

        this.name = 'block2' + index;
        this.assetName = 'block2';
        this.rigidName = 'block2Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        this.setVisible(true);

        var index:number = this.setRigidBody();

    }



    

}