module GeometryManager {




    //***geometry.mergeに関して***
    //
    //単一のUVを持つGeometryをマージする場合は（マージするgeometryの順番どおりに）materialIndexを指定して
    //マージ先のGeometryに複数のUVを持たせることができる。
    export function mergeSingleUV(meshs: Array<THREE.Mesh>, length: number = null): THREE.Geometry {

        if (!length) var length: number = meshs.length;
        var geometry: THREE.Geometry = new THREE.Geometry();

        for (var i: number = 0; i < length; i++) {
            meshs[i].updateMatrix();
            geometry.merge(meshs[i].geometry, meshs[i].matrix, i);
        }


        return geometry;
    }
    
    //***geometry.mergeに関して***
    //
    //もともと複数のUVを指定してあるGeometryをマージする場合、
    //第三引数のmaterialIndexは0にする必要がある。（materialIndexに0以外を指定するとエラーになる）
    //この場合マージするMeshすべてに同一のマテリアルしか割り振ることができない為、
    //同じMeshFaceMaterialを持つMeshしかマージしない方が良い
    //
    //（また、一応単一のUVのGeometryを混ぜてマージすることもできるが、
    //この場合MeshFaceMaterial.materialsの一番最初のマテリアルが割り当てられる）
    export function mergeMultiUV(meshs: Array<THREE.Mesh>, length: number = null): THREE.Geometry {

        if (!length) var length: number = meshs.length;
        var geometry: THREE.Geometry = new THREE.Geometry();

        for (var i: number = 0; i < length; i++) {
            meshs[i].updateMatrix();
            geometry.merge(meshs[i].geometry, meshs[i].matrix, 0);
        }


        return geometry;
    }





}