class SkyBox extends THREE.Object3D{

    constructor() {

        super();

        var imagePrefix = "img/skybox/grimnight_";
        var directions = ["posX", "negX", "posY", "negY", "posZ", "negZ"];
        var imageSuffix = ".png";
        var skyGeometry = new THREE.CubeGeometry(20000, 20000, 20000);  //5000

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.add(skyBox);
    }

} 