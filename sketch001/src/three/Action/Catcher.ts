module Action.catcher {

    export var objects: any = {};

    export function add(go:any, targets:Array<any>, catchDist:number): void {

        var name: string = go.name;

        if (!objects[name]) objects[name] = {};
        objects[name].go = go;
        objects[name].targets = targets;
        objects[name].targetsLength = targets.length;
        objects[name].catchDist = catchDist;

    }



    //持てる対象を探して、可能なら持つ
    export function search(name:string): void {

        for (var i: number = 0; i < objects[name].targetsLength; i++) {

            //自分が物を持っていなくて、なおかつ対象も持たれてない場合、自身が死んでいない場合、対象が死んでいない場合
            if (!objects[name].go.catchingFlag &&
                !objects[name].targets[i].catchFlag &&
                !objects[name].go.deadFlag &&
                !objects[name].targets[i].deadFlag) {
                
                //範囲内に対象があるかチェック、あればサークルをセット
                var dist: number = objects[name].go.position.clone().distanceTo(objects[name].targets[i].position.clone());
                if (dist < objects[name].catchDist) {
                    objects[name].targets[i].setCatchCircle(true);
                    if (objects[name].targets[i].catchStandbyFlag) {
                        objects[name].targets[i].catchStandbyFlag = false;
                        objects[name].go.catchingFlag = true;
                        objects[name].targets[i].catchFlag = true;
                        objects[name].catchTarget = objects[name].targets[i];
                        objects[name].go.catcher(objects[name].targets[i]);
                    }
                } else {
                    objects[name].targets[i].setCatchCircle(false);
                }
            }

        }

    }

    


    export function release(name:string):void {
        objects[name].go.catchingFlag = false;
        for (var i: number = 0; i < objects[name].targetsLength; i++) objects[name].targets[i].catchFlag = false;
        if (objects[name].go.catchTarget) {
            objects[name].go.catchTarget.catchFlag = false;
            objects[name].go.catchTarget = null;
        }
    }

}