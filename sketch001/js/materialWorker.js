'use strict'
importScripts('three.min.js');

var loadCount = 0;
var loadMax = 0;

var data = {};

var playerMap;
var transparent2Map;

var houseInnerMap;



function init(quality) {

    //player
    var url = '../assets/models/player/diffuse.jpg';
    if (quality == 'low') url = '../assets/models/player/diffuse_low.jpg';
    imageLoad(url, 'playerDiffuse');

    imageLoad('../assets/models/transparent2.png', 'transparent2');

}


function imageLoad(url, name) {

    loadMax++;

    var xmlReq = new XMLHttpRequest();
    xmlReq.open("GET", url, true);
    xmlReq.responseType = "arraybuffer";
    xmlReq.onload = imageLoadComp;
    xmlReq.send(null);
    xmlReq.name = name;

}


function imageLoadComp(e) {

    var arrayBuffer = e.target.response;
    if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        var tex = new THREE.DataTexture(byteArray, 512, 512, THREE.RGBFormat);
        tex.needsUpdate = true;

        switch (e.target.name) {

            case 'playerDiffuse':
                data.playerDiffuse = tex;
                break;

            case 'transparent2':
                data.transparent2 = tex;
                break;
        }

    }


    loadCount++;
    if (loadCount == loadMax) self.postMessage({ type: 'loadComp', textures: data });
}





self.onmessage = function (event) {

    var obj = event.data;
    switch (obj.type) {

        case 'init':
            init(obj.quality);
            break;

    }

}

postMessage({ type: 'workerScriptLoadComp' });