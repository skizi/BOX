class PixiParticle1 extends PIXI.DisplayObjectContainer{

    private particles: Array<PixiParticleBaseMovie> = [];
    private hideCallBack: Function;
    private speed: number = 24;

    constructor() {

        super();


        var spriteSheet: Array<PIXI.Texture> = [];
        for (var i = 0; i < 20; i++) {
            var texture: PIXI.Texture = PIXI.Texture.fromFrame("particle1" + i);
            spriteSheet.push(texture);
        };

        for (var i: number = 0; i < 100; i++) {
            var particle: PixiParticleBaseMovie = new PixiParticleBaseMovie(spriteSheet);
            particle.position.x = Vars.stageWidth * .5;
            particle.position.y = Vars.stageHeight * .5;
            particle.scale.x = particle.scale.y = 3 * Math.random();
            particle.speed = new THREE.Vector2(
                (this.speed * Math.random() - this.speed * .5) * Vars.fpsStep,
                (this.speed * Math.random() - this.speed * .5) * Vars.fpsStep
                );
            particle.blendMode = PIXI.blendModes.SCREEN;
            particle.play();
            this.particles.push(particle);
            this.addChild(particle);
        }

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }


    public show(): void {

        this.visible = true;
        this.alpha = 0;
        TweenManager.addTweenObj(this, { alpha: 1 }, 500, TWEEN.Easing.Linear.None);

    }



    public hide(callBack:Function = null): void {

        this.hideCallBack = callBack;

        TweenManager.addTweenObj(this, { alpha: 0 }, 500, TWEEN.Easing.Linear.None, 0, this.hideComp.bind(this));

    }


    private hideComp(): void {

        this.visible = false;
        if (this.hideCallBack) this.hideCallBack();

    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!this.visible) return;

        for (var i: number = 0; i < 100; i++) {
            this.particles[i].position.x += this.particles[i].speed.x;
            if (this.particles[i].position.x > Vars.stageWidth) this.particles[i].position.x = Vars.stageWidth * .5;
            if (this.particles[i].position.x < -100) this.particles[i].position.x = Vars.stageWidth * .5;

            this.particles[i].position.y += this.particles[i].speed.y;
            if (this.particles[i].position.y > Vars.stageHeight) this.particles[i].position.y = Vars.stageHeight * .5;
            if (this.particles[i].position.y < -100) this.particles[i].position.y = Vars.stageHeight * .5;

        }
    }

} 