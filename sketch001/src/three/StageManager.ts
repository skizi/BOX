///<reference path="GameObject/Ground.ts"/>
///<reference path="GameObject/Tree.ts"/>
///<reference path="GameObject/Tsuribashi.ts"/>
///<reference path="GameObject/Warp.ts"/>
///<reference path="GameObject/Box.ts"/>

module StageManager{

    var groundMergeMesh: THREE.Mesh;
    export var grounds: Array<Ground> = [];
    var trees: Array<Tree> = [];
    var tsuribashis: Array<Tsuribashi> = [];
    var warps: Array<Warp> = [];
    export var boxs: Array<Box> = [];
    var bikkuriButtons: Array<BikkuriButton> = [];
    var spikes: Array<Spike> = [];
    export var zakos: Array<Zako> = [];
    var block0s: Array<Block0> = [];
    var block1s: Array<Block1> = [];
    var block2s: Array<Block2> = [];

    var index: number = -1;

    export var player: Player;
    


    //キャッシュした配列にすでに対象のGameObjectがある場合はそれを流用する
    //もしなかったらnewした後にsceneにaddする
    export function add(stageIndex: number): void {

        
        index = stageIndex;
        var groundMergeGOs: Array<GameObject> = [];

        var stageObj: any = StageData.stages[stageIndex];
        for (var type in stageObj) {

            for (var i: number = 0; i < stageObj[type].length; i++) {
                
                switch (type) {

                    case "grounds":
                        var newFlag: boolean = true;
                        var length: number = grounds.length;
                        if (length) {
                            var assetName: string = stageObj[type][i].name;
                            for (var j: number = 0; j < length; j++) {
                                if (grounds[j].assetName == assetName && !grounds[j].addFlag) {
                                    grounds[j].reset(stageIndex, i);
                                    groundMergeGOs.push(grounds[j]);
                                    newFlag = false;
                                    break;  //同じassetNameのものが二つ続くと連続してgroundのreset関数が実行されてしまうので、
                                            //一つreset関数を実行したらbreakしてfor文をぬけるようにする
                                }
                            }
                        }
                        if (newFlag){
                            var ground: Ground = new Ground(stageIndex, i);
                            grounds.push(ground);
                            groundMergeGOs.push(ground);
                            //SceneManager.scene.add(ground);
                        }
                        break;

                    case "trees":
                        if (trees[i]) {
                            trees[i].reset(stageIndex, i);
                            groundMergeGOs.push(trees[i]);
                        }else{
                            var tree: Tree = new Tree(stageIndex, i);
                            trees.push(tree);
                            //SceneManager.scene.add(tree);
                            groundMergeGOs.push(tree);
                        }
                        break;

                    case "tsuribashis":
                        if (tsuribashis[i]) {
                            var tsuribashi: Tsuribashi = tsuribashis[i];
                            tsuribashi.reset(stageIndex, i);
                        } else {
                            tsuribashi = new Tsuribashi(stageIndex, i);
                            tsuribashis.push(tsuribashi);
                        }
                        if (tsuribashi.data.visible) {
                            groundMergeGOs.push(tsuribashi);
                        } else {
                            SceneManager.scene.add(tsuribashi);
                        }
                        break;

                    case "warps":
                        if (warps[i]) {
                            warps[i].reset(stageIndex, i);
                        } else {
                            var warp: Warp = new Warp(stageIndex, i);
                            warps.push(warp);
                            SceneManager.scene.add(warp);
                        }
                        break;

                    case "boxs":
                        if (boxs[i]) {
                            boxs[i].reset(stageIndex, i);
                        } else {
                            var box: Box = new Box(stageIndex, i);
                            boxs.push(box);
                            SceneManager.scene.add(box);
                        }
                        break;

                    case "bikkuriButtons":
                        if (bikkuriButtons[i]) {
                            bikkuriButtons[i].reset(stageIndex, i);
                        } else {
                            var bikkuriButton: BikkuriButton = new BikkuriButton(stageIndex, i, bikkuriButtons.length);
                            bikkuriButtons.push(bikkuriButton);
                            SceneManager.scene.add(bikkuriButton);
                        }
                        break;

                    case "spikes":
                        if (spikes[i]) {
                            spikes[i].reset(stageIndex, i);
                        } else {
                            var spike: Spike = new Spike(stageIndex, i);
                            spikes.push(spike);
                            spike.hitTarget = player;
                            SceneManager.scene.add(spike);
                        }
                        break;

                    case "zakos":
                        if (zakos[i]) {
                            zakos[i].reset(stageIndex, i);
                        } else {
                            var zako: Zako = new Zako(stageIndex, i);
                            zakos.push(zako);
                            player.setReleaseTargets(zako);
                            SceneManager.scene.add(zako);
                        }
                        break;

                    case "block0s":
                        if (block0s[i]) {
                            block0s[i].reset(stageIndex, i);
                        } else {
                            var block0: Block0 = new Block0(stageIndex, i);
                            block0s.push(block0);
                            SceneManager.scene.add(block0);
                        }
                        break;

                    case "block1s":
                        if (block1s[i]) {
                            block1s[i].reset(stageIndex, i);
                        } else {
                            var block1: Block1 = new Block1(stageIndex, i);
                            block1s.push(block1);
                            SceneManager.scene.add(block1);
                        }
                        break;

                    case "block2s":
                        if (block2s[i]) {
                            block2s[i].reset(stageIndex, i);
                        } else {
                            var block2: Block2 = new Block2(stageIndex, i);
                            block2s.push(block2);
                            SceneManager.scene.add(block2);
                        }
                        break;

                }


            }

        }


        //set catcher
        var catchTargets: Array<GameObject> = [];
        var length: number = boxs.length;
        for (var i: number = 0; i < length; i++) catchTargets.push(boxs[i]);
        length = zakos.length;
        for (i = 0; i < length; i++) catchTargets.push(zakos[i]);
        player.setCatcher(catchTargets);

        //set hitTarget
        resetHitTargets();

        //gameObject marge
        if (groundMergeGOs.length) {
            groundMergeMesh = GameObjectManager.merge(groundMergeGOs);
            groundMergeMesh.castShadow = true;
            SceneManager.scene.add(groundMergeMesh);
        }
    }


    function resetHitTargets(): void {

        //player -> warp
        player.clearHitTargets();
        var length: number = warps.length;
        for (var i: number = 0; i < length; i++) {
            if (warps[i].visible)player.setHitTarget(warps[i]);
        }

        //player -> ground
        length = spikes.length;
        var names: Array<string> = [];
        for (i = 0; i < length; i++) {
            if (spikes[i].visible)names.push(spikes[i].name);
        }
        player.setGroundHitRay(names);

        //box -> bikkuriButton
        length = boxs.length;
        var bikkuriButtonsLength: number = bikkuriButtons.length;
        for (i = 0; i < length; i++) {
            boxs[i].clearHitTargets();
            for (var j: number = 0; j < bikkuriButtonsLength; j++) {
                if (bikkuriButtons[j].visible)boxs[i].setHitTarget(bikkuriButtons[j]);
            }
        }
        //box -> zako
        var zakosLength: number = zakos.length;
        for (i = 0; i < length; i++) {
            for (var j: number = 0; j < zakosLength; j++) {
                if (zakos[j].visible) boxs[i].setHitTarget(zakos[j]);
            }
        }
        

    }


    export function stageClear(): void {

        Vars.inGameFlag = false;


        //player
        player.stageClearFlag = true;
        player.moveFlag = false;


        //effect
        if (Vars.quality != 'low') {
            RendererManager.layerFlag = true;
            SceneManager.scene.skyBox.fadeOut();
        }

        //sound
        SoundManager.setInstanceVolume(SoundManager.mainMusicId, .3);
        SoundManager.play(8, false, .7);
        setTimeout(function () {
            SoundManager.setInstanceVolume(SoundManager.mainMusicId, SoundManager.mainMusicVolume);
        }.bind(this), 2000);


        //camera
        CameraManager.stageClear(cameraTweenComp.bind(this));

        //set flash
        CoverManager.flash('blue');

        //set text
        if (Vars.quality != 'low') PixiManager.pixiParticle2.show();
        PixiManager.stageClearText.show();
        setTimeout(function () {
            if (Vars.quality != 'low') PixiManager.pixiParticle2.hide();
            PixiManager.stageClearText.hide();
        }.bind(this), 3000);

        //time stop
        PixiManager.time.pause();

    }


    function cameraTweenComp(): void {

        setTimeout(function () {

            nextStage();

        }.bind(this), 2000);

    }



    var sameFlag: boolean = false;
    export function nextStage(_index:number = null): void {

        TextManager.refresh();

        sameFlag = false;
        if (_index == null) {
            index++;
            if (index >= StageData.stages.length) index = 0;
        } else {
            if (index == _index) sameFlag = true;
            index = _index;
        }

        //画面遷移の時に重くなるのでレンダリングをストップする
        Vars.renderFlag = false;
        MaterialManager.animateFlag = false;
        PhysicsManager.stop();
        
        PixiManager.eyeCatch.callBack = eyeCatchCallBack.bind(this);
        PixiManager.eyeCatch.show(index + 1);
        setTimeout(eyeCatchHide.bind(this), 3000);
    }


    function eyeCatchHide(): void {
        
        PixiManager.eyeCatch.hide();
        
    }


    function eyeCatchCallBack(type:string):void{

        if (type == 'showComp') {

            if (PixiManager.loading.visible) {
                PixiManager.loading.hide();
            }

            //アイキャッチがフェードアウトする際に
            //次のステージの画面が見えている必要がある為、
            //一時的にレンダリングする。
            Vars.renderFlag = true;
            PhysicsManager.start();

            RendererManager.layerFlag = false;
            SceneManager.scene.skyBox.setVisible(true);

            if (!sameFlag) {
                remove();
                add(index);
            }

            PhysicsManager.setPosition(player.rigidBodyIndex, new THREE.Vector3(0, 1, 0));
            player.restart();
            CameraManager.camera.opInit();
            if (Vars.quality != 'low') {
                SceneManager.scene.leafParticle1.position.copy(CameraManager.camera.cameraTarget.position);
                SceneManager.scene.leafParticle1.position.y = 10;
            }

            //10フレーム後にレンダリングストップ
            //1フレーム後ではプレイヤーやカメラの位置が移動しきれないので、
            //10フレーム後に設定している。
            Vars.maxYieldCount = 10;
            Vars.yieldFunc = function () {
                Vars.renderFlag = false;
                PhysicsManager.stop();
            }.bind(this);

            PixiManager.time.visible = false;

        }else if (type == 'hideComp') {

            //レンダリング再開
            Vars.renderFlag = true;
            MaterialManager.animateFlag = true;
            PhysicsManager.start();

            CameraManager.camera.opStart();
        }
    }


    export function opComp(): void {

        Vars.mousePosition.set(0, 0, 0);
        Vars.inGameFlag = true;

        setTimeout(function () {
            if (!DomManager.hitPointContainer.visibleFlag) {
                DomManager.hitPointContainer.fadeIn();
            }
        }.bind(this), 1000);

        PixiManager.time.visible = true;
        PixiManager.time.start(true);

    }


    function remove(): void {

        if (groundMergeMesh) {
            SceneManager.scene.remove(groundMergeMesh);
            groundMergeMesh.geometry.dispose();
            //ThreeManager.deleteGeometry(groundMergeMesh);
        }

        var length: number = grounds.length;
        for (var i: number = 0; i < length; i++) {
            //grounds[i].setVisible(false);
            grounds[i].addFlag = false;
            PhysicsManager.removeRigidBody(grounds[i]);
        }

        length = trees.length;
        for (var i:number = 0; i < length; i++) {
            trees[i].setVisible(false);
        }

        length = tsuribashis.length;
        for (i = 0; i < length; i++) {
            PhysicsManager.removeRigidBody(tsuribashis[i]);
            tsuribashis[i].setVisible(false);
            if (tsuribashis[i].parent) SceneManager.scene.remove(tsuribashis[i]);
        }

        length = warps.length;
        for (i = 0; i < length; i++) {
            warps[i].setVisible(false);
        }

        DomManager.mouseNavi.hide();


        if (player.nowTween) {
            player.nowTween.stop();
            player.nowTween = null;
        }
        player.setScale(player.defaultScale);
        player.catherEnabledFlag = true;
        player.stageClearFlag = false;
        player.moveFlag = false;
        player.visible = false;
        if (player.catchingFlag) {
            player.catcherClear();
        }

        length = boxs.length;
        for (i = 0; i < length; i++) {
            boxs[i].setVisible(false);
            PhysicsManager.removeRigidBody(boxs[i]);
        }

        length = bikkuriButtons.length;
        for (i = 0; i < length; i++) {
            bikkuriButtons[i].setVisible(false);
            PhysicsManager.removeRigidBody(bikkuriButtons[i]);
        }

        length = spikes.length;
        for (i = 0; i < length; i++) {
            spikes[i].setVisible(false);
            PhysicsManager.removeRigidBody(spikes[i]);
        }

        length = zakos.length;
        for (i = 0; i < length; i++) {
            zakos[i].setVisible(false);
            zakos[i].moveType = null;
            PhysicsManager.removeRigidBody(zakos[i]);
        }

        length = block0s.length;
        for (i = 0; i < length; i++) {
            block0s[i].setVisible(false);
            PhysicsManager.removeRigidBody(block0s[i]);
        }

        length = block1s.length;
        for (i = 0; i < length; i++) {
            block1s[i].setVisible(false);
            PhysicsManager.removeRigidBody(block1s[i]);
        }

        length = block2s.length;
        for (i = 0; i < length; i++) {
            block2s[i].setVisible(false);
            PhysicsManager.removeRigidBody(block2s[i]);
        }

    }


    export function gameOver(): void {

        player.deadFlag = true;
        player.moveFlag = false;
        if (player.catchingFlag) {
            player.catcherClear();
        }
        Vars.inGameFlag = false;
        Vars.gameOverFlag = true;
        PixiManager.gameOverText.show();
        DomManager.mouseNavi.hide();
        DomManager.restartBtn.show();
        PixiManager.time.pause();
        CameraManager.camera.gameOver();

    }


    export function restart(): void {

        Vars.gameOverFlag = false;
        PixiManager.gameOverText.hide(gameOverTextHideComp.bind(this));
        DomManager.hitPointContainer.reset();

    }

    function gameOverTextHideComp():void{

        nextStage(0);

    }

}