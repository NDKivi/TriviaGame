//=============================================================================
// Global variables
//=============================================================================
let numberRight;
let numberWrong;
let numberNoResponse;
let currentQuestionIndex;
let gameState;
let questionTimeout;
let questionInterval;
let intervalCounter;

const questionTime = 18000;
const intervalLength = 50;
const answerTime = 3000;
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
            clearInterval(questionInterval);
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
    let progressBar = $(`<progress id='time-left' value='${questionTime}' max='${questionTime}'></progress>"`);
    $("main").append(progressBar);
    $("main").append(questions[currentQuestionIndex].getHTML());
    intervalCounter = 0;
    questionInterval = setInterval(function() {
        intervalCounter++;
        let progressBarValue = questionTime - intervalCounter * intervalLength;
        $("#time-left").attr("value",progressBarValue);
    }, intervalLength);
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
}

/* Data for questions */
function loadQuestions() {
    questions.push(new Question("What is the capital city of France?", 3, "Versailles", "Marseille", "Bordeaux", "Paris"));
    questions.push(new Question("What is the name of the French national anthem?", 2, "La Vie en Rose", "The Star Spangled Banner", "The Marsaillaise", "God Save the Queen"));
    questions.push(new Question("Who is the current president of France?", 1, "François Hollande", "Emmanuel Macron", "Nicholas Sarkozy", "Angela Merkel", "Jacques Cousteau", "Donald Trump"));
    questions.push(new Question("Which color is NOT present in France's flag?", 2, "Red", "White", "Green", "Blue"));
    questions.push(new Question("The current French republic was established in 1958.  In the sequence of republics in the history of France, which is the current one?", 3, "Second", "Third", "Fourth", "Fifth", "Tenth"));
    questions.push(new Question("Which currency is in circulation in France?", 0, "The Euro", "The Yen", "The Rupee", "The Franc", "The Dollar", "The Frenchie"));
    questions.push(new Question("Which is NOT a current major political party in France?", 4, "The Republican Party (le parti républicain)", "The Socialist Party (le parti socialiste)", "The National Front (le front national)", "The Republic on the Move (la république en marche)", "The Democratic Party (le parti démocrate)"));
    questions.push(new Question("France has a nickname that is a geometric shape.  What is it?  Hint: Look at a map.", 0, "Hexagon", "Triangle", "Square"));
    questions.push(new Question("Which philospher is NOT French?", 0, "Georg Wilhelm Friedrich Hegel", "René Descartes", "Jean Paul Sartre", "Jean Jacques Rousseau"));
    questions.push(new Question("True/Fale: UNESCO put French cuisine on its 'world intangible heritage' list of cultural practices to protect.", 0, "True", "False"));
}

/* Function is run when user fails to respond to question in time */
function questionTimeExpired() {
    gameState = gameStateEnum.answer;
    clearTimeout(questionTimeout);
    clearInterval(questionInterval);
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
    $("main").append($(`<p>Welcome!  Press the button below to start a ${questions.length} question quiz on France.  You will have ${(questionTime / 1000).toFixed()} seconds to answer each question.</p>`));

    // button with id of start-button
    $("main").append($("<button id='start-button'>Start Game</button>"));
}

function displayAnswer(isRight, selectedElement) {
    let correctAnswerIndexID = "#" + questions[currentQuestionIndex].correctAnswerIndex;
    console.log(correctAnswerIndexID);
    $(".answer-item").css("cursor","text");
    $(".answer-item").hover(function () { 
        $(this).css("background","none")
    });
    $(selectedElement).css("border", "1px #0055A4 solid");
    if (typeof isRight === "undefined") {
        $(correctAnswerIndexID).css("color", "#EF4135");
        $("main").append($("<h5 class='red'>You failed to answer in time.  The correct answer is in red.</h5>"));
    } else if (isRight) {
        $(correctAnswerIndexID).css("font-weight", "bolder");
        $("main").append($("<h5>Correct!</h5>"));        
    } else {
        $(correctAnswerIndexID).css("color", "#EF4135");
        $("main").append($("<h5 class='red'>Incorrect!  The correct answer is in red.</h5>"));
    }
}

function displayGameover() {
    $("main").empty();
    $("main").append($("<h5>Game over.  Here are your results.</h5>"));
    if (numberRight > (questions.length * 0.8)) {
        $("main").append($("<h5>Vous connaissez bien la France !</h5>"));
    }
    let newTable = $(`<table>
                        <tr><th>Correct</th><td>${numberRight}</td></tr>
                        <tr><th>Wrong</th><td>${numberWrong}</td></tr>
                        <tr><th>Out of Time</th><td>${numberNoResponse}</td></tr>
                    </table>`);
    $("main").append(newTable);
    $("main").append($("<button id='restart-button'>Play Again</button>"));
}