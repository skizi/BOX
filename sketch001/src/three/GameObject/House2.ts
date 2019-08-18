class House2 extends GameObject{

    private defaultPos: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);

    private bone0: any;
    private bone1: any;
    private bone2: any;

    private bone1DefaultPos: THREE.Vector3 = new THREE.Vector3();
    private bone2DefaultPos: THREE.Vector3 = new THREE.Vector3();


    private maxRubberDist: number = 10;
    private dragTime: number = 0;
    private maxDragTime: number = 5;
    private hasFlag: boolean = false;

    private cachePos: THREE.Vector3 = new THREE.Vector3();
    private bone2CachePos: THREE.Vector3 = new THREE.Vector3();
    private bone1CachePos: THREE.Vector3 = new THREE.Vector3();

    private releaseVec: THREE.Vector3 = new THREE.Vector3();
    private releaseFlag: boolean = false;

    public inner: HouseInner;




    constructor(pos:THREE.Vector3) {

        super();

        this.name = 'house2';
        this.defaultPos.copy(pos);
        this.position.copy(this.defaultPos);

        var url = 'assets/models/house.js';
        new LoadManager(url, "json", this.modelLoadCompHandler.bind(this));

    }


    private modelLoadCompHandler(result: any): void {

        this.initMesh(result);
        this.setMouseEnabled(this.mesh, true);
        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));

    }


    private initMesh(result: any): void {

        var material: THREE.MeshFaceMaterial = MaterialManager.groundGrassMaterial.clone();
        for (var i: number = 0; i < material.materials.length; i++) {
            var m: THREE.MeshBasicMaterial = <THREE.MeshBasicMaterial>(material.materials[i]);
            m.skinning = true;
            m.side = THREE.DoubleSide;
            m.transparent = true;
        }

        this.mesh = new THREE.SkinnedMesh(result.geometry, material);
        this.mesh.name = 'house2';
        this.mesh.castShadow = true;
        //this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.setBoneAnimations(result.geometry);


        //set bone
        this.bone0 = this.mesh.getObjectByName('Bone', false);

        this.bone1 = this.bone0.getObjectByName('Bone.1', false);
        this.bone1DefaultPos.copy(this.bone1.position);

        this.bone2 = this.bone1.getObjectByName('Bone.001', false);
        this.bone2DefaultPos.copy(this.bone2.position);

        for (var i: number = 0; i < this.mesh.children.length; i++) {
            //alert(this.mesh.children[i].name);
        }


        //set inner
        this.inner = new HouseInner();
        //this.add(this.inner);
    }


    public mouseOver(): void {
        /*
        MeshManager.setOpacity(this.mesh, .2);
        this.inner.setVisible(true);
        */
    }

    public mouseOut(): void {
        /*
        MeshManager.setOpacity(this.mesh, 1);
        this.inner.setVisible(false);
        */
    }


    //--------------------------------animation--------------------------------
    public drag(): void{

        if (this.hasFlag) {
            this.has();
        } else {
            this.pull();
        }
    }


    //家がマウスに引っ張られているときの動き
    private pull(): void {

        if (this.bone2) {

            this.dragTime += Vars.delta;
            if (this.dragTime > this.maxDragTime) {
                this.hasFlag = true;
            }

            var mousePos: THREE.Vector3 = Vars.mousePosition.clone();
            mousePos.y -= 5;

            var parentLocalMousePos: THREE.Vector3 = this.parent.worldToLocal(mousePos.clone());



            //position
            if (parentLocalMousePos.distanceTo(this.position) < this.maxRubberDist) {

                var bone2TargetPos: THREE.Vector3 = this.bone1.worldToLocal(mousePos.clone());
                var bone1TargetPos: THREE.Vector3 = bone2TargetPos.clone().multiplyScalar(.5);

            } else {

                bone2TargetPos = this.bone2DefaultPos.clone();
                bone1TargetPos = this.bone1DefaultPos.clone();

            }

            this.setMove(this.bone2.position, bone2TargetPos.clone(), this.bone2CachePos, this.bone2);

            this.setMove(this.bone1.position, bone1TargetPos.clone(), this.bone1CachePos, this.bone1);


            //rotation
            this.bone2.lookAt(bone2TargetPos.clone().negate());
            this.bone1.lookAt(bone1TargetPos.clone().negate());

        }

    }

    
    //家がマウスにドラッグされているときの動き
    private has(): void {

        var mousePos: THREE.Vector3 = this.parent.worldToLocal(Vars.mousePosition.clone());
        mousePos.y -= 5;

        //this pos
        this.setMove(this.position, mousePos.clone(), this.cachePos, this);
        this.hasStep2();

    }

    private hasStep2(): void{

        //bone2
        var thisWorldPosition: THREE.Vector3 = this.parent.localToWorld(this.position.clone());
        var bone2TargetPos: THREE.Vector3 = this.bone1.worldToLocal(thisWorldPosition.clone());
        bone2TargetPos.z = this.bone2DefaultPos.z;
        this.setMove(this.bone2.position, bone2TargetPos, this.bone2CachePos, this.bone2);

        //bone1
        var bone1TargetPos: THREE.Vector3 = bone2TargetPos.clone().multiplyScalar(.5);
        this.setMove(this.bone1.position, bone1TargetPos, this.bone1CachePos, this.bone1);


        //rotation
        this.bone2.lookAt(bone2TargetPos.clone().negate());
        this.bone1.lookAt(bone1TargetPos.clone().negate());
    }


    private setMove( pos:THREE.Vector3, targetPos:THREE.Vector3, cachePos:THREE.Vector3, object:any ): void {

        var obj: any = ThreeManager.easingVector3Bane(pos, targetPos, cachePos);
        object.position.copy(obj.pos);
        cachePos.copy(obj.cache);

    }

    
    //マウスが家を放したとき
    public mouseUp(): void {

        if (this.hasFlag) {
            this.releaseFlag = true;
            var mousePos: THREE.Vector3 = this.parent.worldToLocal(Vars.mousePosition.clone());
            var lastMousePos: THREE.Vector3 = this.parent.worldToLocal(Vars.lastMousePosition.clone());
            this.releaseVec.copy(mousePos.sub(lastMousePos));
            this.releaseVec.y += -1;
        } else {
            this.reset();
        }
    }


    private reset(): void {

        TweenManager.addTweenPosition(this.bone2, this.bone2DefaultPos, 500, TWEEN.Easing.Elastic.Out);
        TweenManager.addTweenQuaternion(this.bone2, new THREE.Quaternion(0, 0, 0, 1), 500, TWEEN.Easing.Elastic.Out);
        TweenManager.addTweenPosition(this.bone1, this.bone1DefaultPos, 500, TWEEN.Easing.Elastic.Out);
        TweenManager.addTweenQuaternion(this.bone1, new THREE.Quaternion(0, 0, 0, 1), 500, TWEEN.Easing.Elastic.Out);

    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (this.releaseFlag) {
            this.hasStep2();
            this.releaseVec.y += -.1;
            this.position.add(this.releaseVec.clone());

            if (this.position.length() > 200) {
                this.hasFlag = false;
                this.releaseFlag = false;
                this.dragTime = 0;
                this.position.copy(this.defaultPos);
                this.reset();
            }
        }
    }
}