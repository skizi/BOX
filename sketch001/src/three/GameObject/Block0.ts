﻿///<reference path="../StageData.ts"/>
class Block0 extends GameObject {

    private data: any;
    private callBackFunc: Function;


    
    constructor(stageIndex: number, index: number){

        super();

        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['block0']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'block0');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        //set physics
        this.rigidData = {
            shapeType: 'box',
            mass: 0
        };


        this.reset(stageIndex, index);
    }


    public reset(stageIndex: number, index: number): void {
        
        this.data = StageData.stages[stageIndex]['block0s'][index];

        this.name = 'block0' + index;
        this.assetName = 'block0';
        this.rigidName = 'block0Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        this.setVisible(true);

        var index:number = this.setRigidBody();

    }



    

}