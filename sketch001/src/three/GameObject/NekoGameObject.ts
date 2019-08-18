///<reference path="GameObject.ts"/>
///<reference path="../../Tween/TweenManager.ts"/>
class NekoGameObject extends GameObject{

    public revivePosition: THREE.Vector3 = new THREE.Vector3(0, 2, 0);
    public nowTween: TWEEN.Tween;



    constructor( defaultPosition:THREE.Vector3 = null) {

        super(defaultPosition);


        //this.nekoGOAnimate();
        Vars.setAnimateFunc(this.nekoGOAnimate.bind(this));

    }

    
    //-------------------------show-------------------------
    public show(duration:number, delay:number): void {

        if (!this.mesh) return;
        
        if (!this.nowTween) {
            this.mesh.scale.copy(new THREE.Vector3(.01, .01, .01));
            this.mesh.updateMatrix();
            this.nowTween = TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.nowScale, this.nowScale, this.nowScale), duration, TWEEN.Easing.Elastic.Out, delay, function () { this.nowTween = null; }.bind(this));
        }
    }

    
    
    //-------------------------resetRevivePosition-------------------------
    public resetRevivePosition(groundPos: THREE.Vector3, reviveY: number, reviveXZ: THREE.Vector3): void {

        this.revivePosition.set(reviveXZ.x, reviveY, reviveXZ.z).add(groundPos.clone());

        if (this.position.distanceTo(this.revivePosition) < 5) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
        } else {
            if (!this.mesh) {
                PhysicsManager.resetVelocity(this.rigidBodyIndex);
                PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
                return;
            }
            TweenManager.addTweenScale(this.mesh, new THREE.Vector3(.01, .01, .01), 500, TWEEN.Easing.Elastic.Out, 0, this.fadeOutComp.bind(this));
        }
    }

    private fadeOutComp():void{

        PhysicsManager.resetVelocity(this.rigidBodyIndex);
        PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);

        TweenManager.addTweenScale(this.mesh, new THREE.Vector3(this.defaultScale, this.defaultScale, this.defaultScale), 500, TWEEN.Easing.Elastic.Out );
    }



    
    //-------------------------animate-------------------------
    public nekoGOAnimate(): void {

        //requestAnimationFrame(() => this.nekoGOAnimate());

        if (this.position.y < -10 && this.rigidFlag && !this.deadFlag) {
            PhysicsManager.resetVelocity(this.rigidBodyIndex);
            PhysicsManager.setPosition(this.rigidBodyIndex, this.revivePosition);
            this.show(1000, 1000 * Math.random());
        }

    }
}