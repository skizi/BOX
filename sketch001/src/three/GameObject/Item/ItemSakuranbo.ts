class ItemScakuranbo extends Item{

    

    constructor(name:string) {

        super(name, 'img/item_sakuranbo.png', 10);

        //uvは左下が(0, 0)
        var uvs: Array<THREE.Vector2> = [];
        uvs[0] = new THREE.Vector2(0, 0);
        uvs[1] = new THREE.Vector2(.5, .5);
        uvs[2] = new THREE.Vector2(0, .5);

        var index: number = Math.random() * 3;
        index = Math.floor(index);

        //spriteMaterialのuvScroll、uvScaleはまだ使えない模様
        this.sprite.material.map.repeat.set(.5, .5);
        this.sprite.material.map.offset.copy(uvs[index]);
        
    }

}