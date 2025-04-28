let LFSRPopUp = document.getElementById("LFSRPopUp")
let CBCPopUp = document.getElementById("CBCPopUp")
let QuizPopUp = document.getElementById("QuizPopUp")
let close = document.getElementById("close")

let LFSRButton = document.getElementById("LFSR");
let CBCButton = document.getElementById("CBC");
let QuizButton = document.getElementById("Quiz");

function openLFSRPopUp (){
    CBCButton.classList.add("disabled");
    QuizButton.classList.add("disabled");
    LFSRPopUp.classList.add("open-LFSRPopUp");
}

function openCBCPopUp (){
    LFSRButton.classList.add("disabled");
    QuizButton.classList.add("disabled");
    CBCPopUp.classList.add("open-CBCPopUp");
}

function openQuizPopUp (){
    CBCButton.classList.add("disabled");
    LFSRButton.classList.add("disabled");
    QuizPopUp.classList.add("open-QuizPopUp");
}

function closePopUp(type) {
    if (type === 'LFSR') {
        CBCButton.classList.remove("disabled");
        QuizButton.classList.remove("disabled");
        LFSRPopUp.classList.remove("open-LFSRPopUp");
    } else if (type === 'CBC') {
        LFSRButton.classList.remove("disabled");
        QuizButton.classList.remove("disabled");
        CBCPopUp.classList.remove("open-CBCPopUp");
    } else if (type === 'Quiz'){
        CBCButton.classList.remove("disabled");
        LFSRButton.classList.remove("disabled");
        QuizPopUp.classList.remove("open-QuizPopUp");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Fade-in animation for the home page
    anime({
        targets: "body",
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: 1000,
        easing: "easeOutExpo"
    });

    // Button click animations
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", function(event) {
            anime({
                targets: event.target,
                scale: [1, 0.95, 1],
                duration: 300,
                easing: "easeInOutQuad"
            });
        });
    });

    // Navigate to HomePage
    document.getElementById("GoToLFSR").addEventListener("click", function() {
        anime({
            targets: "body",
            opacity: 0,
            translateX: [-50, 50],
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                window.location.href = "LFSR.html"; 
            }
        });
    });

    document.getElementById("GoToCBC").addEventListener("click", function() {
        anime({
            targets: "body",
            opacity: 0,
            translateX: [-50, 50],
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                window.location.href = "CBC.html"; 
            }
        });
    });

    document.getElementById("GoToQuiz").addEventListener("click", function() {
        anime({
            targets: "body",
            opacity: 0,
            translateX: [-50, 50],
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                window.location.href = "quiz.html"; 
            }
        });
    });

    // Logout
    document.getElementById("logout").addEventListener("click", function(event) {
        anime({
            targets: event.target,
            opacity: 0,
            scale: [1, 0.8],
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                window.location.href = "index.html";
            }
        });
    });
});

var container = document.querySelector(".text");

var speed = 40;

var textLines = [
   { speed, string: "Welcome to the Cyber security Sandbox! My name is Robert the Robot." },
   { speed, string: "This is an interactive world where you can explore, learn, and experiment with real cyber security concepts." },
   { speed, string: "So what would you like to learn today?" }
];

var characters = [];
textLines.forEach((line, index) => {
   if (index < textLines.length - 1) {
      line.string += " "; //Add a space between lines
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
   revealOneCharacter(characters);   
}, 600)
