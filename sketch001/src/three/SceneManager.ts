 module SceneManager {

     export var scene: Scene;
     export var layer0: Layer;

     export function init(): void {


         scene = new Scene();
         //scene.fog = new THREE.Fog(0x787cd3, 5, 30);

         layer0 = new Layer();

     }


     export function initObjects(): void {

         scene.initObjects();

     }

}