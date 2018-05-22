import { Question } from "./question";
import * as html from "./htmlRender";



export class RadioQuestion extends Question {

    constructor(answers, options, text) {
        super(answers, options, text);
        this.handleNext = this.handleNext.bind(this);
    }

    handleNext(resolve) {
        const answers = document.getElementById('answers');
        const elems = answers.getElementsByTagName('input');

        const userAnswers = [...elems]
            .filter(el => el.checked)
            .map(el => el.value);

        super.handleNext(userAnswers, resolve);

    }
    init(num, resolve) {
        const testBtn = document.getElementById("test-btn");
        html.prepareHtml(num + 1, this.text);

        this.options.forEach(function(op) {
            html.createHtmlOption("radio", "option", op);
        });
        testBtn.onclick = () => { this.handleNext(resolve) };
    }
}