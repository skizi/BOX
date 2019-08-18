module CoverManager{

    var plane: THREE.Mesh;
    var material: THREE.MeshBasicMaterial;

    var count: number = 0;


    export function init(): void {

        material = new THREE.MeshBasicMaterial({ transparent: true, color: 0xffffff, blending:THREE.AdditiveBlending });
        plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1, 1), material);
        plane.visible = false;
        SceneManager.scene.add(plane);

        //animate();
        Vars.setAnimateFunc(animate.bind(this));

    }


    function animate(): void {

        //requestAnimationFrame(() => animate());

        var pos: THREE.Vector3 = CameraManager.camera.position.clone();
        var forward: THREE.Vector3 = ThreeManager.getForward(CameraManager.camera);
        pos.add(forward.multiplyScalar(2));
        plane.position.copy(pos);

        plane.lookAt(CameraManager.camera.position);

    }

    //----------------------------------flash---------------------------------------
    export function flash(type:string): void {

        switch (type) {

            case 'blue':
                material.color = new THREE.Color(0x51e3fe);
                break;

        }


        material.opacity = 0;
        material.blending = THREE.AdditiveBlending;
        plane.material = material;
        plane.material.needsUpdate = true;


        count = 0;
        plane.visible = true;
        TweenManager.addTweenAlpha(plane, .7, 250, TWEEN.Easing.Linear.None, 0, tweenCompStep1.bind(this));
    }


    function tweenCompStep1(): void {

        var duration: number = 100;
        if (count == 1) duration = 50;
        TweenManager.addTweenAlpha(plane, 0, duration, TWEEN.Easing.Linear.None, 0, tweenCompStep2.bind(this));

    }


    function tweenCompStep2(): void {

        count++;
        if (count == 1) {
            TweenManager.addTweenAlpha(plane, .5, 150, TWEEN.Easing.Linear.None, 200, tweenCompStep1.bind(this));
            return;
        }

        plane.visible = false;

    }



    //----------------------------------fadeOut---------------------------------------
    export function fadeOut(color:string, callBack:Function = null): void {
        
        switch (color) {

            case 'black':
                material.color = new THREE.Color(0x000000);
                material.blending = THREE.NormalBlending;
                break;

            case 'white':
                material.color = new THREE.Color(0xffffff);
                material.blending = THREE.AdditiveBlending;
                break;

        }


        material.opacity = 0;
        plane.material = material;
        plane.material.needsUpdate = true;


        plane.visible = true;
        TweenManager.addTweenAlpha(plane, 1, 500, TWEEN.Easing.Linear.None, 0, callBack);

    }


    //----------------------------------fadeIn---------------------------------------
    var fadeInCallBack: Function;
    export function fadeIn(color: string, callBack: Function = null): void {

        fadeInCallBack = callBack;

        switch (color) {

            case 'black':
                material.color = new THREE.Color(0x000000);
                material.blending = THREE.NormalBlending;
                break;

            case 'white':
                material.color = new THREE.Color(0xffffff);
                material.blending = THREE.AdditiveBlending;
                break;

        }


        material.opacity = 1;
        plane.material = material;
        plane.material.needsUpdate = true;


        plane.visible = true;
        TweenManager.addTweenAlpha(plane, 0, 500, TWEEN.Easing.Linear.None, 0, fadeInComp.bind(this));

    }


    function fadeInComp(): void {

        plane.visible = false;
        if (fadeInCallBack) fadeInCallBack();

    }

} 