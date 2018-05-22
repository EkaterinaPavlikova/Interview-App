window.onload = function () {

    var resultBlock = document.getElementById("result-block");
    var testQuestionBlock = document.getElementById("test-question-block");
    var testBtn = document.getElementById("test-btn");
    var subtitle = document.getElementById('subtitle');
    var questionText = document.getElementById('question');
    var answers = document.getElementById('answers');
    var test, question, protoQuestion;

    testBtn.onclick = startTest;

    function TestController() {
        var questionCount,
            questionIndex = 0;
        var serviceUrl = 'api/TestService/';

        var self = this;
        this.questionList = [];


        var addQuestionToList = function (question) {
            self.questionList.push(question);
           
        }

        var createNextQuestionObject = function () {

            if (questionIndex < questionCount) {
                loadQuestion();
            }
            else {
                showResult();
            }

        }

        var loadQuestion = function () {
          
            self.ajaxToService('GetNext', 'post', questionIndex, function (data) {
                try {
                    data = JSON.parse(data);

                    questionIndex++;
                    questionFactory(data);
                }
                catch (err) {

                    console.log("");
                    return;
                }
            });


        }

        var questionFactory = function (data) {

            var separator = "#;";
           
            var answers = [];
            var options = [];

            data.answers.split(separator).forEach(function (a) { answers.push(decodeURIComponent(escape(window.atob(a)))) });
            data.options.split(separator).forEach(function (a) { options.push(decodeURIComponent(escape(window.atob(a)))) });

            var text = decodeURIComponent(escape(window.atob(data.text)));          

            question = new Question(text, answers, options, addQuestionToList, createNextQuestionObject);

            if (answers.length > 1)
                protoQuestion = new CheckboxsQuestion();
            else
                protoQuestion = new RadioQuestion();

            protoQuestion.__proto__ = question;
            protoQuestion.init(questionIndex);

        }

        var showResult = function () {

            testQuestionBlock.style.display = "none";
            resultBlock.style.display = "block";

            var score = 0;
            self.questionList.forEach(function (q, i) {
                score += q.getScore();
            });


            document.getElementById("score").innerText = score;
            testBtn.textContent = "Пройти еще раз";
            testBtn.onclick = startTest;

        }

        this.ajaxToService = function (funcName, method, body, callback) {

            var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
            var xhr = new XHR();
            xhr.open(method, serviceUrl + funcName);


            if (body != null) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }

            xhr.onreadystatechange = function () {

                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                    return;

                } else {

                    callback(xhr.responseText);
                }


            }



        }

        this.init = function () {

            resultBlock.style.display = "none";
            testQuestionBlock.style.display = "block";
            testBtn.textContent = "Продолжить";
            testBtn.onclick = nextQuestion;          

            self.ajaxToService('TestInit', 'get', null, function (data) {
                try {

                    data = JSON.parse(data);
                    questionCount = data;
                    createNextQuestionObject();
                }
                catch (err) {

                    console.log("");
                    return;
                }
            }
            );

        }

    }
    function Question(text, answers, options, addQuestionToList, createNextQuestionObject) {
        var score = 0;
        var answers = answers;
        var self = this;


        this.options = options;
        this.text = text;

        this.getScore = function () {
            return score;
        }

        this.handleNext = function (userAnswers) {


            userAnswers.forEach(function (answer, i) {
                if (answers.indexOf(answer) != -1)
                    score++;
            })

            addQuestionToList(self);
            createNextQuestionObject();        

        }

    }


    function RadioQuestion() {


        var self = this;


        this.handleNext = function () {
            var elems = answers.getElementsByTagName('input');
            var i = 0;
            var userAnswers = [];

            while (i < elems.length && userAnswers.length == 0) {

                if (elems[i].checked == true)
                    userAnswers.push(elems[i].value);
                i++;
            }

            self.__proto__.handleNext(userAnswers);

        }


        this.init = function (num) {
            subtitle.innerText = "Вопрос №" + num;
            questionText.innerText = self.__proto__.text;          
            clearAnswersBlock();

            self.__proto__.options.forEach(function (op, i) {
                createHtmlOption("radio", "option", op);
            });
        }



    }


    function CheckboxsQuestion() {


        var self = this;


        this.handleNext = function () {

            var elems = answers.getElementsByTagName('input');
            var userAnswers = [];

            for (var i = 0; i < elems.length; i++) {
                if (elems[i].checked == true)
                    userAnswers.push(elems[i].value);
            }

            self.__proto__.handleNext(userAnswers);
        }

        this.init = function (num) {
            subtitle.innerText = "Вопрос №" + num;
            questionText.innerText = self.__proto__.text;           
            clearAnswersBlock();

            self.__proto__.options.forEach(function (op, i) {
                createHtmlOption("checkbox", op, op);
            })

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

    function clearAnswersBlock() {
        while (answers.firstChild) {
            answers.removeChild(answers.firstChild);
        }
    }

    function nextQuestion() {

        protoQuestion.handleNext();
    }

    function startTest() {

        test = new TestController();
        test.init();
    }

}