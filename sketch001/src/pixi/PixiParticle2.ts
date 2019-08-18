class PixiParticle2 extends PIXI.DisplayObjectContainer{

    private particles: Array<PixiParticleBaseSprite> = [];
    private hideCallBack: Function;
    private speed: number = 24;

    constructor() {

        super();



        for (var i: number = 0; i < 100; i++) {
            var texture: PIXI.Texture = PIXI.Texture.fromFrame("star1" + Math.floor( 3.9 * Math.random() ));
            var particle: PixiParticleBaseSprite = new PixiParticleBaseSprite(texture);
            particle.position.x = Vars.stageWidth * .5 - 100;
            particle.position.y = Vars.stageHeight * .5 - 100;
            particle.scale.x = particle.scale.y = 1.5 * Math.random();
            particle.w = particle.width;
            particle.h = particle.height;
            particle.speed = new THREE.Vector2(
                (this.speed * Math.random() - this.speed * .5) * Vars.fpsStep,
                (this.speed * Math.random() - this.speed * .5) * Vars.fpsStep
                );
            particle.blendMode = PIXI.blendModes.SCREEN;
            this.particles.push(particle);
            this.addChild(particle);
        }

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));


        setTimeout(function () {
            this.visible = false;
        }.bind(this), 500);

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
            if (this.particles[i].position.x > Vars.stageWidth) this.particles[i].position.x = Vars.stageWidth * .5 - 100;
            if (this.particles[i].position.x < -this.particles[i].w) this.particles[i].position.x = Vars.stageWidth * .5 - 100;

            this.particles[i].position.y += this.particles[i].speed.y;
            if (this.particles[i].position.y > Vars.stageHeight) this.particles[i].position.y = Vars.stageHeight * .5 - 100;
            if (this.particles[i].position.y < -this.particles[i].h) this.particles[i].position.y = Vars.stageHeight * .5 - 100;

        }
    }

} 