module StageData {

    export function init(): void {

        for (var stageIndex: number = 0; stageIndex < stages.length; stageIndex++) {

            var stageObj: any = stages[stageIndex];
            for (var type in stageObj) {

                for (var i: number = 0; i < stageObj[type].length; i++) {

                    var object: THREE.Object3D = new THREE.Object3D();
                    object.rotation.set(stageObj[type][i].rotation[0], stageObj[type][i].rotation[1], stageObj[type][i].rotation[2]);
                    object.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0).normalize(), -90 * Vars.toRad);

                    //reset position
                    var posX: number = stageObj[type][i].position[0];
                    var posY: number = stageObj[type][i].position[1];
                    var posZ: number = stageObj[type][i].position[2];

                    stageObj[type][i].position[0] = posX;
                    stageObj[type][i].position[1] = posZ;
                    stageObj[type][i].position[2] = -posY;

                    //reset rotation
                    var rotX:number = stageObj[type][i].rotation[0];
                    var rotY:number = stageObj[type][i].rotation[1];
                    var rotZ:number = stageObj[type][i].rotation[2];

                    stageObj[type][i].rotation[0] = rotX;
                    stageObj[type][i].rotation[1] = rotZ;
                    stageObj[type][i].rotation[2] = rotY;
                    
                }

            }

        }

    }



    //flipYZしていないものを入れる
    export var stage1: any = {

        "grounds": [


            {
                "name": "ground9",
                "geometry": "geo_grass.108",
                "groups": [],
                "material": "",
                "position": [37.0454, 14.02, 8.96895],
                "rotation": [2.68718e-07, -4.71963e-13, 3.14159],
                "quaternion": [-1.17991e-13, -1.34359e-07, 1, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },

            {
                "name": "ground6",
                "geometry": "geo_grass.105",
                "groups": [],
                "material": "",
                "position": [30.7006, -10.9887, -5.85407],
                "rotation": [2.02416e-13, 2.68718e-07, -1.5708],
                "quaternion": [-9.50061e-08, 9.50062e-08, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },

            {
                "name": "ground1",
                "geometry": "geo_grass.094",
                "groups": [],
                "material": "",
                "position": [51.9367, 0.135266, -7.28644],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },

            {
                "name": "ground1",
                "geometry": "geo_grass.001",
                "groups": [],
                "material": "",
                "position": [15.4331, -25.7784, -40.0258],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":false,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground0",
                "geometry": "geo_grass.000",
                "groups": [],
                "material": "",
                "position": [0, 0, -2.28684],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false,
                "groundY": 0
            },
            {
                "name": "ground0",
                "geometry": "geo_grass.002",
                "groups": [],
                "material": "",
                "position": [30.3347, 20.1653, -28.9829],
                "rotation": [3.14159, -5.55257e-14, 1.34359e-07],
                "quaternion": [1, -6.71794e-08, 3.12325e-14, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":false,
                "receiveShadow": false,
                "doubleSided": false
            },
        ],

        "trees": [
            {
                "name": "tree0",
                "geometry": "geo_grass.009",
                "groups": [],
                "material": "",
                "position": [52.8166, 4.62284, -0.196955],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "tree0",
                "geometry": "geo_grass.003",
                "groups": [],
                "material": "",
                "position": [-6.97611, -9.1663, 1.13542],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "tsuribashis": [
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.001",
                "groups": [],
                "material": "",
                "position": [12.1444, 0.273357, -0.00792827],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": false,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.000",
                "groups": [],
                "material": "",
                "position": [5.51851, 11.8959, -0.00792827],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "warps": [
            {
                "name": "warp",
                "geometry": "geo_Cube.023",
                "groups": [],
                "material": "",
                "position": [55.8415, -3.33417e-07, 0.0686563],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "boxs": [
            {
                "name": "box0",
                "geometry": "geo_grass.098",
                "groups": [],
                "material": "ground.001",
                "position": [7.0193, 3.91321, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "box0",
                "geometry": "geo_grass.005",
                "groups": [],
                "material": "ground.001",
                "position": [-3.65269, 2.78635, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "box0",
                "geometry": "geo_grass.004",
                "groups": [],
                "material": "ground.001",
                "position": [4.83187, -4.10736, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            },
        ],

        "bikkuriButtons": [
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube",
                "groups": [],
                "material": "Material",
                "position": [5.51959, 42.779, 1.73439],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false,
                "type":'bridge',
                "hitCallBack": function () {
                    var tsuribashi0: Tsuribashi = <Tsuribashi>SceneManager.scene.getObjectByName('tsuribashi0', false);
                    if (!tsuribashi0.visible) {
                        tsuribashi0.setVisible(true);
                        tsuribashi0.setRigidBodyManyShape();

                        TextManager.refresh();
                        TextManager.setText('遠くで橋の架かる音がした。', true);
                    }
                }
            }
        ],


        "spikes": [
            {
                "name": "spike",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [0.0665164, -15.816, -1.34409],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],


        "zakos": [
            {
                "name": "zako",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [5, 5, 1],
                "rotation": [0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],


        "block0s":[

            {
                "name": "block0",
                "geometry": "geo_Cube.006",
                "groups": [],
                "material": "block0",
                "position": [-2, -1.00922, 0.995717],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            }

        ]
    };


    var stage2 = {

        "grounds":[
            {
                "name": "ground9",
                "geometry": "geo_grass.000",
                "groups": [],
                "material": "",
                "position": [20.9557, 14.02, 0.777409],
                "rotation": [2.68718e-07, -4.71963e-13, 3.14159],
                "quaternion": [-1.17991e-13, -1.34359e-07, 1, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground9",
                "geometry": "geo_grass.004",
                "groups": [],
                "material": "",
                "position": [48.7606, 2.93058, 2.08359],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground9",
                "geometry": "geo_grass.002",
                "groups": [],
                "material": "",
                "position": [48.7606, -2.45852, 2.08359],
                "rotation": [2.68718e-07, -4.71963e-13, 3.14159],
                "quaternion": [-1.17991e-13, -1.34359e-07, 1, 8.78176e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground6",
                "geometry": "geo_grass.105",
                "groups": [],
                "material": "",
                "position": [22.9006, -10.9887, -7.43438],
                "rotation": [2.02416e-13, 2.68718e-07, -1.5708],
                "quaternion": [-9.50061e-08, 9.50062e-08, -0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground1",
                "geometry": "geo_grass.094",
                "groups": [],
                "material": "",
                "position": [44.1367, 0.135266, -7.19335],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground7",
                "geometry": "geo_grass.106",
                "groups": [],
                "material": "",
                "position": [0.0574427, 2.94749e-07, -4.87956],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "ground7",
                "geometry": "geo_grass.001",
                "groups": [],
                "material": "",
                "position": [88.3042, 2.94749e-07, -4.87956],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody":true,
                "receiveShadow": false,
                "doubleSided": false
            },
        ],

        "trees":[
            {
                "name": "tree0",
                "geometry": "geo_grass.009",
                "groups": [],
                "material": "",
                "position": [40.5663, 4.62284, -0.103865],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "tree0",
                "geometry": "geo_grass.003",
                "groups": [],
                "material": "",
                "position": [-3.82883, -3.62397, -0.103865],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
                
        ],

        "tsuribashis":[
            {
                "name":"tsuribashi",
                "geometry": "geo_etc1.001",
                "groups": [],
                "material": "",
                "position": [4.34445, 0.273357, 0.0851619],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707105],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },
            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.000",
                "groups": [],
                "material": "",
                "position": [50.9245, 0.273357, 0.0851619],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707105],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "warps":[
            {
                "name": "warp",
                "geometry": "geo_Cube.023",
                "groups": [],
                "material": "",
                "position": [88.5657, -3.86672e-08, 0.161747],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "boxs": [
            {
                "name": "box0",
                "geometry": "geo_grass.098",
                "groups": [],
                "material": "ground.001",
                "position": [1.76303, 0.281603, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "bikkuriButtons": [
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube",
                "groups": [],
                "material": "Material",
                "position": [38.1073, -6.18126, 1.73439],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'small',
                "hitCallBack": function () {
                    var player: Player = <Player>SceneManager.scene.getObjectByName('player', false);
                    if (player.nowScale == player.defaultScale) {
                        //player.catherEnabledFlag = false;
                        if (player.catchingFlag) {
                            player.release();
                            DomManager.mouseNavi.hide();
                        }
                        player.setScale(player.minScale);
                        var text: string = '体が小さくなった！';
                    } else {
                        player.setScale(player.defaultScale);
                        //player.catherEnabledFlag = true;
                        text = '体がもとの大きさに戻った！';
                    }

                    TextManager.refresh();
                    TextManager.setText(text, true);
                }
            }
        ],


        "zakos": [
            {
                "name": "zako",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [44.1367, 0.135266, 2],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ]

    };



    var stage3: any = {


        "bikkuriButtons":[
            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube.002",
                "groups": [],
                "material": "Material",
                "position": [0.0561388, 46.45, 1.51853],
                "rotation": [-0, 0, 1.5708],
                "quaternion": [0, 0, 0.707107, 0.707107],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () { }
            },

            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube.001",
                "groups": [],
                "material": "Material",
                "position": [46.5166, 8.70662, 1.51853],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () { }
            },


            {
                "name": "bikkuriButton0",
                "geometry": "geo_Cube",
                "groups": [],
                "material": "Material",
                "position": [46.5166, 0.039588, 1.51853],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false,
                "type": 'bridge',
                "hitCallBack": function () { }
            }

        ],

        "tsuribashis":[

            {
                "name":"tsuribashi",
                "geometry": "geo_etc1.004",
                "groups": [],
                "material": "",
                "position": [-44.7935, 5.2735, 0],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.003",
                "groups": [],
                "material": "",
                "position": [12.1153, 8.65456, 0],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.002",
                "groups": [],
                "material": "",
                "position": [0.0352571, 12.0487, -1.49012e-08],
                "rotation": [0, 0, -2.55903e-06],
                "quaternion": [0, 0, -1.27952e-06, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            },


            {
                "name": "tsuribashi",
                "geometry": "geo_etc1.001",
                "groups": [],
                "material": "",
                "position": [12.1153, -0.00320211, 0],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707108, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }

        ],


        "grounds":[
            {
                "name": "ground8",
                "geometry": "geo_grass.007",
                "groups": [],
                "material": "",
                "position": [0.0557726, 46.3882, -1.97389],
                "rotation": [2.68718e-07, -5.36031e-13, 3.14159],
                "quaternion": [-1.34008e-13, -1.34359e-07, 1, 9.97386e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground8",
                "geometry": "geo_grass.006",
                "groups": [],
                "material": "",
                "position": [46.4548, 8.61392, -1.97389],
                "rotation": [-6.48721e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground0",
                "geometry": "geo_grass.005",
                "groups": [],
                "material": "",
                "position": [0, 0, -2.24749],
                "rotation": [-3.14159, 1.27952e-06, 1.57079],
                "quaternion": [0.707107, -0.707106, 4.52377e-07, -4.52378e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground8",
                "geometry": "geo_grass.107",
                "groups": [],
                "material": "",
                "position": [46.4548, -0.0823044, -1.97389],
                "rotation": [-6.48721e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            },

            {
                "name": "ground7",
                "geometry": "geo_grass.010",
                "groups": [],
                "material": "",
                "position": [-49.1664, 5.3547, -4.97079],
                "rotation": [-7.66917e-13, -2.68718e-07, 1.57079],
                "quaternion": [-9.50062e-08, -9.5006e-08, 0.707106, 0.707108],
                "scale": [1, 1, 1],
                "visible": true,
                "rigidBody": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "trees":[
            {
                "name": "tree1",
                "geometry": "geo_grass.009",
                "groups": [],
                "material": "",
                "position": [-8.29068, -9.73668, -0.13458],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }

        ],

        "warps":[
            {
                "name": "warp",
                "geometry": "geo_Cube.023",
                "groups": [],
                "material": "",
                "position": [-49.1045, 5.34328, 0.0063829],
                "rotation": [0, 0, -1.5708],
                "quaternion": [0, 0, -0.707107, 0.707106],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "boxs": [
            {
                "name": "box0",
                "geometry": "geo_grass.098",
                "groups": [],
                "material": "ground.002",
                "position": [1.76303, 0.281603, 1.01136],
                "rotation": [-2.68718e-07, -3.61046e-14, 1.34359e-07],
                "quaternion": [-1.34359e-07, -9.02616e-15, 6.71794e-08, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ],

        "block1s":[
            {
                "name": "block1",
                "geometry": "geo_Cube.008",
                "groups": [],
                "material": "block0.001",
                "position": [2.19053, -7.22261, 0.995904],
                "rotation": [-1.19209e-07, 1.00898e-13, 3.14159],
                "quaternion": [5.2108e-15, 5.96046e-08, 1, 7.58967e-07],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            }

        ],

        "block2s": [
            {
                "name": "block2",
                "geometry": "geo_Cube.008",
                "groups": [],
                "material": "block0.001",
                "position": [2.18426, -0.705824, 1.07121],
                "rotation": [-0, 0, -0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "castShadow": false,
                "receiveShadow": false,
                "doubleSided": false
            }

        ],

        "zakos": [
            {
                "name": "zako",
                "geometry": "geo_Plane.002",
                "groups": [],
                "material": "",
                "position": [3.85657, -3.96296, 1.01831],
                "rotation": [-0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1],
                "visible": true,
                "receiveShadow": false,
                "doubleSided": false
            }
        ]
    };



    export var stages: Array<any> = [stage1, stage2, stage3];
}