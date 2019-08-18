'use strict'
importScripts('three.min.js', 'loaders/SceneLoader.js');

var data = {};
var loadCount = 0;
var loadMax = 0;

var jsonLoader;
var sceneLoader;



function init() {

    jsonLoader = new THREE.JSONLoader();
    sceneLoader = new THREE.SceneLoader();

    load('../assets/models/scene_test4.js', 'scene');//workerからメインのjsに渡すときにエラーが出てしまう
    load('../assets/models/player/player4.js', 'json');

}


function load(url, type, _callbackFunc ) {

    loadMax++;

    switch( type ){

        case "scene":
            sceneLoader.load(url, sceneLoadCompHandler.bind(this));
            break;
                
        case "json":
            jsonLoader.load(url, jsonLoadCompHandler.bind(this));
            break;
    }
}


function sceneLoadCompHandler(result) {
    
    var geometries = [];
    var objects = result.objects;
    for (var name in objects) {
        if( objects[name] instanceof THREE.Mesh ){
            geometries.push(objects[name].geometry);
        }
    }
    
    data.assetsGeometries = geometries;

    loadCount++;
    if (loadCount == loadMax) loadComp();
}


function jsonLoadCompHandler(geometry, materials) {

    data.playerGeometry = geometry;

    loadCount++;
    if (loadCount == loadMax) loadComp();
}


function loadComp() {

    self.postMessage({ type: 'loadComp', result: data });

}



self.onmessage = function (event) {

    var obj = event.data;
    switch (obj.type) {

        case 'init':
            init();
            break;

    }

}

postMessage({ type: 'workerScriptLoadComp' });