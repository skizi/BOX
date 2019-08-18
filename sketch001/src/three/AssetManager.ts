module AssetManager{

    export var loadCompFlag: boolean = false;

    export var assets: any;
    export var playerGeometry: THREE.Geometry;
    export var zakoGeometry: THREE.Geometry;


    export function init(): void {
        /*
        var worker = new Worker('js/assetWorker.js');
        worker.onmessage = function (e): any {

            var type = e.data.type;
            var result = e.data.result;

            if (type == 'workerScriptLoadComp') {
                worker.postMessage({ type: 'init' });
            } else {
                alert(result.assetsGeometries);
                alert(result.playerGeometry.vertices.length);
            }

        }
        */
        var url: string = 'assets/models/scene_test4.js';
        new LoadManager(url, 'scene', sceneLoadCompHandler.bind(this));

    }


    //-------------------------model load comp-------------------------
    function sceneLoadCompHandler(result: any): void {

        assets = result;

        //set yup
        for (var name in assets.objects) {
            if (assets.objects[name] instanceof THREE.Mesh && name.indexOf('Collision') == -1) {//oimo.jsを使うときはCollisionもyUpする
                MeshManager.yUp(assets.objects[name]);
            }
        }

        //add player
        var url = 'assets/models/player/player4.js';
        //var url = 'assets/models/player/player_bone.js';
        new LoadManager(url, 'json', playerModelLoadCompHandler.bind(this));
    }


    function playerModelLoadCompHandler(result: any): void {

        playerGeometry = result.geometry;


        //add player
        var url = 'assets/models/zako.js';
        new LoadManager(url, 'json', zakoModelLoadCompHandler.bind(this));
    }


    function zakoModelLoadCompHandler(result: any): void{

        zakoGeometry = result.geometry;

        loadCompFlag = true;

    }

    
    //--------------------------------------------------
    export function searchAssetsByName(_name: string): Array<THREE.Mesh> {

        var rigidMeshs: Array<THREE.Mesh> = []

        for (var name in assets.objects) {
            if (name.indexOf(_name) != -1) {
                rigidMeshs.push(MeshManager.duplicate(assets.objects[name]));
            }
        }

        return rigidMeshs;
    }
} 