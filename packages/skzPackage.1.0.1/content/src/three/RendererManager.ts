module RendererManager {

    export var renderer: THREE.WebGLRenderer;

    export function init():void {

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( Vars.stageWidth, Vars.stageHeight);

    }


}