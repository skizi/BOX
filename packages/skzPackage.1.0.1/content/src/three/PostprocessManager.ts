module PostprocessManager{

    export var composer: any;

    var renderTargetParameters;
    var renderTarget;



    export function init( renderer:THREE.Renderer, scene:THREE.Scene, camera:THREE.PerspectiveCamera ) {

        renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        renderTarget = new THREE.WebGLRenderTarget( Vars.stageWidth, Vars.stageWidth, renderTargetParameters);

        renderer.autoClear = false;
        composer = new THREE.EffectComposer(renderer /*,renderTarget*/);
        composer.addPass(new THREE.RenderPass(scene, camera));

    }


    export function add( type:string ) {

        switch( type ){

            case "bloom":
                addBloom();
                break;

            case "dof":
                addDof();
                break;

            case "rgbShift":
                addRgbShift();
                break;

            case "dot":
                addDot();
                break;

        }

        renderToScreen();

    }


    function renderToScreen(): void {

        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        composer.addPass(toScreen);

    }


    function addBloom():void {


        composer.addPass(new THREE.BloomPass( 1, 25 ));   //なぜか第三引数を指定すると右上にずれる
        //renderToScreen();
    }


    function addDof(): void{

        var hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
        var vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);

        var bluriness = 3;//ぼけの強さ

        hblur.uniforms['h'].value = bluriness / Vars.stageWidth;
        vblur.uniforms['v'].value = bluriness / Vars.stageHeight;
        hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;

        composer.addPass(hblur);
        composer.addPass(vblur);
    }

     
    function addRgbShift(): void {

        var rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
        rgbEffect.uniforms['amount'].value = 0.001;
        rgbEffect.uniforms['angle'].value = 0;
        composer.addPass(rgbEffect);

    }


    function addDot(): void {
         
        var effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms['angle'].value = 0;
        effect.uniforms['scale'].value = 500;//でかいほど細かい目になる
        composer.addPass(effect);

    }


}