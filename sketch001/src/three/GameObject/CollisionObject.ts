class CollisionObject extends THREE.Object3D {

    private callBack: Function;
    public radius: number = 2;


    constructor(callBack) {

        super();

        /*
        var geometry = new THREE.SphereGeometry(.5, 8, 8);
        var material = new THREE.MeshBasicMaterial({wireframe:true});
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        */
        this.callBack = callBack;
    }


    public hit(hitTarget: any): void {

        this.callBack('addItem', { position:this.position.clone() });

    }


}