module ShaderLoadManager{
    
    export var shaders: any = {};
    var shaderLoaders: Array<ShaderLoader>;

    var urls: Array<string> = [
        'fragmentShaderDepth',
        'vertexShaderDepth'
    ];


    export function init():void{

        var length: number = urls.length;
        for (var i: number = 0; i < length; i++) {
            var url: string = 'assets/shader/' + urls[i] + '.glsl';
            shaderLoaders[i] = new ShaderLoader(urls[i], url, loadComp.bind(this));
        }

    }


    function loadComp(shader: string, name:string): void {

        shaders[name] = shader;
        var strArray: Array<string> = shader.split(/\r\n|\r|\n/);

        var str: string = '"';
        var length: number = strArray.length;
        for (var i: number = 0; i < length; i++) {
            if (strArray[i] != '') {
                str += strArray[i];
            }
        }
        str += '"';

        alert(str);

    }


} 