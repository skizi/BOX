class HouseInner extends GameObject{

    private wallMesh: THREE.Mesh;

    constructor() {

        super();

        //add mesh
        this.wallMesh = MeshManager.duplicate(AssetManager.assets.objects['houseInnerWall']);
        this.wallMesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.wallMesh, 'houseInner');
        this.add(this.wallMesh);


    }



}