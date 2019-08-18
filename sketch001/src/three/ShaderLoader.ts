class ShaderLoader{

    public name: string = '';
    private callback: Function;


    constructor(name, url, callback) {

        this.name = name;
        this.callback = callback;

        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    this.loadComp(request.responseText);
                } else {
                    this.loadError();
                }
            }
        }.bind(this);

        request.send(null);
    }


    private loadComp(shaderText:string): void{

        this.callback(shaderText, this.name);

    }


    private loadError(): void {

        this.callback("shaderLoader :: Load Faild");

    }

} 