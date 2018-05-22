window.onload = function () {

    var resultBlock = document.getElementById("result-block");
    var testQuestionBlock = document.getElementById("test-question-block");
    var testBtn = document.getElementById("test-btn");
    var subtitle = document.getElementById('subtitle');
    var questionText = document.getElementById('question');
    var answers = document.getElementById('answers');
    var test, question;

    testBtn.onclick = startTest;

    function TestController() {
        this.questionCount = 0;
        this.questionIndex = 0;
        this.questionList = [];
        this.serviceUrl = 'api/TestService/';
    }

    TestController.prototype.addQuestionToList = function (question) {
        this.questionList.push(question);
    }
    TestController.prototype.ajaxToService = function (funcName, method, body) {

        if (body === undefined) {
            return fetch(this.serviceUrl + funcName, {
                method: method,
                credentials: 'include',
            })
        }
        else {
            return fetch(this.serviceUrl + funcName, {
                method: method,
                credentials: 'include',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }

            })
        }
    }

    TestController.prototype.createNextQuestionObject = function () {

        if (this.questionIndex < this.questionCount) {
            this.loadQuestion();
        }
        else {
            this.showResult();
        }

    }
    TestController.prototype.init = function () {

        this.ajaxToService('TestInit', 'get')
            .then(response =>
                response.json())
            .then(data => {
                this.questionCount = data;
                this.createNextQuestionObject();
            })

        resultBlock.style.display = "none";
        testQuestionBlock.style.display = "block";
        testBtn.textContent = "Продолжить";
        testBtn.onclick = nextQuestion;

    }

    TestController.prototype.loadQuestion = function () {

        this.ajaxToService('GetNext', 'post', this.questionIndex)
            .then(response =>
                response.json())
            .then(data => {
                this.questionIndex++;
                this.questionFactory(data);
            });
    }

    TestController.prototype.questionFactory = function (data) {

        var separator = "#;";
        var text = decodeURIComponent(escape(window.atob(data.text)));
        var answers = data.answers.split(separator).map((a) => decodeURIComponent(escape(window.atob(a))));
        var options = data.options.split(separator).map((a) => decodeURIComponent(escape(window.atob(a))));

        if (answers.length > 1)
            question = new CheckboxsQuestion(text, answers, options);
        else
            question = new RadioQuestion(text, answers, options);

        question.init(this.questionIndex);

    }

    TestController.prototype.showResult = function () {

        testQuestionBlock.style.display = "none";
        resultBlock.style.display = "block";

        var score = 0;        
        this.questionList.forEach(function (q, i) {
           score += q.getScore();
        });


        document.getElementById("score").innerText = score;
        testBtn.textContent = "Пройти еще раз";
        testBtn.onclick = startTest;

    }

    function Question(text, answers, options) {
        this.answers = answers;
        this.options = options;
        this.score = 0;
        this.text = text;
        this.userAnswers =[];
    }

    Question.prototype.getScore = function () {
        return this.score;
    }

    Question.prototype.handleNext = function (userAnswers) {

        var self = this;
        this.userAnswers.forEach(function (answer, i) {
            if (self.answers.indexOf(answer) != -1)
                self.score++;
        })


        test.addQuestionToList(this)
        test.createNextQuestionObject();
    }


    function RadioQuestion(text, answers, options) {
        Question.apply(this, arguments);
    }
    RadioQuestion.prototype = Object.create(Question.prototype);
    RadioQuestion.prototype.init = function (num) {
        subtitle.innerText = "Вопрос №" + num;
        questionText.innerText = this.text;
        clearAnswersBlock();

        this.options.forEach(function (op, i) {
            createHtmlOption("radio", "option", op);
        });
    }
    RadioQuestion.prototype.handleNext = function () {

        
        var elems = answers.getElementsByTagName('input');
        var i = 0;

        while (i < elems.length && this.userAnswers.length == 0) {

            if (elems[i].checked == true)
                this.userAnswers.push(elems[i].value);
            i++;
        }

        Question.prototype.handleNext.apply(this);
    }

    function CheckboxsQuestion(text, answers, options) {
        Question.apply(this, arguments);
    }
    CheckboxsQuestion.prototype = Object.create(Question.prototype);
    CheckboxsQuestion.prototype.init = function (num) {
        subtitle.innerText = "Вопрос №" + num;
        questionText.innerText = this.text;
        clearAnswersBlock();

        this.options.forEach(function (op, i) {
            createHtmlOption("checkbox", op, op);
        })

    }
    CheckboxsQuestion.prototype.handleNext = function () {
     
        var elems = answers.getElementsByTagName('input');
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].checked == true)
                this.userAnswers.push(elems[i].value);
        }

        Question.prototype.handleNext.apply(this);

    }

    function createHtmlOption(type, name, value) {

        var newInput = document.createElement('input');
        newInput.type = type;
        newInput.name = name;
        newInput.value = value;
        newInput.innerHTML = value + '<br/>';

        var newLable = document.createElement('label');
        newLable.innerText = value;
       
        answers.appendChild(newInput);
        answers.appendChild(newLable);
        answers.appendChild(document.createElement('br'));
    }

    function clearAnswersBlock() {
        while (answers.firstChild) {
            answers.removeChild(answers.firstChild);
        }
    }

    function nextQuestion() {

        question.handleNext();
    }

    function startTest() {

        test = new TestController();
        test.init();
    }

}