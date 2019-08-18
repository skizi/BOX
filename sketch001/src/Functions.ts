module Functions {

    export function objectCheck(obj:Object){

        var properties = '';
        for (var prop in obj) {
            properties += prop + "=" + obj[prop] + "\n";
        }
        alert(properties);
	
    }

    export function easing(now: number, target: number, easing:number):number {

        now += -(now - target) / easing;

        return now;

    }

    var fliction: number = .9;
    var spring: number = .3;
    //cacheは値をキャッシュするために使うのでグローバル変数でないといけない
    export function easing2(now: number, target: number, cache:number): any {

        cache += -(now - target) / 2 * spring;
        cache *= fliction;
        now += cache;

        return { now: now, cache: cache };
    }


}