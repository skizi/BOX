class CloudParticle1 extends THREE.Object3D {

    private particleGroup: any;
    public mesh: THREE.Mesh;


    constructor() {

        super();

        var particleScale: number = 3;

        // Create particle group
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/cloud.png'),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });

        // Create particle emitter 0
        var Untitled1Emitter = new SPE.Emitter({
            type: 'sphere',
            particleCount: 20,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(2, 2, 2),
            radius: 0.6,
            radiusSpread: 0,
            radiusSpreadClamp: 0,
            radiusScale: new THREE.Vector3(1, .2, 1),
            speed: 0.5,
            speedSpread: 0,
            sizeStart: 4 * particleScale,
            sizeStartSpread: 0,
            sizeMiddle: 10 * particleScale,
            sizeMiddleSpread: 0,
            sizeEnd: 1 * particleScale,
            sizeEndSpread: 0,
            angleStart: 0,
            angleStartSpread: 0,
            angleMiddle: 0,
            angleMiddleSpread: 0,
            angleEnd: 0,
            angleEndSpread: 0,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xffffff),
            colorStartSpread: new THREE.Vector3(0, 0, 0),
            colorMiddle: new THREE.Color(0xffffff),
            colorMiddleSpread: new THREE.Vector3(0, 0, 0),
            colorEnd: new THREE.Color(0xffffff),
            colorEndSpread: new THREE.Vector3(0, 0, 0),
            opacityStart: 0.01,
            opacityStartSpread: 0,
            opacityMiddle: 0.4,
            opacityMiddleSpread: 0,
            opacityEnd: 0,
            opacityEndSpread: 0,
            duration: null,
            alive: 1,
            isStatic: 0
        });


        this.particleGroup.addEmitter(Untitled1Emitter);

        // Add mesh to your scene. Adjust as necessary.
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }

    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!this.visible) return;

        var delta = Vars.delta;
        this.particleGroup.tick(delta);

    }

}