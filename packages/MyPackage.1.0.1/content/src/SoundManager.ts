module SoundManager {

    var preload;
    var instanceHash = {};
    var volumeObj: any = { volume:1 };



    export function init() {

        var assetsPath = "assets/sound/";
        var manifest = [
            { src: "denkiSwitch.mp3", type: "sound", id: 1, data:1 }    //dataは音を重ねていい回数
        ];

        createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
        createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
        createjs.Sound.registerManifest(manifest, assetsPath);


    }


    function soundLoaded(event) {

        console.log( "sound load comp" );

    }


    export function stop() {

        if (preload != null) { preload.close(); }
        createjs.Sound.stop();

    }


    export function play( id:number, loopFlag:boolean ):number {

        var loop = 0;
        if (loopFlag) loop = -1;
        var instance = createjs.Sound.createInstance( id );
        instance.play( createjs.Sound.INTERRUPT_ANY, 0, 0, loop, 1, 1);


        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
            return;
        } else {
            instanceHash[instance.uniqueId] = instance;
            instance.addEventListener("succeeded", createjs.proxy(playSuccess, instance));
            instance.addEventListener("interrupted", createjs.proxy(playFailed, instance));
            instance.addEventListener("failed", createjs.proxy(playFailed, instance));
            instance.addEventListener("complete", createjs.proxy(soundComplete, instance));
        }


        return instance.uniqueId;

    }

    function playSuccess() {


    }

    function playFailed( e ) {

        var instance = e.target;
        instance.removeAllEventListeners();
        delete (instanceHash[instance.uniqueId]);

    }

    function soundComplete( e ) {

        var instance = e.target;
        instance.removeAllEventListeners();
        delete (instanceHash[instance.uniqueId]);

    }




    export function pause(id: number) {

        if (instanceHash[id] ) instanceHash[id].pause();

    }

    export function resume(id: number) {

        if (instanceHash[id]) instanceHash[id].resume();

    }



    export function allPause() {

        for (var id in instanceHash) {
            instanceHash[id].pause();
        }

    }

    export function allResume() {

        for (var id in instanceHash) {
            instanceHash[id].resume();
        }

    }


    export function setVolume( volume:number ):void {

        createjs.Sound.setVolume( volume );

    }


    export function setSmoothVolume(volume: number, time:number,  pauseFlag:boolean): void {

        new TWEEN.Tween(volumeObj).to({ volume: volume }, time )
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () { createjs.Sound.setVolume(volumeObj.volume); }.bind(this) )
            .onComplete(function (self) { if (pauseFlag) allPause(); }.bind(this)).start();

    }

}