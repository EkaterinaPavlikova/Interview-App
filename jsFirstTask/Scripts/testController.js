import { CheckboxQuestion } from "./checkboxQuestion";
import { RadioQuestion } from "./radioQuestion";


const url = 'api/TestService/';
export const testController = (function(serviceUrl) {

    let instance;
    const _serviceUrl = serviceUrl;
    let _questionList = [];


    function addQuestionToList(question) {

        if (question != null && question != undefined) {
            _questionList.push(question);

        }
    }

    function ajaxToService() {

        return new Promise((res, rej) =>
            fetch(_serviceUrl + 'TestInit', { credentials: 'include' })
            .then(response => {
                if (response.status != 200) {
                    rej(response)
                } else {
                    res(response.json())
                }
            }))
    }


    function createNextQuestionObject(index) {
        return loadQuestion(index)
            .then(data => questionFactory(data))
            .then(question => new Promise(resolve => question.init(index, resolve)));
    }

    function loadQuestion(index) {

        const request = new Promise((resolve, reject) => {

            fetch(_serviceUrl + 'GetNext', {
                    method: 'post',
                    body: JSON.stringify(index),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                .then(response => resolve(response.json()))
                .catch(err => reject(err));
        })
        return request

    }

    function questionFactory(data) {

        let question;

        const separator = "#;",
            text = decodeURIComponent(escape(window.atob(data.text))),
            answers = data.answers.split(separator).map(a => decodeURIComponent(escape(window.atob(a)))),
            options = data.options.split(separator).map(a => decodeURIComponent(escape(window.atob(a))));

        if (answers.length > 1)
            question = new CheckboxQuestion(answers, options, text);
        else
            question = new RadioQuestion(answers, options, text);

        return question;

    }

    async function* questionGenerator(count) {

        for (let i = 0; i < count; i++) {
            yield await createNextQuestionObject(i);
        }
    }

    function showResult() {

        const testBtn = document.getElementById("test-btn");

        document.getElementById("test-question-block").style.display = "none";
        document.getElementById("result-block").style.display = "block";

        const score = _questionList.reduce((val, el) => val + el.getScore(), 0);

        document.getElementById("score").innerText = score;
        testBtn.textContent = "Пройти еще раз";
        testBtn.onclick = init;


    }

    async function init() {

        _questionList = [];

        const questionCount = await ajaxToService().catch(err => alert(`Произошла ошибка: ${err.message}`));

        for await (const question of questionGenerator(questionCount)) {
            addQuestionToList(question);
        }

        showResult();

    }

    const createInstance = function() {
        return {
            init: init
        }
    }

    return {
        getInstance: function() {
            return instance || (instance = createInstance());
        }
    }

})(url);