module ParticleManager {

    export var particles: any = {};


    export function setParticle(particle:THREE.Object3D, name:string): void {

        particles[name] = (particle);

    }

    export function on(name: string): void {

        if (name.indexOf('starParticle') != -1 || name == 'hitEffectParticle0') {
            particles[name].on();
        } else {
            particles[name].visible = true;
        }
    }


    export function off(name:string): void {

        if (name.indexOf('starParticle') != -1 || name == 'hitEffectParticle0') {
            particles[name].off();
        } else {
            particles[name].visible = false;
        }
    }


}