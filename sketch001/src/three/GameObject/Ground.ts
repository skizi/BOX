///<reference path="GameObject.ts"/>
class Ground extends GameObject{


    private fireParticle1: FireParticle1;



    private data: any;
    public addFlag: boolean = false;

    //tree
    private tree: THREE.Mesh;
    private treeLength: number = 10;








    constructor(stageIndex:number, index:number) {

        super();
        

        this.reset(stageIndex, index);

        //move type
        //this.setMoveType({ type: 'flip', target: this, callBack: callBack });

        
        //set ground data
        //blenderのflipYZはただメッシュのrotationに+90度しただけなので、ジオメトリ自体は回転していない
        //なのでyとzを逆にした値を代入する。
        var size: THREE.Vector3 = MeshManager.getSize(AssetManager.assets.objects[this.rigidName]);
        this.data.size = new THREE.Vector3(size.x, size.z, size.y);   //flipYZ
        this.size.copy(this.data.size);

        this.data.groundY = this.position.y + this.data.size.y * .5;
        




        //this.setObjects();
        
        //tween
        /*
        if (index == 0) {
            TweenManager.addTweenPosition(this.mesh, new THREE.Vector3(), 500, TWEEN.Easing.Cubic.Out);
        } else {*/
        //TweenManager.addTweenPosition(this.mesh, new THREE.Vector3(), 500, TWEEN.Easing.Cubic.Out, 0, this.addTree.bind(this));
        //}
    }





    private setObjects(): void {

        //house2
        var house2: House2 = new House2(new THREE.Vector3(0, this.data.size.y * .5, 0));
        this.add(house2);

        var floorMesh: THREE.Mesh = MeshManager.duplicate(AssetManager.assets.objects['houseInnerFloor']);
        floorMesh.position.copy(house2.position);
        floorMesh.position.y += .2;
        MaterialManager.setMaterial(floorMesh, 'houseInner');
        this.add(floorMesh);


    }




    private trees: Array<TreeMesh> = [];
    private treeTweenCompCount: number = 0;
    private addTree(): void {
        
        for (var i: number = 0; i < this.treeLength; i++) {
            var tree: TreeMesh = new TreeMesh(i, this.size, this.treeTweenComp.bind(this));
            this.trees.push(tree);
            this.add(tree);
        }

    }

    private treeTweenComp(): void {

        this.treeTweenCompCount++;
        if (this.treeTweenCompCount != this.treeLength) return;

        var geometry: THREE.Geometry = GeometryManager.mergeMultiUV(this.trees);
        this.tree = new THREE.Mesh(geometry, MaterialManager.groundGrassMaterial);
        this.tree.castShadow = true;
        MaterialManager.setMaterial(this.tree, 'grassDepth');
        this.add(this.tree);

        //
        for (var i: number = 0; i < this.treeLength; i++) {
            this.remove(this.trees[0]);
            this.trees.splice(0, 1);
        }
        this.trees = null;
        delete this.trees;

    }

    
    //----------------------------mouse event-------------------------------
    public mouseClick(): void {

        //var pos: THREE.Vector3 = this.parent.localToWorld(this.position.clone());
        //CameraManager.camera.setTweenCameraTargetPos(pos.clone());


    }


    public mouseDown(): void {

        //Move.flip.mouseDown(this.flipIndex);

    }


    public mouseUp(): void {

        //Move.flip.mouseUp();

    }


    public reset(stageIndex:number, index:number): void {

        this.addFlag = true;

        this.data = StageData.stages[stageIndex]['grounds'][index];

        this.name = this.data.name + index;
        this.assetName = this.data.name;
        this.rigidName = this.data.name + 'Collision';
        this.position.set(this.data.position[0], this.data.position[1], this.data.position[2]);
        this.rotation.set(this.data.rotation[0], this.data.rotation[1], this.data.rotation[2]);
        this.setVisible(true);

        
        //add mesh
        if (this.mesh) {
            this.mesh.name = this.name;
        } else {
            this.setMesh(null, 'groundGrass', true, false);
        }

        var direction: number = Math.round(Math.random());
        if (direction == 0) direction = -1;
        //this.mesh.position.set(0, 20 * direction, 0);


        //setRigidBody
        if (this.data.rigidBody) {
            var index:number = this.setRigidBodyManyShape();
        }
        //PhysicsManager.setKinematic(this.rigidBodyIndex);

    }
 }