class ParticleManager extends THREE.Object3D {


    constructor() {

        super();


        var geometry = new THREE.Geometry();

        var sprite1 = THREE.ImageUtils.loadTexture("img/sprites/snowflake1.png");
        var sprite2 = THREE.ImageUtils.loadTexture("img/sprites/snowflake2.png");
        var sprite3 = THREE.ImageUtils.loadTexture("img/sprites/snowflake3.png");
        var sprite4 = THREE.ImageUtils.loadTexture("img/sprites/snowflake4.png");
        var sprite5 = THREE.ImageUtils.loadTexture("img/sprites/snowflake5.png");

        for (var i = 0; i < 10000; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 10000 - 5000;
            vertex.y = Math.random() * 3000;
            vertex.z = Math.random() * 5000;

            geometry.vertices.push(vertex);

        }

        var parameters = [[[1.0, 0.2, 0.5], sprite2, 20],
            [[0.95, 0.1, 0.5], sprite3, 15],
            [[0.90, 0.05, 0.5], sprite1, 10],
            [[0.85, 0, 0.5], sprite5, 8],
            [[0.80, 0, 0.5], sprite4, 5],
        ];


        var materials = [];
        for (i = 0; i < parameters.length; i++) {

            var color = parameters[i][0];
            var sprite = parameters[i][1];
            var size = parameters[i][2];

            materials[i] = new THREE.ParticleSystemMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
            materials[i].color.setHSL(color[0], color[1], color[2]);

            var particles = new THREE.ParticleSystem(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            this.add(particles);

        }


    }


}