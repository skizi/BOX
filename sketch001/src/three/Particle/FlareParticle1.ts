class FlareParticle1 extends THREE.Object3D {

    private particleGroup: any;
    private Untitled1Emitter: any;
    public mesh: THREE.Mesh;

    private alive: number = 1;
    private flag: boolean = true;



    constructor() {

        super();


        var particleScale: number = 6;

        // Create particle group
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/flare3.png'),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });

        // Create particle emitter 0
        var Untitled1Emitter = new SPE.Emitter({
            type: 'sphere',
            particleCount: 50,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(0, 0, 0),
            radius: 10,
            radiusSpread: 0,
            radiusSpreadClamp: 0,
            radiusScale: new THREE.Vector3(0, 0, 0),
            sizeStart: 0 * particleScale,
            sizeStartSpread: 8,
            sizeMiddle: 2.5 * particleScale,
            sizeMiddleSpread: 8,
            sizeEnd: 1 * particleScale,
            sizeEndSpread: 8,
            angleStartSpread: 6,
            angleMiddleSpread: 6,
            angleEndSpread: 6,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xffffff),
            colorMiddle: new THREE.Color(0xff7c1d),
            colorEnd: new THREE.Color(0xe3e900),
        });


        this.particleGroup.addEmitter(Untitled1Emitter);


        // Add mesh to your scene. Adjust as necessary.
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));

        setTimeout(function () {
            this.visible = false;
        }.bind(this), 1000);
    }


    private animate(): void {

        if (!this.visible) return;

        this.particleGroup.tick(Vars.delta);

    }


    public on(): void {

        this.visible = true;

    }


    public off(): void {

        this.visible = false;

    }

}