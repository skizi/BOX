module MaterialManager {

    export var animateFlag: boolean = false;
    export var callBack: Function;

    var textures: any;

    var playerDiffuseMaterial: THREE.MeshBasicMaterial;
    var playerOutlineMaterial: THREE.MeshBasicMaterial;
    export var playerMaterials: Array<THREE.MeshBasicMaterial>;
    export var playerMaterial: THREE.MeshFaceMaterial;

    export var shadowMaterial: THREE.MeshBasicMaterial;

    var groundMaterial: THREE.MeshBasicMaterial;
    var grassMaterial: THREE.MeshBasicMaterial;
    var grassDepthMaterial: THREE.ShaderMaterial;
    export var groundGrassMaterial: THREE.MeshFaceMaterial;

    var boxMaterial: THREE.MeshBasicMaterial;

    var houseInnerMap: THREE.Texture;
    var houseInnerMaterial: THREE.MeshBasicMaterial;

    var ufoRayMaterial: THREE.MeshBasicMaterial;

    //warp
    var warpMaterial: THREE.MeshFaceMaterial;
    var warpBaseMaterial: THREE.MeshBasicMaterial;
    var warpLightMaterial: THREE.ShaderMaterial;
    var warpWaterMaterial: THREE.ShaderMaterial;

    //circle
    export var circleMaterial: THREE.MeshBasicMaterial;

    //bikkuriButton
    var bikkuriButtonMaterial1: THREE.MeshBasicMaterial;
    var bikkuriButtonMaterial2: THREE.MeshBasicMaterial;

    //spike
    var spikeMaterial: THREE.MeshFaceMaterial;

    //skyBox
    export var skyBoxMaterial: THREE.ShaderMaterial;

    //tunnel
    export var tunnelMaterial: THREE.ShaderMaterial;

    export var zakoMaterial: THREE.ShaderMaterial;

    export var hitEffectMaterial0: THREE.ShaderMaterial;


    //
    export var materials: any = {};



    export function init(): void {
        
        //----------------------------------player-------------------------------------
        //var loader = new THREE.DDSLoader();
        //var map = loader.load('assets/models/player/diffuse2.dds');
        //map.minFilter = map.magFilter = THREE.LinearFilter;
        var url: string = 'assets/models/player/diffuse.jpg';
        if (Vars.quality == 'low') url = 'assets/models/player/diffuse_low.jpg';
        var playerMap = THREE.ImageUtils.loadTexture(url);
        var playerDiffuseMaterial = new THREE.MeshBasicMaterial({
            map: playerMap,
            morphTargets: true
        });

        /*
        var material1: THREE.ShaderMaterial = new THREE.ShaderMaterial({
            //vertexShader: document.getElementById('toon-animate-vshader').textContent,
            vertexShader:"        varying vec3 vNormal;        varying float uvY;        varying vec2 vUv;        uniform vec3 viewVector;        #ifdef USE_MORPHTARGETS            #ifndef USE_MORPHNORMALS                uniform float morphTargetInfluences[ 8 ];            #else                uniform float morphTargetInfluences[ 4 ];            #endif        #endif        void main(void) {      		vUv = uv;            vNormal = normal;            #ifdef USE_MORPHNORMALS                vec3 morphedNormal = vec3( 0.0 );                morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];                morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];                morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];                morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];                morphedNormal += normal;                vNormal = morphedNormal;            #endif            vec3 n = normalize( normalMatrix * vNormal );            vec3 v = normalize( normalMatrix * viewVector );            uvY = clamp( dot( n, v ), 0.0, 1.0 );            uvY = pow( uvY, 4.0 );            vec3 morphed = position;            #ifdef USE_MORPHTARGETS                morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];                morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];                morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];                morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];                #ifndef USE_MORPHNORMALS                    morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];                    morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];                    morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];                    morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];                #endif            #endif            gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );        }",
            //fragmentShader:document.getElementById('toon-animate-fshader').textContent,
            fragmentShader:"        precision mediump float;        uniform vec3 lightDirection;        uniform sampler2D toonTexture;        uniform sampler2D texture;        uniform vec3 viewVector;        varying vec3 vNormal;        varying float uvY;        varying vec2 vUv;        void main(void) {            vec4 tex = texture2D( texture, vUv );            if ( tex.a < 0.5 ) discard;            float diffuse = clamp(dot(vNormal, lightDirection), 0.0, 1.0);            vec4 c = tex * texture2D(toonTexture, vec2(diffuse, uvY));            gl_FragColor = c;        }",

            uniforms: {
                texture: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('assets/models/player/diffuse2.png')
                    //type: 't', value: map
                },
                toonTexture: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/toon3.png')
                },
                lightDirection: {
                    type: 'v3',
                    value: new THREE.Vector3( 1, 1, 0 )
                },
                viewVector: {
                    type: 'v3',
                    value: CameraManager.camera.position.clone().normalize()
                }
            },
            morphTargets: false,
            //morphNormals: true,
            transparent: true
        });
        */



        var playerOutlineMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
            color: 0x2d1d5f,
            morphTargets: true
        });

        var playerTransparentMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/models/transparent2.png'),
            transparent: true,
            alphaTest: .5,
            side:THREE.DoubleSide,
            morphTargets: true
        });

        playerMaterials = [playerDiffuseMaterial, playerOutlineMaterial, playerTransparentMaterial];


        
        //----------------------------------shadow-------------------------------------
        shadowMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/round_shadow.png'),
            transparent: true,
            alphaTest: .01,
            side: THREE.DoubleSide
        });


        //----------------------------------ground-------------------------------------

        //ground
        url = 'assets/models/ground.jpg';
        if (Vars.quality == 'low') url = 'assets/models/ground_low.jpg';
        var groundTex: THREE.Texture = THREE.ImageUtils.loadTexture(url);
        groundMaterial = new THREE.MeshBasicMaterial({
            map: groundTex
        });
        materials['ground'] = groundMaterial;

        //grass
        url = 'assets/models/transparent1.png';
        if (Vars.quality == 'low') url = 'assets/models/transparent1_low.png';
        var grassTex: THREE.Texture = THREE.ImageUtils.loadTexture(url);
        grassMaterial = new THREE.MeshBasicMaterial({
            map: grassTex,
            alphaTest: .5,
            side: THREE.DoubleSide
        });
        materials['grass'] = grassMaterial;

        var uniforms = { texture: { type: "t", value: grassTex } };
        //var vertexShader = document.getElementById('vertexShaderDepth').textContent;
        var vertexShader: string = "        varying vec2 vUV;        void main() {            vUV = 0.75 * uv;            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );            gl_Position = projectionMatrix * mvPosition;        }";
        //var fragmentShader = document.getElementById('fragmentShaderDepth').textContent;
        var fragmentShader:string = "uniform sampler2D texture;varying vec2 vUV;vec4 pack_depth( const in float depth ) {    const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );    const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );    vec4 res = fract( depth * bit_shift );    res -= res.xxyz * bit_mask;    return res;}void main() {    vec4 pixel = texture2D( texture, vUV );    if ( pixel.a < 0.5 ) discard;    gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );}";
        grassDepthMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        materials['grassDepth'] = grassDepthMaterial;


        var ms: Array<any> = [groundMaterial, grassMaterial];
        groundGrassMaterial = new THREE.MeshFaceMaterial(ms);
        materials['groundGrass'] = groundGrassMaterial;


        //----------------------------------box-------------------------------------
        boxMaterial = new THREE.MeshBasicMaterial({
            map: groundTex
        });
        materials['box'] = boxMaterial;
        
        //----------------------------------house-------------------------------------
        houseInnerMap = THREE.ImageUtils.loadTexture('assets/models/house_inner.jpg');
        houseInnerMaterial = new THREE.MeshBasicMaterial({
            map: houseInnerMap,
            transparent:true
            //side: THREE.DoubleSide
        });
        materials['houseInner'] = houseInnerMaterial;


        //-----------------------warp----------------------
        var warpMaterials: Array<THREE.Material> = [];
        var warpTex = THREE.ImageUtils.loadTexture('img/warp.png');
        warpBaseMaterial = new THREE.MeshBasicMaterial({
            map: warpTex,
            //transparent: true,
            //alphaTest: .5
        });
        warpMaterials.push(warpBaseMaterial);


        //warp water
        var waterTex = THREE.ImageUtils.loadTexture('img/warpWater.jpg');
        var overrayTex = THREE.ImageUtils.loadTexture('img/specular_map.jpg');
        overrayTex.wrapS = overrayTex.wrapT = THREE.RepeatWrapping;
        warpWaterMaterial = new THREE.ShaderMaterial({
            //vertexShader: document.getElementById('warp-water-vshader').textContent,
            vertexShader: "        varying vec2 vUv;        void main(void) {            vec3 pos = position;            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);            vUv = uv;        }",
            //fragmentShader: document.getElementById('warp-water-fshader').textContent,
            fragmentShader: "        uniform sampler2D texture;        uniform sampler2D overlayTexture;        uniform float time;        varying vec2 vUv;        void main(void) {            vec4 tex1 = texture2D( texture, vec2( vUv.x, vUv.y ) );            vec4 tex2 = texture2D( overlayTexture, vec2( vUv.x + time, vUv.y ) );            vec4 c = tex1 + tex2 * .3;            gl_FragColor = c;        }",

            uniforms: {
                texture: {
                    type: 't', value: waterTex
                },
                overlayTexture: {
                    type: 't', value: overrayTex
                },
                lightDirection: {
                    type: 'v3',
                    value: LightManager.light.position.clone().normalize()
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            blending: THREE.NoBlending,
            //transparent: true
            //visible:false
        });
        warpMaterials.push(warpWaterMaterial);


        //warp light
        var lightTex = THREE.ImageUtils.loadTexture('img/warp_light2.png');
        lightTex.wrapS = lightTex.wrapT = THREE.RepeatWrapping;
        warpLightMaterial = new THREE.ShaderMaterial({
            //vertexShader: document.getElementById('warp-light-vshader').textContent,
            vertexShader: "        varying vec2 vUv;        void main(void) {            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);            vUv = uv;        }",
            //fragmentShader: document.getElementById('warp-light-fshader').textContent,
            fragmentShader: "        uniform sampler2D texture;        uniform float time;        varying vec2 vUv;        void main(void) {            vec4 tex1 = texture2D( texture, vec2( vUv.x + time, vUv.y ) );            tex1.a *= .7;            gl_FragColor = tex1;        }",
            uniforms: {
                texture: {
                    type: 't', value: lightTex
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            blending: THREE.AdditiveBlending,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: false
        });
        warpMaterials.push(warpLightMaterial);


        warpMaterial = new THREE.MeshFaceMaterial(warpMaterials);
        materials['warp'] = warpMaterial;


        //----------------circle------------------
        circleMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/circle.png'),
            transparent: true,
            alphaTest: .5,
            side:THREE.DoubleSide
        });


        //----------------bikkuriButton------------------
        bikkuriButtonMaterial1 = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bikkuri_button.jpg')
        });
        materials['bikkuriButton1'] = bikkuriButtonMaterial1;

        bikkuriButtonMaterial2 = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bikkuri_button2.jpg')
        });
        materials['bikkuriButton2'] = bikkuriButtonMaterial2;


        //----------------spike------------------
        var spikeMaterial1:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x2D0683
        });
        if (Vars.quality == 'low') {
            var spikeMaterial2: any = new THREE.MeshBasicMaterial({
                color: 0xFF6962
            });
        } else {
            var c: THREE.Color = new THREE.Color(0xFF6962);
            var spikeMaterial2: any = new THREE.ShaderMaterial({
                //vertexShader: document.getElementById('diffuse-vshader').textContent,
                vertexShader: "        uniform vec3 lightPos;        varying float diffuse;        void main(void) {            vec3 normal2 = normalize(normalMatrix * normal);            vec4 vLightPos = viewMatrix * vec4( lightPos, 1.0 );            vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );            vec3 s = normalize( vLightPos.xyz - mvPos.xyz );            diffuse = max( dot( normal2, s ), 0.0 );            float specular = 2.7 * max( pow( diffuse, 5.5 ), 0.0 );            diffuse = diffuse + .3 + specular;            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);        }",
                //fragmentShader: document.getElementById('diffuse-fshader').textContent,
                fragmentShader: "        varying float diffuse;        uniform vec3 color;        void main(void) {            vec3 c = color * vec3(diffuse);            gl_FragColor = vec4(c, 1.0);        }",

                uniforms: {
                    lightPos: {
                        type: 'v3',
                        value: LightManager.light.position.clone()
                    },
                    color: {
                        type: 'v3',
                        value: new THREE.Vector3(c.r, c.g, c.b)
                    }
                },
                shading: THREE.FlatShading
            });
        }
        spikeMaterial = new THREE.MeshFaceMaterial([spikeMaterial1, spikeMaterial2]);
        materials['spike'] = spikeMaterial;

        //----------------block0 block1------------------
        var blockMaterial1: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x2D0683
        });
        if (Vars.quality == 'low') {
            var block0Material2: any = new THREE.MeshBasicMaterial({
                color: 0xBCE7E4
            });
        } else {
            var c: THREE.Color = new THREE.Color(0xBCE7E4);
            var block0Material2: any = new THREE.ShaderMaterial({
                //vertexShader: document.getElementById('diffuse-vshader').textContent,
                vertexShader: "        uniform vec3 lightPos;        varying float diffuse;        void main(void) {            vec3 normal2 = normalize(normalMatrix * normal);            vec4 vLightPos = viewMatrix * vec4( lightPos, 1.0 );            vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );            vec3 s = normalize( vLightPos.xyz - mvPos.xyz );            diffuse = max( dot( normal2, s ), 0.0 );            float specular = 2.7 * max( pow( diffuse, 5.5 ), 0.0 );            diffuse = diffuse + .3 + specular;            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);        }",
                //fragmentShader: document.getElementById('diffuse-fshader').textContent,
                fragmentShader: "        varying float diffuse;        uniform vec3 color;        void main(void) {            vec3 c = color * vec3(diffuse);            gl_FragColor = vec4(c, 1.0);        }",

                uniforms: {
                    lightPos: {
                        type: 'v3',
                        value: LightManager.light.position.clone()
                    },
                    color: {
                        type: 'v3',
                        value: new THREE.Vector3(c.r, c.g, c.b)
                    }
                },
                shading: THREE.FlatShading
            });
        }
        var block0Material: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial([block0Material2, blockMaterial1]);
        materials['block0'] = block0Material;


        //----------------skyBox------------------
        var skyBoxTex = THREE.ImageUtils.loadTexture('img/skybox/skybox.jpg');
        var skyBoxPlaneTex = THREE.ImageUtils.loadTexture('img/bg0.jpg');
        skyBoxPlaneTex.wrapS = skyBoxPlaneTex.wrapT = THREE.RepeatWrapping;
        var graTex = THREE.ImageUtils.loadTexture('img/gra0.jpg');
        RendererManager.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });
        var size: number = 200.0;
        if (platform == 'sp' || platform == 'ipad') size = 500.0;
        var stageSize: THREE.Vector2 = new THREE.Vector2(Vars.stageWidth, Vars.stageHeight);
        
        if (platform == 'sp' || platform == 'ipad') {
            stageSize = new THREE.Vector2(Vars.stageWidth * (window.devicePixelRatio / Vars.resolution), Vars.stageHeight * (window.devicePixelRatio / Vars.resolution));
        }
        var qualityLowFlag: number = 0.0;
        if (Vars.quality == 'low') qualityLowFlag = 1.0;
        skyBoxMaterial = new THREE.ShaderMaterial({
            //vertexShader: document.getElementById('skybox-vshader').textContent,
            vertexShader: "        varying vec2 vUv;        void main(void) {            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);            vUv = uv;        }",
            //fragmentShader: document.getElementById('skybox-fshader').textContent,
            fragmentShader: "uniform sampler2D texture;        uniform sampler2D overlayTexture;        uniform sampler2D graTex;        uniform sampler2D tunnelTex;        uniform float tunnelAlpha;        uniform float time;        uniform float size;        uniform vec2 stageSize;        uniform bool qualityLowFlag;        varying vec2 vUv;        vec4 getScrollBg(){            vec4 tex1 = texture2D( texture, vUv );            vec4 tex2 = texture2D( overlayTexture, vec2( gl_FragCoord.x, gl_FragCoord.y ) / vec2(size) + vec2(time)  );            if(qualityLowFlag){                return tex1 + tex2;            }else{                vec4 tex3 = texture2D( graTex, vec2( gl_FragCoord.x, gl_FragCoord.y ) / stageSize );                tex3.a = tex3.x;                tex3.xyz *= normalize(vec3(252, 95, 252));                return tex1 + tex2 + tex3;            }                    }        vec4 getTunnelBg(){                    vec4 c = texture2D( tunnelTex, vec2( gl_FragCoord.x, gl_FragCoord.y ) / stageSize );                        return vec4(c.xyz, tunnelAlpha);        }        vec3 alphaBlend( vec4 c1, vec4 c2 ){            vec3 c = c1.a * c1.xyz + ( 1.0 - c1.a ) * c2.xyz;            return c;        }        void main(void) {                        vec4 c;            if(tunnelAlpha == 0.0){                c = getScrollBg();            }else if(tunnelAlpha == 1.0){                c = getTunnelBg();            }else{                vec4 a = getScrollBg();                vec4 b = getTunnelBg();                c = vec4( alphaBlend( b, a ), 1.0);            }            gl_FragColor = c;        }",

            uniforms: {
                texture: {
                    type: 't',
                    value: skyBoxTex
                },
                overlayTexture: {
                    type: 't',
                    value: skyBoxPlaneTex
                },
                graTex: {
                    type: 't',
                    value: graTex
                },
                tunnelTex: {
                    type: 't',
                    value: RendererManager.renderTarget
                },
                tunnelAlpha: {
                    type: 'f',
                    value:0.0
                },
                time: {
                    type: 'f',
                    value: 0.0
                },
                size: {
                    type: 'f',
                    value: size
                },
                stageSize: {
                    type: 'v2',
                    value: stageSize
                },
                qualityLowFlag: {
                    type: 'f',
                    value: qualityLowFlag
                }
            }
        });

        materials['skyBox'] = skyBoxMaterial;



        
        //----------------tunnel------------------
        var rasterTexture = THREE.ImageUtils.loadTexture('img/raster.jpg');
        rasterTexture.wrapS = rasterTexture.wrapT = THREE.RepeatWrapping;
        var noiseTexture = THREE.ImageUtils.loadTexture('img/water1.jpg');
        noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
        var patternTexture = THREE.ImageUtils.loadTexture('img/bg1.jpg');
        patternTexture.wrapS = patternTexture.wrapT = THREE.RepeatWrapping;//重要 
        tunnelMaterial = new THREE.ShaderMaterial({
            //vertexShader: document.getElementById('tunnel-vshader').textContent,
            vertexShader: "uniform sampler2D texture;        uniform sampler2D rasterTex;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(){        vec3 tex = texture2D( rasterTex,  vec2(uv.x, uv.y + .2) ).xyz;        float rot = fract(time * .03);        rot *= 360.0;        float radius = tex.x * 60.0;        vec3 p = vec3(position.x + radius * cos(rot), position.y, position.z + radius * sin(rot) );        gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );        vUv = uv;        mPos = modelMatrix * vec4(position, 1.0);        }",
            //fragmentShader: document.getElementById('tunnel-fshader').textContent,
            fragmentShader: "uniform sampler2D rasterTex;        uniform sampler2D texture;        uniform sampler2D patternTexture;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(void){        vec4 tex = texture2D( texture,  vec2( vUv.x, vUv.y - time * 2.0 ) );        vec4 tex2 = texture2D( patternTexture,  vec2( vUv.x, vUv.y - time * 3.0 ) * vec2(2, 6) );        float z = ( -mPos.z * .001 ) * 3.0;         gl_FragColor = ( tex + vec4(z, 0, z, 1) ) + vec4(tex2.x);        }",
            uniforms: {
                texture: {
                    type: 't',
                    value: noiseTexture
                },
                patternTexture: {
                    type: 't',
                    value: patternTexture
                },
                rasterTex: {
                    type: 't',
                    value: rasterTexture
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            side: THREE.DoubleSide
        });



        //----------------zako------------------
        /*
        zakoMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/models/zako.png'),
            morphTargets:true
        });
        */
        zakoMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('zako-vshader').textContent,
            //vertexShader: "uniform sampler2D texture;        uniform sampler2D rasterTex;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(){        vec3 tex = texture2D( rasterTex,  vec2(uv.x, uv.y + .2) ).xyz;        float rot = fract(time * .03);        rot *= 360.0;        float radius = tex.x * 60.0;        vec3 p = vec3(position.x + radius * cos(rot), position.y, position.z + radius * sin(rot) );        gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );        vUv = uv;        mPos = modelMatrix * vec4(position, 1.0);        }",
            fragmentShader: document.getElementById('zako-fshader').textContent,
            //fragmentShader: "uniform sampler2D rasterTex;        uniform sampler2D texture;        uniform sampler2D patternTexture;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(void){        vec4 tex = texture2D( texture,  vec2( vUv.x, vUv.y - time * 2.0 ) );        vec4 tex2 = texture2D( patternTexture,  vec2( vUv.x, vUv.y - time * 3.0 ) * vec2(2, 6) );        float z = ( -mPos.z * .001 ) * 3.0;         gl_FragColor = ( tex + vec4(z, 0, z, 1) ) + vec4(tex2.x);        }",
            uniforms: {
                texture: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('assets/models/zako.png')
                },
                color: {
                    type: 'v4',
                    value: new THREE.Vector4(1, 1, 1, 1)
                }
            }
        });
        materials['zako'] = zakoMaterial;






        //animate();
        Vars.setAnimateFunc(animate.bind(this));

        Vars.pushResizeFunc(resize.bind(this));
    }


    export function initHitEffect(length:number): void {

        //----------------hitEffect------------------
        var indexs: Array<number> = [];
        var directions: Array<THREE.Vector3> = [];
        var durations: Array<number> = [];
        var sizes: Array<number> = [];
        var rotationSpeeds: Array<number> = [];
        var radius: THREE.Vector3 = new THREE.Vector3(4, 2, 4);
        for (var i: number = 0; i < length; i++) {
            indexs.push(i);
            directions.push(new THREE.Vector3(
                radius.x * .5 - radius.x * Math.random(),
                radius.y * .5 - radius.y * Math.random(),
                radius.z * .5 - radius.z * Math.random()).normalize()
                );
            durations.push(.5 + .1 * Math.random());
            sizes.push(50 + 50 * Math.random());
            rotationSpeeds.push(2 - 4 * Math.random());
        }


        //var c = new THREE.Color(0x68c1ff);    //player
        var c = new THREE.Color(0xff7c1d);  //enemy
        hitEffectMaterial0 = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('hit-effect0-vshader').textContent,
            //vertexShader: "uniform sampler2D texture;        uniform sampler2D rasterTex;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(){        vec3 tex = texture2D( rasterTex,  vec2(uv.x, uv.y + .2) ).xyz;        float rot = fract(time * .03);        rot *= 360.0;        float radius = tex.x * 60.0;        vec3 p = vec3(position.x + radius * cos(rot), position.y, position.z + radius * sin(rot) );        gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );        vUv = uv;        mPos = modelMatrix * vec4(position, 1.0);        }",
            fragmentShader: document.getElementById('hit-effect0-fshader').textContent,
            //fragmentShader: "uniform sampler2D rasterTex;        uniform sampler2D texture;        uniform sampler2D patternTexture;        uniform float time;        varying vec2 vUv;        varying vec4 mPos;        void main(void){        vec4 tex = texture2D( texture,  vec2( vUv.x, vUv.y - time * 2.0 ) );        vec4 tex2 = texture2D( patternTexture,  vec2( vUv.x, vUv.y - time * 3.0 ) * vec2(2, 6) );        float z = ( -mPos.z * .001 ) * 3.0;         gl_FragColor = ( tex + vec4(z, 0, z, 1) ) + vec4(tex2.x);        }",

            uniforms: {
                texture1: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/flare3.png')
                },
                texture2: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/star2.png')
                },
                texture3: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('img/flare1.png')
                },
                time: {
                    type: 'f',
                    value: 0.0
                },
                color: {
                    type: 'v4',
                    value: new THREE.Vector4(c.r, c.g, c.b, 1)
                },
                opacity: {
                    type: 'f',
                    value: 1.0
                }
            },
            attributes: {
                index: {
                    type: 'f',
                    value: indexs
                },
                direction: {
                    type: 'v3',
                    value: directions
                },
                duration: {
                    type: 'f',
                    value: durations
                },
                size: {
                    type: 'f',
                    value: sizes
                },
                rotationSpeed: {
                    type: 'f',
                    value: rotationSpeeds
                }
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        });


        materials['hitEffect0'] = hitEffectMaterial0;
    }


    export function setMaterial(mesh:any, name:string): void {

        if (name == 'grassDepth') {
            mesh.customDepthMaterial = materials[name];
        } else {
            mesh.material = materials[name];
            mesh.material.needsUpdate = true;
        }
    }


    var time: number = 0;
    function animate(): void {

        //requestAnimationFrame(() => animate());

        if (!animateFlag) return;

        time += Vars.delta;

        if (hitEffectMaterial0) hitEffectMaterial0.uniforms.time.value = time;

        var time1: number = time * .2;
        warpLightMaterial.uniforms.time.value = time1;
        warpWaterMaterial.uniforms.time.value = time1;

        var c: THREE.Vector4 = zakoMaterial.uniforms.color.value.clone();
        if (c.w > 0) {
            c.w -= .02;
            zakoMaterial.uniforms.color.value = c;
        }

        var time2: number = time * .1;
        skyBoxMaterial.uniforms.time.value = time2;
        tunnelMaterial.uniforms.time.value = time2;

    }


    function resize(): void {

        var stageSize: THREE.Vector2 = new THREE.Vector2(Vars.stageWidth, Vars.stageHeight);
        if (platform == 'sp' || platform == 'ipad') {
            stageSize = new THREE.Vector2(Vars.stageWidth * (window.devicePixelRatio / Vars.resolution), Vars.stageHeight * (window.devicePixelRatio / Vars.resolution ));
        }
        skyBoxMaterial.uniforms.stageSize.value = stageSize;
        
    }

}