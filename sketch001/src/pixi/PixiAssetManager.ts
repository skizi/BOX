module PixiAssetManager {

    var callBack: Function;

    export function init(_callBack:Function): void {

        callBack = _callBack;

        var assetsToLoader = ['assets/pixi/pixi_assets.json'];
        var loader: PIXI.AssetLoader = new PIXI.AssetLoader(assetsToLoader, false);
        loader.onComplete = onAssetsLoaded.bind(this);
        loader.load();
        
    }


    function onAssetsLoaded(): void {

        callBack();

    }

    
}