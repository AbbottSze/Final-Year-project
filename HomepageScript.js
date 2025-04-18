let LFSRPopUp = document.getElementById("LFSRPopUp")
let CBCPopUp = document.getElementById("CBCPopUp")
let close = document.getElementById("close")

function openLFSRPopUp (){
    LFSRPopUp.classList.add("open-LFSRPopUp");
}

function openCBCPopUp (){
    console.log('hi')
    CBCPopUp.classList.add("open-CBCPopUp");
}

function closePopUp(type) {
    if (type === 'LFSR') {
        LFSRPopUp.classList.remove("open-LFSRPopUp");
    } else if (type === 'CBC') {
        CBCPopUp.classList.remove("open-CBCPopUp");
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

    // Navigate to Topics Page
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

    // Logout function (Animate the button itself before redirecting)
    document.getElementById("logout").addEventListener("click", function(event) {
        anime({
            targets: event.target, // Animates the logout button
            opacity: 0,
            scale: [1, 0.8], // Shrinks before redirect
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                window.location.href = "index.html"; // Redirect after animation
            }
        });
    });
});
