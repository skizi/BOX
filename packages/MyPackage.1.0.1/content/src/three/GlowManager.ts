module GlowManager {

    export var scene: THREE.Scene;
    export var glowScene: GlowScene;
    var blurComposer;
    var layer2Composer;
    var layer1Composer;
    var glows: Array<GlowObject> = [];
    var glowsLength: number = 0;




    export function init( _scene:THREE.Scene ):void {

        scene = _scene;
        glowScene = new GlowScene();
        composerInit();


        animate();

    }


    function composerInit(): void {

        var w: number = Vars.stageWidth;
        var h: number = Vars.stageHeight;

        //----------------------glow effect-------------------
        //blurComposer

        var renderTarget = new THREE.WebGLRenderTarget(w, h );
        blurComposer = new THREE.EffectComposer(RendererManager.renderer, renderTarget);

        var renderPass = new THREE.RenderPass(glowScene, GlowCameraManager.camera, null, null, 0);
        blurComposer.addPass(renderPass);

        var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
        var vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);

        var bluriness = 3;
        hblur.uniforms["h"].value = bluriness * 2 / w;
        vblur.uniforms["v"].value = bluriness / h;
        blurComposer.addPass(hblur);
        blurComposer.addPass(vblur);
        /*
        //コメントアウトを外すと画面に直接レンダリングされる（layer1Composerに上書きされるので確認はできないが）
        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        blurComposer.addPass(toScreen);
        */

        /*
        //layer2Composer
        var obj: Object = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
        renderTarget = new THREE.WebGLRenderTarget(w, h, obj);
        layer2Composer = new THREE.EffectComposer(RendererManager.renderer, renderTarget);
        renderPass = new THREE.RenderPass(glowScene, GlowCameraManager.camera, null, null, 0);
        layer2Composer.addPass(renderPass);
        var mask = new THREE.MaskPass(glowScene, GlowCameraManager.camera);
        layer2Composer.addPass(mask);
        layer2Composer.addPass(new THREE.ClearMaskPass());
        */
        /*
        //コメントアウトを外すと画面に直接レンダリングされる（layer1Composerに上書きされるので確認はできないが）
        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        layer2Composer.addPass(toScreen);
        */


        //layer1Composer
        layer1Composer = new THREE.EffectComposer(RendererManager.renderer);
        renderPass = new THREE.RenderPass(scene, CameraManager.camera);
        layer1Composer.addPass(renderPass);

        var shader = {
            uniforms: {
                tDiffuse: { type: "t", value: null },
                tBlur: { type: "t", value: blurComposer.renderTarget2 }/*,
                tLayer2: { type: "t", value: layer2Composer.renderTarget2 }*/
            },
            vertexShader: document.getElementById('vshader').textContent,
            fragmentShader: document.getElementById('fshader').textContent
        };

        var shaderPass = new THREE.ShaderPass(shader);
        shaderPass.needsSwap = true;
        layer1Composer.addPass( shaderPass );
        //shaderPass.renderToScreen = true;
        
        /*
        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        layer1Composer.addPass(toScreen);
        */
        


        //add dof
        var hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
        var vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);

        var bluriness = 3;//ぼけの強さ

        hblur.uniforms['h'].value = bluriness / Vars.stageWidth;
        vblur.uniforms['v'].value = bluriness / Vars.stageHeight;
        hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;

        layer1Composer.addPass(hblur);
        layer1Composer.addPass(vblur);


        //add dot
        var rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
        rgbEffect.uniforms['amount'].value = 0.003;
        rgbEffect.uniforms['angle'].value = 0;
        layer1Composer.addPass(rgbEffect);


        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        layer1Composer.addPass(toScreen);
    }


    function animate():void {

        requestAnimationFrame(animate);

        positionMerge();


        blurComposer.render(0.1);
        //layer2Composer.render(0.1);
        layer1Composer.render(0.1);

    }



    function positionMerge(): void {

        for (var i: number = 0; i < glowsLength; i++) {

            glows[i].copy.position.copy(glows[i].original.position );
            glows[i].copy.rotation = glows[i].original.rotation;

        }

    }



    export function add( object:THREE.Mesh ): void {

        scene.add(object);
        var copyObject: THREE.Mesh = MeshManager.duplicate(object);
        glowScene.add(copyObject);

        glows.push(new GlowObject( object, copyObject ) );
        glowsLength = glows.length;

    }

}