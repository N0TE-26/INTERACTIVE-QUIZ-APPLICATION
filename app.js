const userName = document.getElementById("userName"),
    startScreen = document.querySelector(".startScreen"),
    playground = document.querySelector(".playground"),
    endScreen = document.querySelector(".endScreen"),
    questionCount = document.getElementById("questionCount"),
    questionTimer = document.getElementById("questionTimer"),
    question = document.getElementById("question"),
    quizOptions = document.getElementById("quizOptions"),
    quizBody = document.querySelector(".quizBody"),
    loader = document.querySelector(".loader"),
    finialScore = document.querySelector(".finalScore"),
    resultUserName = document.getElementById("resultUserName");

    let arrayQuestion =[],
    questionIndex = 0,
    score = 0;
    count =10,
    countdown;


    function startQuiz() {
    if (userName.value != ""){
        questionIndex = score = 0;
        startScreen.style.display = "none";
        endScreen.style.display = "none";
        nextButton.innerHTML="Next";
        quizBody.style.display = "none";
        playground.style.display = "block";
        loader.style.display = "block";
        loadQuestions();
    } else {
        userName.style.border = "2px solid red";
    }
}
function loadQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&category=18",  {
    mode: "cors",
})
    .then((response) =>response.json())
    .then((data) => {
        arrayQuestion = data.results;
        displayQuestion(arrayQuestion[questionIndex]);
    });
}

function displayQuestion(questionData) {
    console.log(questionData);
    question.innerHTML = questionData.question;
    questionCount.innerHTML = questionIndex + 1;
    loadAnswer(questionData);
}

function loadAnswer(questionData) {
    quizOptions.innerHTML = "";
    let answers=[...questionData.incorrect_answers, questionData.correct_answer];
    answers.sort(() => Math.random() - 0.5);
    answers.forEach((answer) => {
        let options= document.createElement("li");
        options.innerHTML = answer;
        options.addEventListener("click", () => {
            checkAnswer(options, answers, questionData.correct_answer) 
        }); 
        quizOptions.append(options);
    })
    quizBody.style.display = "block"; 
    loader.style.display = "none";
    displayTimer();
}

function checkAnswer(answerOptions,answers, correctAnswer) {
    console.log(answerOptions,answers, correctAnswer);
    
    let correctElement;
    answers.forEach((answer) => {
        if (htmlDecode(answer) === htmlDecode(correctAnswer)) {
            correctElement=[...quizOptions.childNodes].find((li) => li.innerText===htmlDecode(correctAnswer)
        );
        }
    });
    
    quizOptions.childNodes.forEach((li) => {
        li.classList.add("disabled");
});
    if(htmlDecode(correctAnswer)===answerOptions.innerText){
        answerOptions.classList.add("correct");
        score++;
    }else{
        answerOptions.classList.add("incorrect");
        correctElement.classList.add("correct");
    }

    console.log(correctElement);
}   

function nextQuestion() {
    if (questionIndex < arrayQuestion.length - 1) {
    questionIndex++;
    displayQuestion(arrayQuestion[questionIndex]);
    if(questionIndex ==4){
        nextButton.innerText="Finish";}
    } else {
        showAnswers();
    }
    
}
nextButton.addEventListener("click", nextQuestion);
    

function showAnswers() {
    playground.style.display = "none";
    endScreen.style.display = "block";
    finialScore.innerHTML = score;
    resultUserName.innerHTML = userName.value;
    questionCount.innerHTML = 1;
    clearInterval(countdown);
    count = 10;
}

const displayTimer=()=>{
    countdown = setInterval(() => {
        questionTimer.innerHTML = count;
        count--;
        if (count < 0) {
            clearInterval(countdown);
            showAnswers();
        }
    }, 1000);
}

function htmlDecode(html) {
    var txt=document.createElement("textarea");
    txt.innerHTML=html;
    return txt.value;
}