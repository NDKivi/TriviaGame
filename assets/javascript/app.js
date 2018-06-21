//=============================================================================
// Global variables
//=============================================================================
let numberRight;
let numberWrong;
let numberNoResponse;
let currentQuestionIndex;
let gameState;
let questionTimeout;


const questionTime = 10000;
const answerTime = 4000;
const gameStateEnum = {
    start: 0,
    question: 1,
    answer: 2,
    end: 3
};
const questions = [];

//=============================================================================
// Input
//=============================================================================
$(document).ready(function () {
    // Start game
    startGame();


    $("body").on("click", "#start-button", function () {
        gameState = gameStateEnum.question;
        nextQuestion();
    });

    $("body").on("click", "#restart-button", function () {
        numberRight = 0;
        numberWrong = 0;
        numberNoResponse = 0;
        currentQuestionIndex = 0;
        gameState = gameStateEnum.question;
        nextQuestion();
    });

    $("body").on("click", ".answer-item", function () {
        if (gameState === gameStateEnum.question) {
            clearTimeout(questionTimeout);
            gameState = gameStateEnum.answer;
            let selectedIndex = parseInt($(this).attr("id"));
            if (questions[currentQuestionIndex].isCorrectAnswer(selectedIndex)) {
                numberRight++;
                displayAnswer(true, $(this));
            } else {
                numberWrong++;
                displayAnswer(false, $(this));
            }
            setTimeout(answerTimeExpired, answerTime);
        }
    });
});

//=============================================================================
// Main logic
//=============================================================================
function startGame() {
    numberRight = 0;
    numberWrong = 0;
    numberNoResponse = 0;
    currentQuestionIndex = 0;
    gameState = gameStateEnum.start;
    loadQuestions();
    displayStart();
}

function nextQuestion() {
    $("main").empty();
    $("main").append(questions[currentQuestionIndex].getHTML());
    questionTimeout = setTimeout(questionTimeExpired, questionTime);
}
// Constructor for questions
function Question(prompt, correctAnswerIndex, ...answers) {

    //type checking on all parameters
    if (typeof prompt !== "string")
        throw "Question constructor: prompt must be a string";
    if (typeof correctAnswerIndex !== "number")
        throw "Question constructor: correctAnswerIndex must be a number";
    if (answers.length < 2)
        throw "Question constructor: need at least two potential answers";
    if (correctAnswerIndex < 0 || correctAnswerIndex >= answers.length)
        throw "Question constructor: correctAnswerIndex must be within bounds of the answers array";
    for (let answer of answers) {
        if (typeof answer !== "string") {
            throw "Question constructor: All answers must be strings";
        }
    }

    //set properties
    this.prompt = prompt;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswerIndex;

    //methods
    this.getCorrectAnswer = function () {
        return answers[correctAnswerIndex];
    }
    this.isCorrectAnswer = function (index) {
        return (index === correctAnswerIndex);
    }
    this.getHTML = function () {
        let newDiv = $("<div id='question-container'></div>");
        $(newDiv).append($("<h3 id='prompt'>" + this.prompt + "</h3>"));
        let list = $("<ol id='answer-list'></ol>");

        for (let index in this.answers) {
            $(list).append("<li id=" + index + " class='answer-item'>" + this.answers[index] + "</li>");
        }

        $(newDiv).append($(list));
        return newDiv;
    }
    // this.getAnswerHTML = function(guess) {
    //     let newDiv = this.getHTML();
    //     let correctAnswerIndexID = "#" + this.correctAnswerIndex;
    //     $(correctAnswerIndexID).css("color","red");
    //     $()
    //     //80ced6
    //     if (guess === this.correctAnswerIndex) {

    //     } else if (typeof guess === "number") {

    //     }
    // }
}

/* Data for questions */
function loadQuestions() {
    questions.push(new Question("Who was the first prez of the USA?", 0, "G Wash", "Mill Fil", "T Jeff", "Roosevelt"));
    questions.push(new Question("To be or not to be?", 1, "Not to be", "To be"));
    questions.push(new Question("First planet from the sun:", 2, "Venus", "Hermes", "Mercury"));
}

/* Function is run when user fails to respond to question in time */
function questionTimeExpired() {
    gameState = gameStateEnum.answer;
    clearTimeout(questionTimeout);
    numberNoResponse++;
    displayAnswer();
    setTimeout(answerTimeExpired, answerTime);
}

/* Function is run when done displaying the answer to a question */
function answerTimeExpired() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        gameState = gameStateEnum.end;
        displayGameover();
    } else {
        gameState = gameStateEnum.question;
        nextQuestion();
    }
}

//=============================================================================
// Display functions
//=============================================================================
function displayStart() {
    // paragraph explaining game
    $("main").append($("<p>You will see questions one by one.  Answer them before time runs out.</p>"));

    // button with id of start-button
    $("main").append($("<button id='start-button'>Start Game</button>"));
}

function displayAnswer(isRight, selectedElement) {
    let correctAnswerIndexID = "#" + questions[currentQuestionIndex].correctAnswerIndex;
    console.log(correctAnswerIndexID);
    $(correctAnswerIndexID).css("color", "red");
    $(selectedElement).css("background-color", "yellow");
    if (typeof isRight === "undefined") {
        $("main").prepend($("<h5>You were too slow...</h5>"));
    } else if (isRight) {
        $("main").prepend($("<h5>You are correct!!!!</h5>"));        
    } else {
        $("main").prepend($("<h5>You are wrong!!!!!</h5>"));
    }
}

function displayGameover() {
    $("main").empty();
    $("main").append($("<h5>Game over.  Here are your results.</h5>"));
    let newTable = $(`<table>
                        <tr><th>Correct</th><td>${numberRight}</td></tr>
                        <tr><th>Wrong</th><td>${numberWrong}</td></tr>
                        <tr><th>Too Slow</th><td>${numberNoResponse}</td></tr>
                    </table>`);
    $("main").append(newTable);
    $("main").append($("<button id='restart-button'>Play Again</button>"));
}