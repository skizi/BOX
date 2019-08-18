class Snake{

    private meshLength: number = 0;
    private meshArray: Array<THREE.Mesh>;


    private vecArray: Array<THREE.Vector3> = [];
    private interval: number = 10;
    private dist: number = 0;
    private oldIndex: number = 0;

    public targetPos: THREE.Vector3 = new THREE.Vector3();
    private speed: number = 20;



    constructor( meshArray:Array<THREE.Mesh> ) {

        this.meshArray = meshArray;
        this.meshLength = meshArray.length;
        this.dist = this.interval * this.meshLength;

        for (var i: number = 0; i < this.dist; i++){
            this.vecArray.push( new THREE.Vector3() );
        }



        this.animate();
    }



    private animate():void {

        requestAnimationFrame(() => this.animate());

        //set target position
        var obj:any = ThreeManager.getMouseTo(this.meshArray[0]);
        //var direction: THREE.Vector3 = ThreeManager.getCameraForward(obj.direction);
        //this.targetPos.add( direction.multiplyScalar( this.speed ) );
        //this.targetPos = ThreeManager.screen2world();
        this.targetPos = Vars.mousePosition;

        //set snake
        var index: number = this.oldIndex;
        for (var i = 0; i < this.meshLength; i++) {
            index = ( index - this.interval + this.dist) % this.dist;
            this.meshArray[i].position.copy( this.vecArray[index] );
        }
        this.vecArray[this.oldIndex] = this.targetPos.clone();
        this.oldIndex = (this.oldIndex + 1) % this.dist;

    }

}