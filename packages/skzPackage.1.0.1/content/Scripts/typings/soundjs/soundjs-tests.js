///<reference path="./soundjs.d.ts"/>
// Sample from : http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html
// Feature set example:
createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));
createjs.Sound.registerSound("path/to/mySound.mp3|path/to/mySound.ogg", "sound");
function loadHandler(event) {
    // This is fired for each sound that is registered.
    var instance = createjs.Sound.play("sound");
    instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
    instance.setVolume(0.5);
}
//# sourceMappingURL=soundjs-tests.js.map
