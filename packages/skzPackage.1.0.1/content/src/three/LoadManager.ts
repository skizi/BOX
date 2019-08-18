class LoadManager {


    private jsonLoader: THREE.JSONLoader = new THREE.JSONLoader();
    private sceneLoader: THREE.SceneLoader = new THREE.SceneLoader();
    private callbackFunc: Function;




    constructor(url: string, type: string, _callbackFunc: Function) {

        this.callbackFunc = _callbackFunc;

        switch( type ){

            case "scene":
                this.sceneLoader.load(url, this.sceneLoadCompHandler.bind(this));
                break;
                
            case "json":
                this.jsonLoader.load(url, this.jsonLoadCompHandler.bind(this));
                break;
        }
    }


    private sceneLoadCompHandler(result): void {

        var scene = result.scene;
        /*
        for (var m in result.materials) {
            //alert( m );
        }
        for (var l in result.lights) {
            //alert(l);
        }
        for (var o in result.objects) {
            //alert(o);
        }

        alert(result.objects.Cube);
        */

        this.callbackFunc( result );
    }


    private jsonLoadCompHandler(geometry: THREE.Geometry, materials: Array<THREE.MeshBasicMaterial>): void {
        
        // adjust color a bit
        geometry.computeMorphNormals();

        var hasAnimation: boolean = false;
        if (geometry.morphTargets.length) hasAnimation = true;

        if ( hasAnimation ) {
            var mesh: any = this.setAnimationMesh(geometry, materials);
            mesh.hasAnimation = true;
        } else {
            mesh = this.setNormalMesh( geometry, materials );
        }



        this.callbackFunc({ mesh:mesh, hasAnimation:hasAnimation } );

    }


    private setAnimationMesh(geometry: THREE.Geometry, materials: Array<THREE.MeshBasicMaterial>): THREE.MorphAnimMesh {

        //animationさせるために必要
        for (var i: number = 0; i < materials.length; i++) materials[i].morphTargets = true;
        

        var material: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(materials);
        var mesh: any = new THREE.MorphAnimMesh(geometry, material);
        
        mesh.duration = 1000;
        mesh.time = 1000 * Math.random();

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        mesh.parseAnimations();

        return mesh;

    }
    //parseAnimations()を行うことによってmorphTargetsのnameが'attack001'、'attack002'となっているのを'attack'というふうにまとめてくれる。
    //morphTargetsのnameは_(アンダーバー)を含んではいけないらしい。
    //複数のアニメーションをこのやりかたで管理する場合は、morphTargetsのnameを事前にアニメーションごとに分ける必要があり、
    //現状blenderのexporterではそれを行うことはできない為、ひとつのアニメーションデータをsetAnimationLabelで
    //自力でラベル分けする方法でないと無理そうだ。


    private setNormalMesh( geometry: THREE.Geometry, materials: Array<THREE.MeshBasicMaterial>): THREE.Mesh {

        var material: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(materials);
        var mesh: any = new THREE.Mesh( geometry, material);
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        
        return mesh;

    }

}