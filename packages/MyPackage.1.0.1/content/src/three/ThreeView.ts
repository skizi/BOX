/// <reference path="../../scripts/typings/threejs/three.d.ts" />
///<reference path="../Vars.ts"/>


class ThreeView {


    private scene: Scene;








    constructor() {

        this.initRenderer();
        this.animate();

    }


    private initRenderer():void {

        RendererManager.init();
        this.scene = new Scene();
        Vars.init();
        GlowManager.init( this.scene );
        this.scene.init();

        var container: HTMLElement = document.getElementById( "container" );
        container.appendChild(RendererManager.renderer.domElement);

        //PostprocessManager.init(RendererManager.renderer, this.scene, CameraManager.camera);
        //PostprocessManager.add("dof"); //dof bloom rgbShift dot
        
    }



    private animate(): void {

        requestAnimationFrame(() => this.animate());


        //RendererManager.renderer.render(this.scene, CameraManager.camera );

        var composer = PostprocessManager.composer;
        if ( composer ) composer.render();
    }


    public resize(): void {

        var w:number = Vars.stageWidth;
        var h:number = Vars.stageHeight;

        RendererManager.renderer.setSize(w, h);

        CameraManager.camera.aspect = w / h;
        CameraManager.camera.updateProjectionMatrix();
        GlowCameraManager.camera.aspect = w / h;
        GlowCameraManager.camera.updateProjectionMatrix();

    }


}