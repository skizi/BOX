///<reference path="GameObject/Player/Player.ts"/>
///<reference path="GameObject/Item/Item.ts"/>
class Scene extends THREE.Scene {

    private snake: Snake;


    private player: Player;
    private ground: Ground;
    private groundLength: number = StageData.stages.length;

    public leafParticle1: LeafParticle1;
    private hotalParticle1: HotalParticle1;
    public starParticle1: StarParticle1;
    public flareParticle1: FlareParticle1;
    public hitEffectParticle0: HitEffectParticle0;

    private start: number = Date.now();



    private itemAddInterval: number = .2;
    private lastAddItemTime: number = 0;
    private items: Array<Item> = [];
    private itemsLength: number = 0;
    private maxItemLength: number = 10;



    //house
    private houses: Array<House> = [];
    private houseLength: number = 10;

    private rigidBodys: any = {};

    //ufo
    private ufo: Ufo;
    private cloud: Cloud;

    //
    public skyBox: SkyBox;




    constructor() {

        super();

        CameraManager.init();

    }


    public initObjects(): void {

        CoverManager.init();
        this.initMesh();

        setTimeout(function () {
            Vars.initCompFlag = true;
            StageManager.nextStage();
            SoundManager.mainMusicId = SoundManager.play(1, true, 0);
            SoundManager.tweenInstanceVolume(SoundManager.mainMusicId, 1, 1000);
        }.bind(this), 1000);


        this.animate();

    }


    private initMesh(): void {

        //skybox
        this.skyBox = new SkyBox();
        this.add(this.skyBox);

        //particle
        if (Vars.quality != 'low') {
            this.leafParticle1 = new LeafParticle1();
            ParticleManager.setParticle(this.leafParticle1, 'leafParticle1');
            this.add(this.leafParticle1);
        }
        /*
        this.hotalParticle1 = new HotalParticle1();
        ParticleManager.setParticle(this.hotalParticle1, 'hotalParticle1');
        ParticleManager.off('hotalParticle1');
        this.add(this.hotalParticle1);
        */

        this.starParticle1 = new StarParticle1();
        ParticleManager.setParticle(this.starParticle1, 'starParticle1');
        this.add(this.starParticle1);


        this.flareParticle1 = new FlareParticle1();
        this.flareParticle1.position.y = 4;
        ParticleManager.setParticle(this.flareParticle1, 'flareParticle1');
        this.add(this.flareParticle1);


        this.hitEffectParticle0 = new HitEffectParticle0();
        this.hitEffectParticle0.position.y = 4;
        ParticleManager.setParticle(this.hitEffectParticle0, 'hitEffectParticle0');
        this.add(this.hitEffectParticle0);


        /*
        //add snake
        var geometry:THREE.Geometry = new THREE.SphereGeometry(1, 30, 30);
        var material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        //var material: THREE.ShaderMaterial = MaterialManager.test();
        var mesh: THREE.Mesh = new THREE.Mesh(geometry, material);

        var meshs: Array<THREE.Mesh> = MeshManager.duplicates(mesh, 10);
        meshs = PropertyManager.randomSizes(meshs, .5, 2);
        for (var i = 0; i < meshs.length; i++) {
            this.add(meshs[i]);
            //PostprocessManager1.add(meshs[i]);
        }
        this.snake = new Snake(meshs);
        */

        /*
        var mesh: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 2, 100, 1, 1), new THREE.MeshBasicMaterial({wireframe:true, color:0xff0000}));
        mesh.name = 'testBody';
        mesh.position.set(0, -2, 0);
        PhysicsManager.setRigidBodyManyShape([mesh], mesh, mesh.name, 0);
        this.add(mesh);
        */
        this.player = new Player();
        this.add(this.player);


        StageData.init();
        StageManager.player = this.player;

        //ヒットターゲットの設定
        /*
        var tree1: THREE.Object3D = this.ground.getObjectByName('tree1', false);
        var tree2: THREE.Object3D = this.ground.getObjectByName('tree2', false);
        var tree3: THREE.Object3D = this.ground.getObjectByName('tree3', false);
        
        this.player.setHitTarget(tree1);
        this.player.setHitTarget(tree2);
        this.player.setHitTarget(tree3);*/
        //this.player.ground = StageManager.grounds[0];
        //var groundProp: any = this.getGroundProperty(0);
        //this.player.resetRevivePosition(groundProp.groundPos, groundProp.groundY, new THREE.Vector3());


        /*
        //create house
        for (var i: number = 0; i < this.houseLength; i++) {
            var name: string = 'house' + i;
            var house: House = new House(name);
            this.houses.push(house);
            house.setVisible(false);
            Vars.setObject(house);
            this.add(house);
        }
        this.rigidBodys['house'] = this.houses;
        */


        //this.cloud = new Cloud();
        //this.add(this.cloud);


        //this.ufo = new Ufo();
        //this.ufo.setVisible(false);
        //this.add(this.ufo);


        //player moveTargetの設定
        //this.player.moveTargetOPointsLength = this.ground.moveTargetOPoints.length;
        //this.player.moveTargetUPointsLength = this.ground.moveTargetUPoints.length;
        //this.player.setPlayerMoveTargets('reset');


        //rigidBodyのセットと位置調整
        //this.setRigidBodys(0);
        //this.setRevivePosition(0);

    }







    //-------------------------callBack----------------------------------
    
    //地面の読み込みが終わったら、またはその他コールバック
    private groudCallBack(type: string, result:any): void {
        
        switch (type) {

            case 'addItem':
                //this.addItem(result.position);
                break;

            case 'flipStart':
                this.flipStart();
                break;

            case 'flipEnd':
                this.flipEnd();
                break;

            case 'addGround':
                //this.setRigidBodys(result.index);
                CameraManager.camera.oneRotation();
                break;

        }

    }




    //アイテムをセット
    private addItem(pos: THREE.Vector3): void {

        var time: number = Vars.elapsedTime;
        if (time - this.lastAddItemTime < this.itemAddInterval) return;
        this.lastAddItemTime = time;

        this.ground.localToWorld(pos);

        if (this.itemsLength >= this.maxItemLength) {

            for (var i: number = 0; i < this.itemsLength; i++) {
                if (this.items[i].deadFlag) {
                    var name: string = this.items[i].name;
                    this.items[i].revive(pos);
                    return;
                }
            }

        } else {

            var item: ItemScakuranbo = new ItemScakuranbo(name);
            PhysicsManager.setPosition(item.rigidBodyIndex, pos);
            this.items.push(item);
            this.add(item);
            this.itemsLength = this.items.length;
        }

    }

    //地面の回転が始まったら
    private flipStart(): void {
        
        if (Vars.reverseFlag) {
            //RaycastManager.mouseMeshY = 4.3;
            //RaycastManager.mouseTopMeshY = 8;
            ParticleManager.off('leafParticle1');
            //ParticleManager.on('hotalParticle1');
        } else {
            //RaycastManager.mouseMeshY = .4;
            //RaycastManager.mouseTopMeshY = 3;
            ParticleManager.on('leafParticle1');
            //ParticleManager.off('hotalParticle1');
        }

        CameraManager.flip('start');

    }

    //地面の回転が終わったら
    private flipEnd(): void {

        this.player.setPlayerMoveTargets('reset');

        //this.setRevivePosition(this.ground.groundIndex - 1);
        /*
        if (Vars.reverseFlag) {
            this.ufo.setVisible(true);
            this.cloud.setVisible(false);
        } else {
            this.ufo.setVisible(false);
            this.cloud.setVisible(true);
        }
        */
        CameraManager.flip('end');
    }
    /*
    //新しい大陸が現れるたびに、その大陸の木や箱のrigidBodyをセットする
    private setRigidBodys(index: number): void {
        
        for (var objectType in this.rigidBodys) {
            this.setRigidBody(index, objectType);
        }

    }
    

    private setRigidBody(index:number, objectType:string): void {

        var objectIndex: number = 0;
        for (var i: number = 0; i < index; i++) {
            var length: number = StageData.stages[i][objectType].length;
            for (var j: number = 0; j < length; j++) {
                objectIndex++;
            }
        }


        for (var i: number = index; i < index + 1; i++) {
            
            var length: number = StageData.stages[i][objectType].length;
            for (var j: number = 0; j < length; j++) {
                this.rigidBodys[objectType][objectIndex].setRigidBody();
                objectIndex++;
            }
        }

    }

    
    //player, box, tree, houseのrevivePositionをリセット
    private setRevivePosition(index: number): void {
        
        for (var objectType in this.rigidBodys) {
            this.setRevivePositionStep2(index, objectType);
        }

    }

    private setRevivePositionStep2(index: number, objectType: string): void {
        
        var objectIndex: number = 0;
        for (var i: number = 0; i < index + 1; i++) {
            var groundProp: any = this.getGroundProperty(0, 1);

            var length: number = StageData.stages[i][objectType].length;
            for (var j: number = 0; j < length; j++) {
                var objectPos: THREE.Vector3 = StageData.stages[i][objectType][j];
                this.rigidBodys[objectType][objectIndex].resetRevivePosition(groundProp.groundPos, groundProp.groundY, objectPos);
                this.rigidBodys[objectType][objectIndex].setVisible(true);
                objectIndex++;
            }
        }

    }


    private getGroundProperty(stageIndex:number, i:number): any {

        var data: any = StageData.stages[stageIndex]['ground'][i];
        var groundY: number = data.groundY;
        //localToWorldに渡すVectorはcloneしなければいけない。引数に使ったobjectの位置が動いてしまう
        //var groundPos: THREE.Vector3 = this.ground.localToWorld(this.ground.defaultObjects[i].position.clone());
        var groundPos: THREE.Vector3 = new THREE.Vector3(data.position[0], data.position[1], data.position[2]);

        return {groundY:groundY, groundPos:groundPos};
    }
    */

    //boxをクリックした際のアニメーション
    private boxCallBack(targetPos: THREE.Vector3): void {

        var index: number = Math.floor(2 * Math.random());

        switch (index) {
            case 0:
                this.setBoxTower(targetPos);
                break;

            case 1:
                this.setPyramid(targetPos);
                break;
        }

    }


    private setBoxTower(targetPos: THREE.Vector3): void {

        var y: number = targetPos.y;
        var length: number = StageManager.boxs.length;

        for (var i: number = 0; i < length; i++) {
            targetPos.y = y + i * 1.5;
            this.addBoxTween(targetPos, i);
        }

    }


    private setPyramid(targetPos: THREE.Vector3): void {

        var y: number = targetPos.y;
        var count1: number = 0;
        var count2: number = 0;
        var distY: number = 1.5;
        var distZ: number = 1.2;
        var maxArray: Array<number> = [4, 3, 2, 1];
        var length: number = StageManager.boxs.length;

        for (var i: number = 0; i < length; i++) {
            targetPos.z = count2 * distZ + count1 * .6 - distZ * 2;
            targetPos.y = y + count1 * distY;
            this.addBoxTween(targetPos, i);
            count2++;
            if (count2 > maxArray[count1] - 1) {
                count1++;
                count2 = 0;
            }
        }

    }


    private addBoxTween(targetPos:THREE.Vector3, i:number):void{

        var q: THREE.Quaternion = new THREE.Quaternion();
        var box: Box = <Box>SceneManager.scene.getObjectByName(name, false);
        var index: number = box.rigidBodyIndex;
        var pos: THREE.Vector3 = new THREE.Vector3().copy(box.position);

        new TWEEN.Tween(pos).to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate((function (index, pos) {
                return function () {
                    PhysicsManager.setPosition(index, pos);
                    PhysicsManager.setQuaternion(index, q);
                }
            }.bind(this))(index, pos)).start();
        
    }



    private animate(): void {

        requestAnimationFrame(() => this.animate());

        this.skyBox.position.copy(CameraManager.camera.position);
        this.skyBox.position.y = 0;

    }

}