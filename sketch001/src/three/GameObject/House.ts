///<reference path="NekoGameObject.ts"/>
class House extends NekoGameObject {




    constructor(name: string) {

        super();

        this.name = name;



        //add mesh
        this.mesh = MeshManager.duplicate(AssetManager.assets.objects['house0']);
        this.mesh.position.set(0, 0, 0);
        MaterialManager.setMaterial(this.mesh, 'groundGrass');
        this.defaultScale = 1;
        this.mesh.scale.multiplyScalar(this.defaultScale);
        this.mesh.updateMatrix();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        //set physics
        this.rigidData = {
            shapeType: 'box',
            mass: 1,
            mouseEnabled: true,
            origin: new THREE.Vector3(0, -1, 0)
        };
        this.setRigidBody();

        //set shadow
        /*this.setShadow(['ground0']);
        this.shadowMesh.scale.multiplyScalar(1.2);
        this.shadowMesh.updateMatrix();
        */
    }




}