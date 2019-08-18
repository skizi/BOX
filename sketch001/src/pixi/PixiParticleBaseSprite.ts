class PixiParticleBaseSprite extends PIXI.Sprite {

    public speed: THREE.Vector2 = new THREE.Vector2();
    public w: number = 0;
    public h: number = 0;


    constructor(texture:PIXI.Texture) {

        super(texture);

    }


}