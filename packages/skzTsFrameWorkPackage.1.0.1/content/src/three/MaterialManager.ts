module MaterialManager {


    export function test():THREE.ShaderMaterial {

        var material = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vshader').textContent,
            fragmentShader: document.getElementById('fshader').textContent,
            /*
            uniforms: {
                time: { type: 'f', value: 0 },
                size: { type: 'f', value: 0.13 },
                color: { type: 'c', value: new THREE.Color(0xffcc88) },
                texture: { type: 't', value: texture }
            },
            attributes: {
                lifetime: { type: 'f', value: [] },
                shift: { type: 'f', value: [] }
            },
            */
            blending: THREE.AdditiveBlending, transparent: true, depthTest: false
        });

        return material;
    }


}