class Ground2 extends GameObject{

    public groundIndex: number = 0;
    private groundLength: number = GroundData.positions.length;
    public defaultObjects: Array<THREE.Object3D> = [];
    public grounds: Array<GroundInner> = [];

    private fireParticle1: FireParticle1;
    private leafParticle1: LeafParticle1;
    private hotalParticle1: HotalParticle1;
    private groundMaterial: THREE.Material;




    private rigidMeshs: Array<THREE.Mesh> = [];

    private totalCaughtTime: number = 0;
    public player: any;

    private rotateCount: number = 0;

    private callBack: Function;






    private moveTargetsO: Array<THREE.Vector3> = [
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(10, 5, 0),
        new THREE.Vector3(0, 5, 4)
    ];
    public moveTargetOPoints: Array<THREE.Object3D> = [];

    private moveTargetsU: Array<THREE.Vector3> = [
        new THREE.Vector3(-8.5, -5, 0),
        new THREE.Vector3(-8, -5, -9.6),
        new THREE.Vector3(6, -5, -9.2),
        new THREE.Vector3(-8, -5, -9.6),
        new THREE.Vector3(-8.7, -5, 7)
    ];
    public moveTargetUPoints: Array<THREE.Object3D> = [];




    constructor(callBack: Function) {

        super();

        this.name = 'ground';

        this.callBack = callBack;
        var url: string = 'assets/models/scene_test4.js';
        new LoadManager(url, "scene", this.modelLoadCompHandler.bind(this));   //scene or json


        this.animate();
    }


    
    //-------------------------model load comp-------------------------
    private modelLoadCompHandler(result: any): void {

        AssetManager.assets = result;


        this.initGroundData();
        this.initObject();
        this.setGround();
        this.groundIndex++;

        this.callBack('loadComp');
    }

    
    //-------------------------groundData-------------------------
    private initGroundData(): void {

        for (var i: number = 0; i < this.groundLength; i++) {

            //blenderのflipYZはただメッシュのrotationに+90度しただけなので、ジオメトリ自体は回転していない
            //なのでyとzを逆にした値を代入する。
            var size: THREE.Vector3 = MeshManager.getSize(AssetManager.assets.objects['ground' + i + 'Collision']);
            GroundData.positions[i].ground.size.set(size.x, size.z, size.y);

            var ground: any = GroundData.positions[i].ground;
            ground.groundY = ground.position.y + ground.size.y * .5;
        }
    }


    
    //-------------------------init object-------------------------
    private initObject(): void {

        //house2
        var house2: House2 = new House2();
        this.add(house2);

        var floorMesh: THREE.Mesh = MeshManager.duplicate(AssetManager.assets.objects['houseInnerFloor']);
        floorMesh.position.copy(house2.position);
        MaterialManager.setMaterial(floorMesh, 'houseInner');
        this.add(floorMesh);



        //add tree hit object
        var tree1: CollisionObject = new CollisionObject(this.callBack);
        tree1.position.set(0, 3, -9);
        tree1.name = 'tree1';
        this.add(tree1);

        var tree2: CollisionObject = new CollisionObject(this.callBack);
        tree2.position.set(5, 4, -9);
        tree2.name = 'tree2';
        this.add(tree2);

        var tree3: CollisionObject = new CollisionObject(this.callBack);
        tree3.position.set(-9.1, -11.0, 8.84);
        tree3.name = 'tree3';
        this.add(tree3);


        //add player move targets
        var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
        var length: number = this.moveTargetsO.length;
        for (var i: number = 0; i < length; i++) {
            var geometry: THREE.SphereGeometry = new THREE.SphereGeometry(.5, 6, 6);
            var point: THREE.Mesh = new THREE.Mesh(geometry, material);
            //var point: THREE.Object3D = new THREE.Object3D();
            point.position.copy(this.moveTargetsO[i]);
            point.position.y = GroundData.positions[0].ground.groundY;
            this.moveTargetOPoints.push(point);
            this.add(point);
        }

        length = this.moveTargetsU.length;
        for (var i: number = 0; i < length; i++) {
            var geometry: THREE.SphereGeometry = new THREE.SphereGeometry(.5, 6, 6);
            var point: THREE.Mesh = new THREE.Mesh(geometry, material);
            //var point: THREE.Object3D = new THREE.Object3D();
            point.position.copy(this.moveTargetsU[i]);
            point.position.y = -GroundData.positions[0].ground.groundY;
            this.moveTargetUPoints.push(point);
            this.add(point);
        }

        //set defaultObjects
        for (var i: number = 0; i < this.groundLength; i++) {
            //var geometry: THREE.SphereGeometry = new THREE.SphereGeometry(3, 6, 6);
            //var object: THREE.Mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true }));
            var object: THREE.Object3D = new THREE.Object3D();
            var pos: THREE.Vector3 = GroundData.positions[i].ground.position;
            object.position.copy(pos);
            this.add(object);
            this.defaultObjects.push(object);
        }

    }


    public setGround(): void {

        this.setGroundMesh();
        
        //rigidBodyを設定
        this.setRigidBodyMesh();
        AmmoManager.setRigidBodyManyShape(this.rigidMeshs, this);
        AmmoManager.setQuaternion('ground', this.quaternion);

    }


    private setGroundMesh():void{

        /*
        //door
        var doorMesh: THREE.Mesh = AssetManager.assets.objects.Cube;
        doorMesh.scale.multiplyScalar( 4 );
        doorMesh.updateMatrix(); //scaleを変更したらupdateMatrixが必要
        var meshs: Array<THREE.Mesh> = MeshManager.duplicates(doorMesh, 100);
        var obj: any = PropertyManager.rotations(meshs, 3);
        var mesh: THREE.Mesh = MeshManager.merge(obj.meshs);
        //this.add(mesh);
        mesh.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        PostprocessManager1.add(mesh);

        CameraManager.addCameraMovePoints(obj.positions);
        

        //house
        var houseMeshs: Array<THREE.Mesh> = [AssetManager.assets.objects.home1, AssetManager.assets.objects.home2, AssetManager.assets.objects.home3 ];
        //PropertyManager.sizes(houseMeshs, 1);
        //PropertyManager.rotations(houseMeshs, 180 * Vars.toRad);
        PropertyManager.positions( houseMeshs, new THREE.Vector3( 0, 0, 10 ) );
        for (var i: number = 0; i < houseMeshs.length; i++) {
            houseMeshs[i].material = new THREE.MeshPhongMaterial({ color: 0x88dcff, specular:.8 });
            PostprocessManager1.add(houseMeshs[i]);
        }
        new RollDownManager(houseMeshs, 5);
        */

        //ground
        var groundInner: GroundInner = new GroundInner(this.groundIndex);
        this.grounds.push(groundInner);
        this.add(groundInner);
        DomManager.debug.html(groundInner.position.y + ", ");


        /*
        var grassMesh: THREE.Mesh = AssetManager.assets.objects.grass;

        grassMesh.material = grassMaterial;
        grassMesh.material.needsUpdate = true;
        this.add(grassMesh);

        */
        /*
        var takibiMesh: THREE.Mesh = AssetManager.assets.objects.takibi;
        var takibiMap = THREE.ImageUtils.loadTexture('assets/models/takibi.jpg')
        var takibiMaterial = new THREE.MeshBasicMaterial({
            map: takibiMap
        });
        takibiMesh.material = takibiMaterial;
        takibiMesh.material.needsUpdate = true;
        */
        /*
        var meshs: Array<THREE.Mesh> = [ground1Mesh, grassMesh];
        var groundMesh: THREE.Mesh = MeshManager.merge(meshs);
        this.add(groundMesh);  
        */


        /*
        this.fireParticle1 = new FireParticle1();
        //this.fireParticle1.position.copy(takibiMesh.position);
        this.fireParticle1.position.set(-.1, -5.3, -9.1);
        this.fireParticle1.rotation.x = 180 * Vars.toRad;
        this.add(this.fireParticle1);
        */

        
        this.leafParticle1 = new LeafParticle1();
        ParticleManager.setParticle(this.leafParticle1, 'leafParticle1');
        this.add(this.leafParticle1);

        this.hotalParticle1 = new HotalParticle1();
        ParticleManager.setParticle(this.hotalParticle1, 'hotalParticle1');
        ParticleManager.off('hotalParticle1');
        this.add(this.hotalParticle1);





        /*var _grounds: Array<THREE.Mesh> = [ground1Mesh];
        
        GroundManager.init();
        var grounds: Array<THREE.Mesh> = GroundManager.initGround(_grounds);
        for (var i: number = 0; i < grounds.length; i++) this.add(grounds[i]);
        */



        /*
        //water rock
        var waterTex = THREE.ImageUtils.loadTexture('img/water1.jpg')
        waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
        this.waterMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('scroll-vshader').textContent,
            fragmentShader: document.getElementById('scroll-fshader').textContent,

            uniforms: {
                texture: {
                    type: 't', value: THREE.ImageUtils.loadTexture('img/snow_negative_z.jpg')
                },
                overlayTexture: {
                    type: 't', value: waterTex
                },
                lightDirection: {
                    type: 'v3',
                    value: this.light.position.clone().normalize()
                },
                time: {
                    type: 'f',
                    value: 0.0
                }
            },
            blending: THREE.NoBlending, transparent: true
        });


        var meshs: Array<THREE.Mesh> = [];
        for (var i: number = 0; i < 20; i++) {
            var geometry: THREE.Geometry = new THREE.SphereGeometry(4, 30, 30);
            var mesh: THREE.Mesh = new THREE.Mesh(geometry);
            var x:number = 40 * Math.random() - 20;
            var z:number = 300 * Math.random();
            mesh.position.set( x, 0, z );
            meshs.push(mesh);
        }
        var mesh: THREE.Mesh = MeshManager.merge(meshs);
        mesh.material = this.waterMaterial;
        this.add(mesh);
        */

    }

    
    //-------------------------physics-------------------------
    private setRigidBodyMesh(): void {

        //ground
        var name: string = 'ground' + this.groundIndex;

        for (var assetName in AssetManager.assets.objects ) {
            if (assetName.indexOf(name + 'Collision') != -1) {
                this.rigidMeshs.push(AssetManager.assets.objects[assetName]);
                DomManager.debug.html(DomManager.debug.html() + AssetManager.assets.objects[assetName].position.y);
                if(this.debugFlag){
                    AssetManager.assets.objects[assetName].material = new THREE.MeshBasicMaterial({ visible:false, wireframe: true });
                    this.add(AssetManager.assets.objects[assetName]);
                }
            }
        }

        /*
        var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({visible:false});
        var length: number = AssetManager.assets.objects.length;
        for (var name in AssetManager.assets.objects) {

            var meshName: string = '';
            if (name.indexOf('catchO') != -1) meshName = 'caughtCollisionO';
            if (name.indexOf('catchU') != -1) meshName = 'caughtCollisionU';
            if (meshName != '') {
                AssetManager.assets.objects[name].name = meshName;
                AssetManager.assets.objects[name].material = material;
                AssetManager.assets.objects[name].material.needsUpdate = true;
                this.add(AssetManager.assets.objects[name]);
                RaycastManager.add(AssetManager.assets.objects[name]);
            }
        }
        */
    }



    //地面が回転したときにプレイヤーが地面の端につかまっていたら落とす
    private playerCaughtCheck(pluseTime: number = 0): void {

        if (!this.player || !this.player.caughtFlag) return;

        this.totalCaughtTime += 1 + pluseTime;
        if (this.totalCaughtTime > 50) {
            this.totalCaughtTime = 0;
            this.player.releaseCaught();
        }
    }


    public flipEnd(): void {
        this.rotateCount++;
        if (this.rotateCount == 2) {
            this.rotateCount = 0;

            if (this.groundIndex < this.groundLength) {
                this.setGround();
                this.callBack('addGround', { index: this.groundIndex });

                this.groundIndex++;
            }
        }
    }


    private animate(): void {


        //this.playerCaughtCheck();

    }

 }