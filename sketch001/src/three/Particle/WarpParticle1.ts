class WarpParticle1 extends THREE.Object3D {

    private particleGroup: any;
    public mesh: THREE.Mesh;


    constructor() {

        super();

        var size = 2;


        // Create particle group
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/particle3.png'),
            //texture: THREE.ImageUtils.loadTexture('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAdCSURBVHja7FuJbus2EBQPSUne0W/rl/bf+l7iQyJZGOAC08lQh+0YLRIDhC7b8s7uzl6yK6V0n/nlu0/++gLgswMQ8eCvXx9+P0fHRZx/CCn9+UMA8CDB3QIgdq48Coz4QG27lfcVce6yzf8XANzCObeRi1DzRfBU/q9bwJLAga550rrazwKMu7pH/ED/RoFx+QVCzKRpX/cRiLu6R7yj4E5oOTSEDw0QEgBhAib4nB0bYDdbRLyTxj0Jh0JHAsg1viPX73Cg8QTH6nqmqPEwC2AhPGg4kOARrtl1T+yPAsz1WqrLtD4DEB25AbpDeRQAbMoBthcB+3rci3Oh4csFhC11a0AEOJ/rfkfcUPZaRLzC7Dl0oeCRhB3q1tdrEfZ9gwAnENCEn+pxqPsOOKMDy3B73SJeafahIXwPK1YABhDeznlygwzmb8LPIPip7gdwDxVFdltCvEL7gYjPtGnCXq4/1dWDJQywH4k4UXjT+LmuU30/7p8aVpn21hRxo/COLMCTyV8EG+vqAYDL8TMAMAIInoRI4P8mrK1j3Ya6v6SgLPKDcqsFOGJyZHQTeADBL+uFtiNZQqAUuFTN2zrCunz2DT5zFHVEoeoy3csFWqEukok/w3qp2291vQBIA3BEIPZPYPoXIQ9V8AMRbGy4AKbQDjLJJh/EKxIeJL0IGjfBv8H6AQCYO4xgOZ4yvpl8/0BE6hv+PoFVYt2QbrUAT/seNBHBtMe6fxH2e10X4X8CAM/ABz1YUkexfQK/fwILU1lkBvDMSrKQoWkFWzmAgYgU6kz7ZgF/VABsGQBPDQ7owAIsAhwqsOgqrP2Z3AfriVmExHcg7AmDgcJXJPZ/qZr/CcuOn8ENegDAidzf4v7lva+UOpulTLBNRJ6hkSfscoGl2I8EOIBvPwsX+AF8gObfk2UVAqAHsAOZO2aJ5i4DAJDoc2kpFMYd4Q99H+P6QCSIRPidSJDNnwEw4SJlixkKI8wTLEROQMozccEiGcaN4Y9r/gCaHAGAJ9D2C50fgcyCaIwU0J6H+xWqCU6Ub4xAgBFcy0MB5fYA4BozAyfSX0xzUVgUfgThsSByoh3uRamM5PhchX2i1Hqs1oBhOpPmZTSIG4hPtbQCmPJAaxTnetKQXyhmuoZbnOgeYyOxCjuasYsAFKr1O2hwoBtEKn3VcRDCq7Z5Jl7I9H1cT2AyFVc6TquJjsr+CkUCNE3kAwRkIJBY6KUf6IWlBco8I4ASKE9wlLJ3dP93DVkvzLDFAXgOW1uBBPYrgjvRX3CNytOJdloQbTZP/OTELKGotplvFBTcglZNEXyPW9Hw1inRGhjqfZ7Ic02Jiy6gKis1rSmNaU3u9MBzEyEJYJfq+bIh0SlrIGwBoGskEpy+JgpdmawpN2r3pftnaoFj8ZNojqBMvKwNT+JGbRS4mdJ+oh4epquZQOA437pfJpCxYzQTEPPCOK3csy2eKCWdKQdHEHAFkd11wswLCZbFd/F9kminl61WEHf4JdftiQA4UY4+QJ6uAPBCO2zmWOVhnxDPKyXcbS6AhMQ+PwsAcGEXNzSEd8LnU+N7D9AcPcI9ziB8JtfplkLgVgsopBXcP5PWD1CkDJT94T1b4zFui9t3HqhHyCDPC/yw2wJaQ4UMTQjr0/cg/JF6eD2VvPaDhoZLcOFj3/lW1yvsIygzWEFuRIXdLlCgtRyAvQu0m+yHHsTwQ3V8kLHVYERp/1gF/1UF/12PX+G6WYJ9VinupiiQqS637MsswPz0lXJ03/DrUaTKWQBgWjYAbP2u6w0AmMAKMBTfbTZYYBrr4ceeoC8QRa8/UzmLU6JWV/gMAJjJMwDsCooI0y15QBHJCpo/+m+sP8LReeSMc22SnKhidI2uMJLqK4DwN7jBkYgwL6TpV43GMo2ZPHCBCaZmB5w0cf9uyQISxfs3AOEVhLfzJxqnqwiQr22KtsKhZV5GZCeqtdOCSY/AAYOwllmQ4BGiwIFCI4bBaes88JZUGEkRk44zDSQzZXBH6gr3ggSLiAIYYs8VhDPkAkewgEw1y80uoPKCsjCHx7E0at+aozhJCo2BB/PAGbYIhJ3DwmuX6e+1AH4QKYhyt6eMbqJ0FjUf4N5OPB+QKME50fZMvo9Z6mbhr+EAfqSFCTFTM9OusdkHce/c/fvBqBlIcQKNY9GzK+TdgwM4I8xQ3LAvTpA49aKByq1r1N5Ew5AkyuFM7pj2av8WEvTkDqrowBR6opG46vGpzs8EVlGoC5REpbf7WcFrnxPE/n2m+RsKgQKnxkBEPTDJgmYiyo4s8OrXLc8KZzJfR2AUIk5P2WIRc4Yi3CsRqKoRWh7FAWshMgstlw0t7la4zaIx2nX60fryaAtQ5aanH8kWoGYNfkOrO99L4x8BwBI3dCLba7XX3YrQH/L6iP8Mqae5u+7932LUc71qhF1oyHHzI/IfDcBa8rTku2vh7O5W4b7+O/zJX18AfHYA/hFgAMQ2DcpHFOuKAAAAAElFTkSuQmCC'),
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
            type: 'cube',
            particleCount: 57,
            positionSpread: new THREE.Vector3(2, 0, 2),
            velocity: new THREE.Vector3(0, 0.6666666666666679, 0),
            velocitySpread: new THREE.Vector3(0, 1.5555555555555556, 0),
            sizeMiddle: 0.5555555555555556 * size,
            sizeMiddleSpread: 0.5555555555555556,
            sizeEnd: 0.2777777777777778 * size,
            colorStart: new THREE.Color(0x9ecfff),
            colorMiddle: new THREE.Color(0xceedff),
            colorMiddleSpread: new THREE.Vector3(0.2, 0.2, 0.2)
        });



        // Add mesh to your scene. Adjust as necessary.
        this.add(this.particleGroup.mesh);


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