const _answers = new WeakMap();
const _scores = new WeakMap();


export class Question {

    constructor(answers, options, text) {

        _answers.set(this, answers);
        this.options = options;
        this.text = text;

    }

    getScore() {
        return _scores.get(this);
    }

    handleNext(userAnswers, resolve) {

        let score = 0;
        const answers = _answers.get(this);
        userAnswers.forEach(function(answer) {
            if (answers.indexOf(answer) != -1)
                score++;
        })

        _scores.set(this, score);
        resolve(this);

    }
}