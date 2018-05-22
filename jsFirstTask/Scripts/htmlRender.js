export function prepareHtml(num, text) {
    document.getElementById("result-block").style.display = "none";
    document.getElementById("test-question-block").style.display = "block";
    document.getElementById("test-btn").textContent = "Продолжить";
    document.getElementById('subtitle').innerText = "Вопрос №" + num;
    document.getElementById('question').innerText = text;

    clearAnswersBlock();
}

export function clearAnswersBlock() {
    const answers = document.getElementById('answers');
    while (answers.firstChild) {
        answers.removeChild(answers.firstChild);
    }
}

export function createHtmlOption(type, name, value) {

    const answers = document.getElementById('answers');

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