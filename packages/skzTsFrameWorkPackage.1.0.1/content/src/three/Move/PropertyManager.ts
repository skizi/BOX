module PropertyManager {


    export function rotations(meshs: Array<THREE.Mesh>, dist: number): Object {

        var positions: Array<THREE.Vector3> = [];
        var length: number = meshs.length;

        var rot: number = 0;
        var radius: number = 0;
        var radiusPlus: number = 200;

        for (var i: number = 0; i < length; i++) {
            meshs[i].position.z = i * dist;

            rot += 1;
            var radian: number = rot * Vars.toRad;
            radius += radiusPlus;
            if (radius > 1000 || radius < 100) radiusPlus = radiusPlus * -1;
            meshs[i].position.x = Math.cos(radian) * radius;
            meshs[i].position.y = Math.sin(radian) * radius + 500;

            positions.push(meshs[i].position.clone());
        }

        return { meshs: meshs, positions: positions };
    }


    export function sizes(meshs: Array<THREE.Mesh>, scale:number): Array<THREE.Mesh> {

        var length: number = meshs.length;
        for (var i: number = 0; i < length; i++) {
            meshs[i].scale.multiplyScalar( scale );
        }

        return meshs;
    }


    export function randomSizes(meshs: Array<THREE.Mesh>, min: number, max: number): Array<THREE.Mesh> {

        var length: number = meshs.length;
        for (var i: number = 0; i < length; i++) {
            var size: number = (max - min) * Math.random() + min;
            meshs[i].scale.multiplyScalar(size);
        }

        return meshs;
    }


    export function positions(meshs: Array<THREE.Mesh>, position:THREE.Vector3): Array<THREE.Mesh> {

        var length: number = meshs.length;
        for (var i: number = 0; i < length; i++) {
            meshs[i].position = position;
        }

        return meshs;
    }

}