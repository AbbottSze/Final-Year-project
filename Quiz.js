const questions = [
    {
        question: "What does LFSR stand for?",
        options: ["Linear Feedback Shift Register", "Logical Frame Shift Register", "Linear Function Shift Register", "Long Feedback Sequential Register"],
        answer: 0
    },
    {
        question: "What is the main purpose of an LFSR in cryptography?",
        options: ["Sorting data", "Generating pseudorandom sequences", "Encrypting data directly", "Compressing data"],
        answer: 2
    },
    {
        question: "In an LFSR, what determines the new input bit?",
        options: ["The sum of all bits in the register", "A fixed bit pattern", "A function of selected bits using XOR", "A random number generator"],
        answer: 2
    },
    {
        question: "If two messages start with the same plaintext block and the same IV is reused, what is the result?",
        options: ["The first ciphertext block will be different", "The first ciphertext block will be the same", "The entire ciphertexts will always match", "The encryption will fail"],
        answer: 1
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

function loadQuestion() {
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
    questionEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = '';
    resultEl.textContent = `Your score: ${score} out of ${questions.length}`;
    nextBtn.style.display = 'none';
    homeBtn.style.display = 'inline-block'
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
