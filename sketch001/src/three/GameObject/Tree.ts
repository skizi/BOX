///<reference path="NekoGameObject.ts"/>
class Tree extends NekoGameObject {

    private grassMesh: THREE.Mesh;
    private data: any;


    constructor(stageIndex:number, index:number) {

        super();

        this.reset(stageIndex, index);
        

        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['tree0']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'groundGrass');
        MaterialManager.setMaterial(this.mesh, 'grassDepth');
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;


        //set physics
        this.rigidData = {
            shapeType: 'cylinder',
            mass: 1,
            mouseEnabled: true,
            origin:new THREE.Vector3(0,-1,0)
        };


    }


    public reset(stageIndex: number, index: number): void {

        this.data = StageData.stages[stageIndex]['trees'][index];

        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.rigidName = 'tree0Collision'
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);

        this.setVisible(true);
    }


} 