module LightManager {

    export var light: THREE.DirectionalLight;
    var lightDefaultPos: THREE.Vector3 = new THREE.Vector3(10, 30, -1);
    var SHADOW_MAP_WIDTH: number = 512;
    var SHADOW_MAP_HEIGHT: number = 512;

    var targetPos: THREE.Vector3 = new THREE.Vector3();
    var raycaster:THREE.Raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0))


    //***影について***
    //three.jsではmeshのcastShadow、receiveShadowと
    //Materialが密接に関係している。
    //たとえば、groundMeshとtreeMeshに同じMaterialを使用した場合
    //groundMeshにcastShadow=true、receiveShadow=trueとしても、
    //後でtreeMeshにcastShadow=true、receiveShadow=falseとすると
    //groundMeshに影が落ちなくなってしまう。
    //なので、影の描画をしつつ同じMaterialを使用する場合は
    //影の設定を意識しながら実装を行う必要がある。
    export function init(): void {
        
        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.copy(lightDefaultPos);
        
        if (Vars.quality == 'low') return;

        light.onlyShadow = true;
        light.castShadow = true;

        light.shadowCameraNear = 10;
        light.shadowCameraFar = 50;
        var radius: number = 30;
        light.shadowCameraLeft = -radius;
        light.shadowCameraRight = radius;
        light.shadowCameraTop = radius;
        light.shadowCameraBottom = -radius;


        //light.shadowCameraVisible = true;

        light.shadowBias = 0.0001;
        light.shadowDarkness = 0.5;

        if (Vars.quality == 'high') {
            light.shadowMapWidth = SHADOW_MAP_WIDTH * 2;
            light.shadowMapHeight = SHADOW_MAP_HEIGHT * 2;
        } else {
            light.shadowMapWidth = SHADOW_MAP_WIDTH;
            light.shadowMapHeight = SHADOW_MAP_HEIGHT;
        }
    }

    export function add(): void{
        
        if (Vars.quality == 'low') return;
        
        SceneManager.scene.add(light);
    }


    export function shadowClippingPositionSet(): void {

        light.target.position.copy(targetPos.clone());
        var pos: THREE.Vector3 = targetPos.clone().add(lightDefaultPos);
        light.position.copy(pos);

        
        /*
        //set near, far
        //毎フレームは重いFPSがやたら落ちる
        raycaster.ray.origin.copy(light.position);
        var direction: THREE.Vector3 = targetPos.clone().sub(light.position.clone()).normalize();
        raycaster.ray.direction.copy(direction);
        
        var obj: any = RaycastManager.hitCheck(raycaster, 50);
        if (obj.hitFlag) {

            var hitPos: THREE.Vector3;

            var length: number = obj.intersections.length;
            for (var i: number = 0; i < length; i++) {
                if (obj.intersections[i].object.name != 'mouseTopMesh' &&
                    obj.intersections[i].object.name != 'mouseMesh') {
                    if (!hitPos) {
                        hitPos = obj.intersections[i].point;
                        light.target.position.copy(hitPos);
        
                        var dist: number = obj.intersections[i].distance;
                        //本来なら+-10ほどにしたいが、nearとfarを更新できないため（three.jsのバグ？）
                        //仕方なく余裕を持たせて+-20にしている
                        light.shadowCameraNear = dist - 20;
                        light.shadowCameraFar = dist + 20;
                        //DomManager.debug.html( dist + "");
                        //DomManager.debug.html( obj.intersections[i].object.name );
                        //DomManager.debug.html( light.shadowCameraNear + " : " + light.shadowCameraFar );
                    }
                }
            }

        }
        */
    }

    export function setTargetPos(_targetPos: THREE.Vector3): void {
        
        if (Vars.quality == 'low') return;
        
        targetPos.copy(_targetPos);
        shadowClippingPositionSet();

    }

}