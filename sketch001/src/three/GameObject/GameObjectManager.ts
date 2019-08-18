module GameObjectManager{

    
    //gameObjectsのMeshを一つのgameObjectにまとめる
    export function merge(gameObjects:Array<GameObject>):THREE.Mesh{
        
        //----------------------------mesh-------------------------------
        //gameObjectsのGeometryをマージして新たなMeshを作る
        var meshs: Array<THREE.Mesh> = [];
        var materials: Array<any> = [];
        var length: number = gameObjects.length;
        for (var i: number = 0; i < length; i++) {
            //mesh
            gameObjects[i].mesh.position.copy(gameObjects[i].position);
            gameObjects[i].mesh.rotation.copy(gameObjects[i].rotation);
            meshs.push(gameObjects[i].mesh);
            /*
            //material
            if (gameObjects[i].mesh.material instanceof THREE.MeshFaceMaterial) {
                var materialLength: number = gameObjects[i].mesh.material.materials.length;
                for (var j: number = 0; j < materialLength; j++) {
                    materials.push(gameObjects[i].mesh.material.materials[j]);
                }
            } else {
                materials.push(gameObjects[i].mesh.material);
            }*/
        }

        var geometry: THREE.Geometry = GeometryManager.mergeMultiUV(meshs, length);
        var mesh: THREE.Mesh = new THREE.Mesh(geometry, gameObjects[0].mesh.material/*new THREE.MeshFaceMaterial(materials)*/);
        
        //gameObjectsのmeshのpositionを元に戻す
        for (var i: number = 0; i < length; i++) {
            gameObjects[i].mesh.position.set(0, 0, 0);
            gameObjects[i].mesh.rotation.set(0, 0, 0);
        }




        return mesh;

    }

} 