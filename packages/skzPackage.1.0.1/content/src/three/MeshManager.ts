module MeshManager {

    export function duplicate(_mesh: THREE.Mesh): THREE.Mesh {
        var mesh: THREE.Mesh = new THREE.Mesh(_mesh.geometry, _mesh.material);
        mesh.position.copy( _mesh.position );
        mesh.rotation.x = _mesh.rotation.x;
        mesh.rotation.y = _mesh.rotation.y;
        mesh.rotation.z = _mesh.rotation.z;
        mesh.scale.x = _mesh.scale.x;
        mesh.scale.y = _mesh.scale.y;
        mesh.scale.z = _mesh.scale.z;
        return mesh;
    }


    export function duplicates(mesh: THREE.Mesh, length: number): Array<THREE.Mesh> {

        var scale: number = mesh.scale.x;

        var meshs: Array<THREE.Mesh> = [];
        for (var i: number = 0; i < length; i++) {
            var cloneMesh: THREE.Mesh = new THREE.Mesh(mesh.geometry, mesh.material); //clone()だと複製できない
            cloneMesh.scale.multiplyScalar( scale );
            meshs.push( cloneMesh );
        }
        return meshs;
    }


    export function merge( meshs:Array<THREE.Mesh> ): THREE.Mesh{

        var length: number = meshs.length;
        var geometry: THREE.Geometry = new THREE.Geometry();
        var material: any = meshs[0].material.clone();

        for (var i: number = 0; i < length; i++) {
            THREE.GeometryUtils.merge(geometry, meshs[i]);
        }


        return new THREE.Mesh(geometry, material);
    }


    export function getSize(mesh: THREE.Mesh): THREE.Vector3 {

        var min: THREE.Vector3 = mesh.geometry.vertices[0].clone();
        var max: THREE.Vector3 = min.clone();

        var length: number = mesh.geometry.vertices.length;
        for (var i: number = 0; i < length; i++) {
            var vertex:THREE.Vector3 = mesh.geometry.vertices[i];
            if (min.x > vertex.x) min.x = vertex.x;
            if (min.y > vertex.y) min.y = vertex.y;
            if (min.x > vertex.z) min.z = vertex.z;
            if (max.x < vertex.x) max.x = vertex.x;
            if (max.y < vertex.y) max.y = vertex.y;
            if (max.x < vertex.z) max.z = vertex.z;
        }

        var x: number = max.x - min.x;
        var y: number = max.y - min.y;
        var z: number = max.z - min.z;

        return new THREE.Vector3( x, y, z );
    }

}