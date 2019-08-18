class GameObject extends THREE.Object3D {


    public mesh: any;
    public meshForwardNegateFlag: boolean = false;
    public sprite: THREE.Sprite;

    public defaultScale: number = 1;
    public size: THREE.Vector3 = new THREE.Vector3();
    public defaultSize: THREE.Vector3 = new THREE.Vector3();
    public nowScale: number = 1;
 

    public debugFlag: boolean = false;

    private lastPosition: THREE.Vector3 = new THREE.Vector3();

    public assetName: string = '';
    public mouseEnabledFlag: boolean = false;
    private raycastTarget: any;
    public catchStandbyFlag: boolean = false;


    //physics
    public rigidBodyManyShapeFlag: boolean = false;
    public rigidFlag: boolean = false;
    public rigidName: string = '';
    public rigidMesh: THREE.Mesh;
    public rigidMeshs: Array<THREE.Mesh> = [];
    public rigidData: any = {};
    public rigidBodyIndex: number = -1;

    //catch
    public catherEnabledFlag: boolean = true;
    public catchFlag: boolean = false;//相手に持たれた時に立つフラグ
    public catchingFlag: boolean = false;//何かしらのオブジェクトを持った時に立つフラグ
    public throwingFlag: boolean = false;//物を投げている最中に立つフラグ
    private catchCircleRelativeY: number = 0;
    public catchCircle: THREE.Mesh;
    public catchTargetPosition: THREE.Vector3 = new THREE.Vector3(0, 1, 1);
    public releaseTargets: Array<GameObject> = [];
    private releaseTargetsLength: number = 0;
    private setCatchTargetNullTimeoutId: number;
    public player: Player;

    //move
    public moveFlag: boolean = true;
    public moveType: string;
    public mover: any = {};
    private oldPosition: THREE.Vector3 = new THREE.Vector3();
    public speed: number = 0;
    public flipIndex = -1;

    //shadow
    public shadowMesh: THREE.Mesh;
    private shadowMat: THREE.MeshBasicMaterial;
    private shadowRay: THREE.Raycaster;
    public shadowTargetNames: Array<string> = [];
    private shadowTargetNamesLength: number = 0;
    private raycastCheckCount: number = 0;
    private maxRaycastCheckCount: number = 10;

    //animation
    private animationType: string = 'bone';
    public animationFps: number = 30;
    public animationNames:Array<string> = [];
    public animationLength: number = 0;
    public nowAnimation: string = '';
    public animationStep: number = 1;

    //bone animation
    public animations: any = {};

    //caught
    public caughtFlag: boolean = false;
    public lastCaughtTime: number = 0;
    public caughtJointIndex: number = -1;


    //hit
    private hitTargets: Array<any> = [];
    private hitTargetsLength: number = 0;
    private hitCheckTime: number = 0;
    public maxHitCheckTime: number = .5;
    public hitRadius: number = 3;

    //ground hit
    private groundHitRay: THREE.Raycaster;
    private groundHitTargetNames: Array<string> = [];
    private groundHitTargetNamesLength: number = 0;
    public maxGroundHitRayCheckTime: number = .5;
    private groundHitRayCheckTime: number = 0;

    //deadFlag
    public deadFlag: boolean = false;

    public hitPoint: number = 3;




    constructor(defaultPosition: THREE.Vector3 = null) {

        super();

        if (defaultPosition) this.position.copy(defaultPosition);

        //this.goAnimate();
        Vars.setAnimateFunc(this.goAnimate.bind(this));

    }


    public setCatchMouseEvents(): void {

        this.mouseClick = this.catchMouseClick;
        this.mouseOver = this.catchMouseOver;
        this.mouseOut = this.catchMouseOut;

    }


    private catchMouseClick(): void {

        if (this.catchFlag ||
            !this.mouseEnabledFlag ||
            this.player.nowScale == this.player.minScale ||
            !this.catchCircle.visible) return;

        this.catchStandbyFlag = true;
        if (platform == 'pc') {
            DomManager.mouseNavi.TF.html('右クリックで投げる');
        } else {
            DomManager.mouseNavi.TF.html('ダブルタップで投げる');
        }
        DomManager.mouseNavi.show();

    }


    private catchMouseOver(): void {
        /*
        console.log("catchFlag:" + this.catchFlag + 
            ", catchStandbyFlag:" + this.catchStandbyFlag +
            ", catchCircle.visible:" + this.catchCircle.visible);
        */
        if (this.catchFlag ||
            this.catchStandbyFlag ||
            !this.catchCircle.visible) return;

        if (platform == 'pc') {
            var text: string = '左クリックで拾う';
        } else {
            text = 'タップで拾う';
        }
        if (this.player.nowScale == this.player.minScale) text = '体が小さくて持てない！';
        DomManager.mouseNavi.TF.html(text);
        DomManager.mouseNavi.show();

    }


    private catchMouseOut(): void {

        if (!this.catchFlag) {
            DomManager.mouseNavi.hide();
        }

    }


    public mouseOver(): void {

    }


    public mouseOut(): void {


    }


    public mouseClick(): void {

        if (!this.catchFlag && this.mouseEnabledFlag) this.catchStandbyFlag = true;

    }

    public mouseDown(): void {

        /*
        if (this.rigidFlag) {
            PhysicsManager.objectCatch(this.rigidBodyIndex);
        }*/
    }

    public mouseMove(): void{


    }

    public mouseUp(): void {

        /*
        if (this.rigidFlag) {
            if (Math.abs(Vars.mouseOffsetX) > 2 || Math.abs(Vars.mouseOffsetY) > 2) {
                PhysicsManager.objectThrows();
            } else {
                PhysicsManager.objectRelease();
            }
        }*/

    }

    public drag(): void {


    }


    //-------------------------move-------------------------
    public setMoveType(option:any): void {

        this.moveType = option.type;
        if (option.speed) {
            this.speed = option.speed;
        } else {
            this.speed = 1;
        }

        if (this.mover[this.moveType]) return;

        switch (this.moveType) {

            case 'mouse':
                Move.mouse.add(this, this.speed, option.speedChangeRange, option.maxSpeed);
                this.mover[this.moveType] = Move.mouse;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;

            case 'stalker':
                Move.stalker.add(this, option.target, this.speed, option.range);
                this.mover[this.moveType] = Move.stalker;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;

            case 'turn':
                Move.turn.add(this);
                this.mover[this.moveType] = Move.turn;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;

            case 'rotation':
                Move.rotation.add(this.name, this.speed);
                this.mover[this.moveType] = Move.rotation;
                PhysicsManager.setSpeed(this.rigidBodyIndex, this.speed);
                break;

            case 'flip':
                Move.flip.init(option.target, option.callBack);
                break;

        }

    }


    private goMovement(): void {

        if (!this.mover[this.moveType] || this.throwingFlag || !this.moveFlag || !Vars.renderFlag) return;
        this.mover[this.moveType].render(this.name);

        this.oldPosition.copy(this.position);
    }


    public getMoveProp():any {

       return this.mover[this.moveType].objects[this.name];

    }


    public getMover(): any {

        return this.mover[this.moveType];

    }


    
    //-------------------------mesh----------------------------------
    /*
    *meshを作成してaddする
    */
    public createMesh(geometryType: string, geometrySize: any): void {

        var geometry: THREE.Geometry = this.getGeometry(geometryType, geometrySize);
        var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.add(this.mesh);

    }

    private getGeometry(type: string, size: any): THREE.Geometry {

        var geometry: THREE.Geometry;

        switch (type) {

            case 'plane':
                geometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1);
                break;

            case 'cylinder':
                geometry = new THREE.CylinderGeometry(size.radius, size.radius, size.height, 6, 1, false);
                break;

            case 'box':
                geometry = new THREE.BoxGeometry(size.x, size.y, size.z, 1, 1);
                break;

            case 'sphere':
                geometry = new THREE.SphereGeometry(size, 6, 6);
                break;
        }
        return geometry;
    }


    /*
    *作成済みのmeshをaddする
    *meshがnullの場合はassetsから名前で参照してmeshを設定する
    */
    public setMesh(mesh: THREE.Mesh = null, materialName:string = '', receiveShadow:boolean = false, mouseEnabled:boolean = false ): void {


        if (mesh) {
            this.mesh = mesh;
        } else {
            this.mesh = MeshManager.duplicate(AssetManager.assets.objects[this.assetName]);
        }

        if (materialName != '') MaterialManager.setMaterial(this.mesh, materialName);

        this.mesh.name = this.name;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = receiveShadow;
        this.mesh.position.set(0, 0, 0);

        if (mouseEnabled) {
            this.setMouseEnabled(this.mesh, true);
        }

        this.add(this.mesh);

    }



    //-------------------------sprite----------------------------------
    public createSprite(texUrl:string): void {

        var map: THREE.Texture = THREE.ImageUtils.loadTexture(texUrl);
        var material: THREE.SpriteMaterial = new THREE.SpriteMaterial({ map: map });
        this.sprite = new THREE.Sprite(material);
        this.add(this.sprite);
        
    }

    
    //-------------------------mouse enabled----------------------------------
    //rigidMeshをtargetMeshとする。THREE.Object3DとあるがMeshじゃないとRaycastが反応しない。
    public setMouseEnabled(targetMesh:THREE.Object3D, flag: boolean): void {

        if (this.mouseEnabledFlag) return;

        this.raycastTarget = targetMesh;
        this.mouseEnabledFlag = true;
        RaycastManager.add(targetMesh, flag);

    }
    
    //-------------------------visible----------------------------------
    public setVisible(flag: boolean): void {

        if (this.catchCircle) this.setCatchCircle(false);
        if (this.mesh) this.mesh.visible = flag;
        if (this.shadowMesh) this.shadowMesh.visible = flag;
        this.visible = flag;
    }
    
    
    //-------------------------scale----------------------------------
    public setScale(scale: number): void {
        
        this.nowScale = scale;

        if (this.rigidFlag) {
            PhysicsManager.setScale(this.rigidBodyIndex, scale);
            this.size.copy(this.defaultSize.clone().multiplyScalar(scale));
        }

        if (this.mesh) {
            this.mesh.scale.set(scale, scale, scale);
            this.mesh.updateMatrix();
            this.mesh.position.copy(this.getCollisionOrigin());
        }

    }


    public setDefaultScale(scale:number): void {

        this.setScale(scale);
        this.defaultScale = scale;

    }

    
    //-------------------------physics----------------------------------
    public setRigidBody(): number {

        if (this.rigidFlag) return;
        this.rigidFlag = true;

        this.setCollisionSize();
        var origin: THREE.Vector3 = this.getCollisionOrigin();
        if (this.mesh) this.mesh.position.copy(origin);

        if (!this.rigidMesh) {
            this.rigidMesh = this.getRigidMesh();
            if (this.debugFlag) {
                this.rigidMesh.material = new THREE.MeshBasicMaterial({ wireframe: true });
                this.rigidMesh.material.needsUpdate = true;
                this.add(this.rigidMesh);
            }
        }

        if (!this.rigidData.mass && this.rigidData.mass != 0) this.rigidData.mass = 1;

        this.rigidBodyIndex = PhysicsManager.setRigidBody(this.rigidMesh, this, this.name, this.rigidData.shapeType, 1, this.rigidData.mass, this.rigidData.noRotFlag);
        
        PhysicsManager.setScale(this.rigidBodyIndex, this.defaultScale);

        return this.rigidBodyIndex;
    }


    private setCollisionSize(): void {

        //rigidData.sizeの指定がない場合はassetsの中からcollisionオブジェクトを探してサイズを計って代入するか、
        //meshから直接サイズを計って代入する
        if (!this.rigidData.size) {
            if (AssetManager.assets.objects[this.rigidName]) {
                var mesh: THREE.Mesh = AssetManager.assets.objects[this.rigidName];
                var collisionSize: THREE.Vector3 = MeshManager.getSize(mesh);
                //blenderから書き出すときにflipYZを行ってくれてはいるが、
                //ただrotation.xを90度回転させているだけなので、ここでyとzを逆に直す必要がある。
                collisionSize = new THREE.Vector3(collisionSize.x, collisionSize.z, collisionSize.y);

            } else {

                var collisionSize: THREE.Vector3 = MeshManager.getSize(this.mesh);
                collisionSize = new THREE.Vector3(collisionSize.x, collisionSize.z, collisionSize.y);

            }


            switch (this.rigidData.shapeType) {

                case 'sphere':
                    this.rigidData.size = collisionSize.x * .5;
                    break;

                case 'box':
                    this.rigidData.size = collisionSize;
                    break;

                case 'cylinder':
                    this.rigidData.size = {
                        radius: collisionSize.x * .5,
                        height: collisionSize.y
                    };
                    break;

                case 'plane':
                    this.rigidData.size = {
                        x: collisionSize.x,
                        y: collisionSize.y
                    };
                    break;
            }
        }

        
        //sizeにrigidData.sizeを代入
        switch (this.rigidData.shapeType) {

            case 'plane':
                this.size.x = this.rigidData.size.x;
                this.size.y = this.rigidData.size.y;
                this.size.z = 0;
                break;

            case 'cylinder':
                this.size.x = this.rigidData.size.radius * 2;
                this.size.y = this.rigidData.size.height;
                this.size.z = this.size.x;
                break;

            case 'box':
                this.size.x = this.rigidData.size.x;
                this.size.y = this.rigidData.size.y;
                this.size.z = this.rigidData.size.z;
                break;

            case 'sphere':
                this.size.x = this.rigidData.size * 2;
                this.size.y = this.size.x;
                this.size.z = this.size.x;
                break;
        }

        this.defaultSize.copy(this.size);
    }


    private getCollisionOrigin(): THREE.Vector3 {

        if (!this.rigidData.origin) this.rigidData.origin = new THREE.Vector3();
        var origin: THREE.Vector3 = this.size.clone().multiplyScalar(.5).multiply(this.rigidData.origin.clone());

        return origin;
        
    }

    private getRigidMesh(): THREE.Mesh {

        var geometry: THREE.Geometry = this.getGeometry(this.rigidData.shapeType, this.rigidData.size);
        var mesh: THREE.Mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true }));
        
        mesh.name = this.name;
        return mesh;
    }


    public setMass(mass: number): void {

        if (mass==0)PhysicsManager.setPosition(this.rigidBodyIndex, new THREE.Vector3(0, 100, 0));
        setTimeout(function () {
            PhysicsManager.setMassProps(this.rigidBodyIndex, mass);
        }.bind(this), 10);
        
    }


    //複数のシェイプを含むrigidBodyを作成する
    //必ずthis.positionを設定した後に実行する
    public setRigidBodyManyShape(meshs: Array<THREE.Mesh> = []): number {

        if (this.rigidFlag) return;
        this.rigidFlag = true;

        this.rigidMeshs = this.createRigidMeshs(meshs);
        
        this.rigidBodyIndex = PhysicsManager.setRigidBodyManyShape(this.rigidMeshs, this, this.name, 0);
        //PhysicsManager.setQuaternion(this.rigidBodyIndex, this.quaternion);

        return this.rigidBodyIndex;
    }

    public createRigidMeshs(meshs: Array<THREE.Mesh> = []):Array<THREE.Mesh> {

        this.rigidBodyManyShapeFlag = true;

        if (!this.rigidMeshs.length) {
            //rigidMeshsの指定がない場合はassetsの中から名前でrigidMeshsを検索する
            if (!meshs.length) {
                meshs = AssetManager.searchAssetsByName(this.rigidName);
            }

            var length: number = meshs.length;
            var origin: THREE.Vector3 = AssetManager.assets.objects[this.assetName].position.clone();

            for (var i: number = 0; i < length; i++) {
                meshs[i].position.sub(origin.clone());
                if (this.debugFlag) {
                    meshs[i].material = new THREE.MeshBasicMaterial({ wireframe: true });
                    meshs[i].material.needsUpdate = true;
                    this.add(meshs[i]);
                }
            }
            this.rigidMeshs = meshs;
        }

        return this.rigidMeshs;
    }



    //-------------------------shadow----------------------------------

    public setShadow(shadowTargetNames:Array<string>): void {
        
        this.shadowTargetNames = shadowTargetNames;
        this.shadowTargetNamesLength = this.shadowTargetNames.length;

        var geometry = new THREE.PlaneGeometry(1.5, 1.5, 1, 1);
        this.shadowMesh = new THREE.Mesh(geometry, MaterialManager.shadowMaterial);
        this.shadowMesh.rotation.x = -90 * Vars.toRad;
        SceneManager.scene.add(this.shadowMesh);

        var pos: THREE.Vector3 = this.position.clone();
        pos.y += 1;
        this.shadowRay = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
    }


    private shadowMove(): void {

        if (this.shadowMesh) {

            //前回と同じ位置だったらraycastの計算をしない
            if (this.position.x == this.lastPosition.x &&
                this.position.y == this.lastPosition.y &&
                this.position.z == this.lastPosition.z) return;


            var pos: THREE.Vector3 = this.position.clone();
            this.shadowMesh.position.x = pos.x;
            this.shadowMesh.position.z = pos.z;

            //10フレームに一度だけraycastの計算を行う
            this.raycastCheckCount++;
            if (this.maxRaycastCheckCount > this.raycastCheckCount) return;
            this.raycastCheckCount = 0;


            this.shadowRay.ray.origin = pos;
            this.shadowMesh.position.y = -999;

            var obj: any = RaycastManager.hitCheck(this.shadowRay, 10);
            if (obj.hitFlag) {
                for (var i: number = 0; i < this.shadowTargetNamesLength; i++) {
                    var point: THREE.Vector3 = RaycastManager.getFirstPointByName(obj.intersections, this.shadowTargetNames[i]);
                    if (point) this.shadowMesh.position.y = point.y + .03;
                }
            }

            this.shadowMesh.lookAt(this.shadowMesh.position.clone().add(Vars.groundUp));

        }

    }


    //-------------------------ground hit----------------------------------
    public setGroundHitRay(groundHitTargetNames: Array<string>): void {

        this.groundHitTargetNames = groundHitTargetNames;
        this.groundHitTargetNamesLength = this.groundHitTargetNames.length;
        
        if (!this.groundHitRay) {
            var pos: THREE.Vector3 = this.position.clone();
            this.groundHitRay = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
        }
    }


    private groundHitCheck(): void {

        if (!this.groundHitTargetNamesLength) return;

        //.5秒に一度だけraycastの計算を行う
        this.groundHitRayCheckTime += Vars.delta;
        if (this.maxGroundHitRayCheckTime > this.groundHitRayCheckTime) return;
        this.groundHitRayCheckTime = 0;


        this.groundHitRay.ray.origin.copy(this.position);

        var obj: any = RaycastManager.hitCheck(this.groundHitRay, 10);
        if (obj.hitFlag) {
            for (var i: number = 0; i < this.groundHitTargetNamesLength; i++) {
                var object: any = RaycastManager.getFirstObjectByName(obj.intersections, this.groundHitTargetNames[i]);
                if (object) this.groundHit(object);
            }
        }

    }

    public groundHit(object:any): void {



    }


    //-------------------------animation----------------------------------
    //set morph animation
    public setMorphAnimationKey(name:string, start:number, end:number): void {

        if (!this.mesh) {
            alert('mesh is null');
            return;
        }
        /*
        start = Math.floor(start / this.animationStep);
        end = Math.floor(end / this.animationStep) - 1;
        */
        this.animationType = 'morph';

        this.mesh.setAnimationLabel(name, start, end);
        this.animationNames.push(name);
        this.animationLength++;
        this.nowAnimation = name;
    }

    //set bone animation
    public setBoneAnimations(geometry:any): void {

        if (!this.mesh) {
            alert('mesh is null');
            return;
        }

        this.animationType = 'bone';

        this.animationLength = geometry.animations.length;
        for (var i: number = 0; i < this.animationLength; i++) {
            var animName: string = geometry.animations[i].name;
            this.animationNames.push(animName);
            this.animations[animName] = new THREE.Animation(
                this.mesh,
                geometry.animations[i]
                );
        }

    }

    public playAnimation(name: string): void {

        if (this.nowAnimation == name || !this.mesh) return;

        this.nowAnimation = name;

        if (this.animationType == 'morph') {
            this.mesh.playAnimation(name, this.animationFps);
        } else {  //bone
            this.animations[name].play();
        }
    }

    private animationRender(): void {

        if (this.nowAnimation != '') {
            if (this.animationType == 'morph') {
                this.mesh.updateAnimation(1000 * Vars.delta);
            } else {  //bone
                this.animations[this.nowAnimation].update(Vars.delta);
            }
        }

    }


    //-------------------------hitCheck----------------------------------
    public setHitTarget(object:THREE.Object3D): void {

        this.hitTargets.push(object);
        this.hitTargetsLength = this.hitTargets.length;

    }


    public clearHitTargets(): void {

        this.hitTargets = [];
        this.hitTargetsLength = 0;

    }


    private hitCheck(): void {

        //.5秒に一度だけhitCheckの計算を行う
        this.hitCheckTime += Vars.delta;
        if (this.maxHitCheckTime > this.hitCheckTime) return;
        this.hitCheckTime = 0;

        for (var i: number = 0; i < this.hitTargetsLength; i++) {

            var pos1: THREE.Vector3 = this.parent.localToWorld(this.position.clone());

            var target: any = this.hitTargets[i];
            if (!target.parent) {  //ターゲットがsceneからremoveされた場合
                this.hitTargets.splice(i, 1);
                this.hitTargetsLength--;
                break;
            }
            var pos2: THREE.Vector3 = target.parent.localToWorld(target.position.clone());

            if (pos1.clone().distanceTo(pos2.clone()) < target.hitRadius) {
                this.hitTargets[i].hit(this);
            }

        }

    }


    public hit(hitTarget:any): void {

        //DomManager.debug.html( hitTarget.name );

    }

    
    //-------------------------setCatcher----------------------------------
    private catchCheck():void{

        if (this.catherEnabledFlag) {
            if (Action.catcher.objects[this.name]) Action.catcher.search(this.name);
            if (this.catchCircle) {
                this.catchCircle.position.copy(this.position);
                this.catchCircle.position.y += this.catchCircleRelativeY;
            }
        }

    }


    public setCatcher(targets:Array<any>): void {

        this.setMouseEnabled(this.mesh, true);
        
        Action.catcher.add(this, targets, 4);

    }


    public catchTarget: GameObject;
    public catchTargetParent: any;
    public catcher(target: any, continueFlag: boolean = false): void {

        if (continueFlag) clearTimeout(this.setCatchTargetNullTimeoutId);
        this.catchingFlag = true;

        this.catchTarget = target;
        this.catchTargetParent = target.parent;
        this.catchTarget.wasCaught();

        this.catchTarget.setCatchCircle(false);
        PhysicsManager.removeRigidBody(this.catchTarget);
        this.catchTarget.position.copy(this.catchTargetPosition);
        this.catchTargetParent.remove(target);
        this.add(this.catchTarget);

        this.catching();

    }


    public catching(): void {



    }


    public wasCaught() {



    }


    public setReleaseTargets( target:GameObject ): void {

        this.releaseTargets.push(target);
        this.releaseTargetsLength = this.releaseTargets.length;

    }

    public clearReleaseTargets(target: GameObject): void {

        this.releaseTargets = [];
        this.releaseTargetsLength = 0;

    }


    public release(): void {

        if (!this.catchingFlag) return;
        this.catchingFlag = false;

        //add catchTarget at scene
        this.remove(this.catchTarget);
        this.catchTargetParent.add(this.catchTarget);
        if (this.meshForwardNegateFlag) {
            var forward: THREE.Vector3 = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone()).negate();
        } else {
            forward = SceneManager.scene.localToWorld(ThreeManager.getForward(this.mesh).clone());
        }
        var startPos: THREE.Vector3 = forward.clone().multiplyScalar(this.catchTargetPosition.z);
        startPos.y = this.catchTargetPosition.y;
        this.catchTarget.position.copy(this.position.clone().add(startPos.clone()));



        //set rigidBody
        if (this.catchTarget.rigidBodyManyShapeFlag) {
            this.catchTarget.setRigidBodyManyShape();
        } else {
            this.catchTarget.setRigidBody();
        }

        //throw
        PhysicsManager.resetVelocity(this.catchTarget.rigidBodyIndex);
        var targetPos: THREE.Vector3 = this.getReleaseTargetPos(forward);
        this.catchTarget.bulletStart();
        PhysicsManager.applyImpulse(this.catchTarget.rigidBodyIndex, this.catchTarget.position.clone(), targetPos.clone(), 20);
        

        //catchTargetをreleaseしてから3秒間はhitCheckを毎フレーム行うようにする
        this.catchTarget.maxHitCheckTime = 0;
        this.setCatchTargetNullTimeoutId = setTimeout(this.setCatchTargetNull.bind(this), 1000);

    }



    private getReleaseTargetPos(forward:THREE.Vector3): THREE.Vector3 {

        var targetPos: THREE.Vector3 = this.position.clone().add(forward.clone().multiplyScalar(20));
        targetPos.y = this.catchTargetPosition.y;
        if (this.releaseTargetsLength) {
            var target: GameObject = this.getReleaseTarget();
            if (target) {
                var a: THREE.Vector3 = target.position.clone();
                a.y = 0;
                var b: THREE.Vector3 = this.position.clone();
                b.y = 0;
                var direction: THREE.Vector3 = a.sub(b).normalize();
                if (forward.dot(direction) > .5) targetPos = target.position.clone();
            }
        }

        return targetPos;
    }


    public getReleaseTarget(): GameObject {

        if( !this.catchTarget ) return null;

        var minDist: number = 9999;
        var target: GameObject;
        for (var i: number = 0; i < this.releaseTargetsLength; i++) {
            var dist: number = this.position.distanceTo(this.releaseTargets[i].position.clone());
            if (minDist > dist &&
                this.catchTarget.assetName != this.releaseTargets[i].assetName &&
                !this.releaseTargets[i].deadFlag) {
                target = this.releaseTargets[i];
            }
        }
    
        return target;

    }


    private setCatchTargetNull(): void{

        if (this.catchTarget) {
            this.catchTarget.maxHitCheckTime = .5;
            this.catchTarget.bulletEnd();
        }
        Action.catcher.release(this.name);

    }


    public bulletStart(): void {



    }


    public bulletEnd(): void {



    }


    public catcherClear(): void {

        this.remove(this.catchTarget);
        this.catchTargetParent.add(this.catchTarget);

        //set rigidBody
        if (this.rigidBodyManyShapeFlag) {
            this.setRigidBodyManyShape();
        } else {
            this.catchTarget.setRigidBody();
        }

        this.catchTarget.catchStandbyFlag = false;
        this.catchTarget.maxHitCheckTime = .5;
        Action.catcher.release(this.name);

    }


    public setCatchCircle(visible:boolean): void {

        if (!this.visible) return;

        if (!this.catchCircle ) {
            var radius: number = this.size.x * .5 + 2;
            this.catchCircle = new THREE.Mesh(new THREE.PlaneGeometry(radius, radius, 1, 1), MaterialManager.circleMaterial);
            if (this.rigidData.origin.y >= 0) {
                this.catchCircleRelativeY = (this.size.y * .5) * (-this.rigidData.origin.y - 1);
            } else {
                this.catchCircleRelativeY = (this.size.y * .5) * -(1 + this.rigidData.origin.y);
            }
            this.catchCircleRelativeY += .2;
            this.catchCircle.rotation.x = 270 * Vars.toRad;
            this.catchCircle.position.copy(this.position);
            this.catchCircle.position.y += this.catchCircleRelativeY;
            SceneManager.scene.add(this.catchCircle);

        }

        if (visible != this.catchCircle.visible) this.catchCircle.visible = visible;

    }

    
    //-------------------------destroy----------------------------------
    public destroy(): void {

        if (this.mouseEnabledFlag) {
            RaycastManager.remove(this.raycastTarget);
        }

        //this.deadFlag = true;

        //deleteするとassets内のmeshデータも消えてしまう・・・
        //if (this.mesh) ThreeManager.deleteGeometry(this.mesh);
        //if (this.rigidMesh) ThreeManager.deleteGeometry(this.rigidMesh);

    }


    
    //-------------------------render----------------------------------
    private goAnimate(): void {

        //requestAnimationFrame(() => this.goAnimate());
        if (this.deadFlag) return;
        //if (this.assetName == "ground0")DomManager.debug.html(this.position.x + ", y:" + this.position.y + ", z:" + this.position.z);

        this.goMovement();
        this.animationRender();
        this.shadowMove();
        this.hitCheck();
        this.groundHitCheck();
        this.catchCheck();

        this.lastPosition.copy(this.position);
    }


}