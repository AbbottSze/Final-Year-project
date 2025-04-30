const questions = [
    {
        question: "What does LFSR stand for?",
        options: ["Linear Feedback Shift Register", "Logical Frame Shift Register", "Linear Function Shift Register", "Long Feedback Sequential Register"],
        answer: 0
    },
    {
        question: "What is the main purpose of an LFSR in cryptography?",
        options: ["Sorting data", "Generating pseudorandom sequences", "In combination with other encryption methods to encrypt data", "Compressing data"],
        answer: 2
    },
    {
        question: "In an LFSR, what determines the new input bit?",
        options: ["The sum of all bits in the register", "A function of selected bits using XOR", "A fixed bit pattern", "A random number generator"],
        answer: 1
    },
    {
        question: "If two messages start with the same plaintext block and the same IV is reused, what is the result?",
        options: ["The first ciphertext block will be different", "The first ciphertext block will be the same", "The entire ciphertexts will always match", "The encryption will fail"],
        answer: 2
    },
    {
        question: "In CBC mode, the first ciphertext block is the encryption of __________.",
        options: ["the plaintext block directly", "the key and IV combined", "the IV", "the plaintext block XORed with the IV"],
        answer: 3
    },
];

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const resultEl = document.getElementById('result');
const homeBtn = document.getElementById('homeBtn');
const leaderboard = document.getElementById('leaderboard');
const first = document.getElementById('first');
const second = document.getElementById('second');
const third = document.getElementById('third');

function loadQuestion() {
    hint.disabled = false;
    hasAnswered = false;
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    resultEl.textContent = '';

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => {
            if (!hasAnswered) {
            checkAnswer(index);
            }
        };
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selected) {
    hasAnswered = true;
    const correct = questions[currentQuestion].answer;
    const buttons = optionsEl.querySelectorAll('button');

    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correct) {
            btn.style.backgroundColor = '#80EF80';
        } else if (index === selected) {
            btn.style.backgroundColor = '#f94449';
        }
    });

    if (selected === correct) {
        score++;
        resultEl.textContent = "✅ Correct!";
      } else {
        resultEl.textContent = `❌ Wrong! Correct answer: ${questions[currentQuestion].options[correct]}`;
      }
      nextBtn.style.display = 'inline-block';
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        container.innerHTML = ""
        textLines = [{speed, string: "Need a hint? Click me!" }]
        init();
        revealOneCharacter(characters);
        hint.disabled = false;
        loadQuestion();
        nextBtn.style.display = 'none';
    } else {
        showFinalResult();
    }
}

homeBtn.onclick = () => {
    anime({
        targets: "body",
        opacity: 0,
        translateX: [50, -50],
        duration: 500,
        easing: "easeInOutQuad",
        complete: function() {
            window.location.href = "homepage.html"; 
        }
    });
}

function showFinalResult() {
    container.innerHTML = ""
    textLines = [{speed, string: "Well Done!" }]
    init();
    revealOneCharacter(characters);
    questionEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = '';
    resultEl.textContent = `Your score: ${score} out of ${questions.length}`;
    nextBtn.style.display = 'none';
    homeBtn.style.display = 'inline-block';
    leaderboard.textContent = 'Leaderboard:';
    leaderboard.style.display = 'inline-block';
    if (score == 5){
        first.textContent = '🥇User 5/5';
        second.textContent = '🥈Sara 3/5';
        third.textContent = '🥉Lenord 2/5';
    } else if (3 < score < 5){
        first.textContent = '🥇Steve 5/5';
        second.textContent = `🥈User ${score}/5`;
        third.textContent = '🥉Lenord 2/5';
    } else if (score < 3){
        first.textContent = '🥇Steve 5/5';
        second.textContent = '🥈Sara 3/5';
        third.textContent = `🥉User ${score}/5`;
    }
    first.style.display = 'inline-block';
    second.style.display = 'inline-block';
    third.style.display = 'inline-block';
}

loadQuestion();

document.getElementById("back").addEventListener("click", function() {
    anime({
        targets: "body",
        opacity: 0,
        translateX: [50, -50],
        duration: 500,
        easing: "easeInOutQuad",
        complete: function() {
            window.location.href = "homepage.html"; 
        }
    });
});

var container = document.querySelector(".text");

var speed = 40

var textLines = [{speed, string: "Need a hint? Click me!" }];


var characters = [];
function init() {
    textLines.forEach((line, index) => {
        if (index < textLines.length - 1) {
           line.string += " ";
        }
     
        line.string.split("").forEach((character) => {
           var span = document.createElement("span");
           span.textContent = character;
           container.appendChild(span);
           characters.push({
              span: span,
              isSpace: character === " " && !line.pause,
              delayAfter: line.speed,
              classes: line.classes || []
           });
        });
     });
}

function revealOneCharacter(list) {
    var next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");
    next.classes.forEach((c) => {
    next.span.classList.add(c);
   });
    var delay = next.isSpace && !next.pause ? 0 : next.delayAfter;

    if (list.length > 0) {
        setTimeout(function () {
            revealOneCharacter(list);
        }, delay);
    }
}



//Kick it off
setTimeout(() => {
    init();
    revealOneCharacter(characters);   
}, 600)

var question_hints = [[{speed, string: "LSFR is a shift register where the input bit is a linear function of its previous state. LFSRs are often used in cryptography, digital signal processing, and generating pseudo-random numbers."}],
            [{speed, string:"Think of a LFSR as a tool that helps create a sequence of unpredictable bits, which can be mixed with the data to disguise it."}],
            [{speed, string:"In an LFSR, the new input bit is influenced by a combination of certain bits from the register, with the outcome shaped by a specific rule called the feedback function."}],
            [{speed, string:"When the same initial value is used for different messages, it can lead to a situation where identical plaintext blocks produce the same ciphertext, potentially revealing information about the messages."}],
            [{speed, string:"In CBC mode, the first ciphertext block is created by encrypting the XOR of the first plaintext block and a special value that starts the process. This value changes the way the first block is encrypted."}],]

document.getElementById("hint").addEventListener("click", function (){
    container.innerHTML = ""
    textLines = question_hints[currentQuestion]
    init();
    revealOneCharacter(characters);
    hint.disabled = true
});