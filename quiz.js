let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = 0;
let questionHistory = [];

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const scoreElement = document.getElementById('score');
const progressElement = document.getElementById('progress');
const historyElement = document.getElementById('question-history');

function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            startQuiz();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            questionElement.innerText = 'Error al cargar las preguntas. Por favor, intenta de nuevo.';
        });
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    questionHistory = [];
    nextButton.classList.add('hide');
    restartButton.classList.add('hide');
    historyElement.classList.add('hide');
    shuffleArray(questions);
    setNextQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setNextQuestion() {
    resetState();
    if (answeredQuestions < 10 && currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        progressElement.innerText = `Pregunta ${answeredQuestions + 1} de 10`;
    } else {
        endQuiz();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
        button.disabled = true;
    });
    if (correct) {
        score += 100;
    }
    scoreElement.innerText = `Puntaje: ${score}`;
    answeredQuestions++;

    questionHistory.push({
        question: questions[currentQuestionIndex].question,
        userAnswer: selectedButton.innerText,
        correctAnswer: questions[currentQuestionIndex].answers.find(a => a.correct).text,
        isCorrect: correct
    });

    if (answeredQuestions < 10) {
        nextButton.classList.remove('hide');
    } else {
        endQuiz();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function endQuiz() {
    questionElement.innerText = `Quiz terminado. Tu puntaje final es: ${score}`;
    answerButtonsElement.innerHTML = '';
    nextButton.classList.add('hide');
    restartButton.classList.remove('hide');
    showQuestionHistory();
}

function showQuestionHistory() {
    historyElement.innerHTML = '<h2>Historial de Preguntas</h2>';
    questionHistory.forEach((item, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('history-item');
        questionDiv.innerHTML = `
            <p><strong>Pregunta ${index + 1}:</strong> ${item.question}</p>
            <p>Tu respuesta: ${item.userAnswer}</p>
            <p>Respuesta correcta: ${item.correctAnswer}</p>
            <p>${item.isCorrect ? '✅ Correcto' : '❌ Incorrecto'}</p>
        `;
        historyElement.appendChild(questionDiv);
    });
    historyElement.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

restartButton.addEventListener('click', startQuiz);

loadQuestions();
