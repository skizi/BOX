module Utils {


    export function mergeFloat32Array(arrays:Array<Float32Array> ): Float32Array {

        //create new array
        var arraysLegth: number = arrays.length;
        var allLength: number = 0;
        for (var i: number = 0; i < arraysLegth; i++) {
            allLength += arrays[i].length;
        }

        var newArray: Float32Array = new Float32Array(allLength);
        var count: number = 0;
        for (i = 0; i < arraysLegth; i++) {
            var length: number = arrays[i].length;
            for (var j: number = 0; j < length; j++) newArray[j + count] = arrays[i][j];
            count += length;
        }

        return newArray;

    }


}