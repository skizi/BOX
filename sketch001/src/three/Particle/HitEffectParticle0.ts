class HitEffectParticle0 extends THREE.Object3D {

    private particleGroup: any;
    private Untitled1Emitter: any;
    public mesh: THREE.PointCloud;

    private alive: number = 1;
    private flag: boolean = true;



    constructor() {

        super();


        var particleScale: number = 6;


        var geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4);
        MaterialManager.initHitEffect(geometry.vertices.length);
        this.mesh = new THREE.PointCloud(geometry, MaterialManager.hitEffectMaterial0);
        this.add(this.mesh);



        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));

        setTimeout(function () {
           this.visible = false;
        }.bind(this), 1000);
    }


    private animate(): void {

        if (!this.visible) return;

    }


    public on(): void {

        this.visible = true;
        this.mesh.material.uniforms.opacity.value = 0.0;
        TweenManager.addTweenObj(this.mesh.material.uniforms.opacity, { value:1.0 }, 200, TWEEN.Easing.Linear.None);

    }


    public off(): void {

        TweenManager.addTweenObj(this.mesh.material.uniforms.opacity, { value: 0.0 }, 500, TWEEN.Easing.Linear.None, 0, this.offComp.bind(this));

    }

    private offComp(): void {

        this.visible = false;

    }

}