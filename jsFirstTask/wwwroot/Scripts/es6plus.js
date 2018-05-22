
window.onload = function () {

    const resultBlock = document.getElementById("result-block");
    const testQuestionBlock = document.getElementById("test-question-block");
    const testBtn = document.getElementById("test-btn");
    const subtitle = document.getElementById('subtitle');
    const questionText = document.getElementById('question');
    const answers = document.getElementById('answers');

    testBtn.onclick = startTest;

    //---- private fields and symbols (???) for TestController class -----
    const _questionList = new WeakMap();
    const _serviceUrl = new WeakMap();
    const _ajaxToService = Symbol('ajaxToService');
    const _createNextQuestionObject = Symbol('createNextQuestionObject');
    const _loadQuestion = Symbol('loadQuestion');
    const _questionFactory = Symbol('questionFactory');
    const _questionGenerator = Symbol('questionGenerator');
    const _showResult = Symbol('showResult');

    const testController = new class {

        constructor(serviceUrl) {

            //_questionList.set(this, []);
            _serviceUrl.set(this, serviceUrl);
        }

        //[_addQuestionToList](question) {

        //    if (question != null && question != undefined) {
        //        let questions = _questionList.get(this);
        //        questions.push(question);
        //        _questionList.set(this, questions);
        //    }
        //}

        addQuestionToList(question) {

            if (question != null && question != undefined) {
                let questions = _questionList.get(this);
                questions.push(question);
                _questionList.set(this, questions);
            }
        }
        

        [_ajaxToService](callback) {

            fetch(_serviceUrl.get(this) + 'TestInit', { credentials: 'include'})
                .then(response => response.json())
                .then(data => {
                    callback(data);
                })
                .catch(ex => console.log(ex));
        }

        async [_createNextQuestionObject](index) {

            let self = this;
            let question;

            await this[_loadQuestion](index, function (data) {
                question =  self[_questionFactory](data);
                question.init(index, (question) => question);
                return question;
            });

           
            

        }

        [_loadQuestion](index, callback) {

            fetch(_serviceUrl.get(this) + 'GetNext',
                {

                    method: 'post',
                    body: JSON.stringify(index),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(data => {
                    callback(data);
                })
                .catch(ex => console.log(ex));

        }

        [_questionFactory](data) {

            let question;

            let separator = "#;",
                text = decodeURIComponent(escape(window.atob(data.text))),
                answers = data.answers.split(separator).map((a) => decodeURIComponent(escape(window.atob(a)))),
                options = data.options.split(separator).map((a) => decodeURIComponent(escape(window.atob(a))));

            if (answers.length > 1)
                question = new CheckboxQuestion(answers, options, text);
            else
                question = new RadioQuestion(answers, options, text);

            return question;

        }

        async *[_questionGenerator](count) {

            for (let i = 0; i < count; i++)
                yield await this[_createNextQuestionObject](i);

            return;
        }

        [_showResult]() {

            testQuestionBlock.style.display = "none";
            resultBlock.style.display = "block";

            let score = 0;
            _questionList.get(this).forEach(function (q, i) {
                score += q.getScore();
            });

            document.getElementById("score").innerText = score;
            testBtn.textContent = "Пройти еще раз";
            testBtn.onclick = startTest;


        }

        async init() {

            resultBlock.style.display = "none";
            testQuestionBlock.style.display = "block";
            testBtn.textContent = "Продолжить";

            _questionList.set(this, []);

            const questionCount = this[_ajaxToService]();
            for await (const quest of this[_questionGenerator](questionCount)) {
                this[_addQuestionToList](quest);
             }
            this[_showResult]();

            //((questionCount) => {
            //    let iterator = this[_questionGenerator](questionCount);
            //    let questionObj = iterator.next();
            //    while (!result.done)
            //        result = questionObj.next().then(({ value, done }) => this[_addQuestionToList(value)]);
            //    this[_showResult]();
            //})
        }

    }('api/TestService/');

    //---- private fields for Question class ----
    const _answers = new WeakMap();
    const _scores = new WeakMap();

    class Question {

        constructor(answers, options, text) {

            _answers.set(this, answers);           
            this.options = options;
            this.text = text;

        }

        getScore() {
            _scores.get(this);
        }
        handleNext(userAnswers, callback) {

            let score = 0;
            let answers = _answers.get(this);
            userAnswers.forEach(function (answer, i) {
                if (answers.indexOf(answer) != -1)
                    score++;
            })

            _scores.set(this, score);
            callback(this);
            //testController.addQuestionToList(this);

        }
    }


    class RadioQuestion extends Question {

        constructor(answers, options, text) {
            super(answers, options, text);
        }

        handleNext(callback) {

            let elems = answers.getElementsByTagName('input');
            let i = 0;
            let userAnswers = [];

            while (i < elems.length && userAnswers.length == 0) {

                if (elems[i].checked == true)
                    userAnswers.push(elems[i].value);
                i++;
            }

            super.handleNext(userAnswers, callback);

        }
        init(num, callback) {

            prepareHtml(num + 1, this.text);

            this.options.forEach(function (op, i) {
                createHtmlOption("radio", "option", op);
            });

            testBtn.onclick = this.handleNext.bind(this);
        }
    }

    class CheckboxQuestion extends Question {

        constructor(answers, options, text) {
            super(answers, options, text);
            this.handleNext = handleNext.bind(this);
        }

        handleNext(callback) {

            let elems = answers.getElementsByTagName('input');
            let userAnswers = [];

            for (var i = 0; i < elems.length; i++) {
                if (elems[i].checked == true)
                    userAnswers.push(elems[i].value);
            }

            super.handleNext(userAnswers);

        } 
        init(num) {

            prepareHtml(num + 1, this.text);
            this.options.forEach(function (op, i) {
                createHtmlOption("checkbox", op, op);
            });
            testBtn.onclick = () => { this.handleNext(); }

        }
    }

    function prepareHtml(num, text) {

        subtitle.innerText = "Вопрос №" + num;
        questionText.innerText = text;
        clearAnswersBlock();
   
    }

    function startTest() {
        testController.init();
    }

    function clearAnswersBlock() {
        while (answers.firstChild) {
            answers.removeChild(answers.firstChild);
        }
    }

    function createHtmlOption(type, name, value) {

        var newInput = document.createElement('input');
        newInput.type = type;
        newInput.name = name;
        newInput.value = value;
        newInput.innerHTML = value + '<br/>';
        newInput.id = value;

        var newLable = document.createElement('label');
        newLable.innerText = value;
        newLable.htmlFor = value;

        answers.appendChild(newInput);
        answers.appendChild(newLable);
        answers.appendChild(document.createElement('br'));
    }
}
