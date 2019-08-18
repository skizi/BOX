module TextManager {

    var textView: TextView;


    export function init() {

        textView = new TextView();
        Vars.setEnterDownFunc(nextText.bind(this));

    }


    export function setText(text: string, autoFadeOutFlag:boolean = false): void {

        textView.setText(text, autoFadeOutFlag);

    }


    export function nextText(): void {

        textView.nextText();

    }


    export function refresh(): void {

        textView.refresh();

    }

}