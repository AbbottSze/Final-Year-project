document.addEventListener("DOMContentLoaded", function() {
    const loginBox = document.getElementById("loginBox");
    const signupBox = document.getElementById("signupBox");
    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");

    // Page Load Animation
    anime({
        targets: ".container",
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: 1000,
        easing: "easeOutExpo"
    });

    // Switch to Signup Form Animation
    showSignup.addEventListener("click", function(event) {
        event.preventDefault();
        anime({
            targets: loginBox,
            opacity: 0,
            scale: 0.9,
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                loginBox.classList.add("hidden");
                signupBox.classList.remove("hidden");
                anime({
                    targets: signupBox,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    duration: 500,
                    easing: "easeInOutQuad"
                });
            }
        });
    });

    // Switch to Login Form Animation
    showLogin.addEventListener("click", function(event) {
        event.preventDefault();
        anime({
            targets: signupBox,
            opacity: 0,
            scale: 0.9,
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                signupBox.classList.add("hidden");
                loginBox.classList.remove("hidden");
                anime({
                    targets: loginBox,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    duration: 500,
                    easing: "easeInOutQuad"
                });
            }
        });
    });

    // Button Click Animation
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

    // Input Focus Animation
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("focus", function() {
            anime({
                targets: input,
                scale: [1, 1.05],
                duration: 200,
                easing: "easeOutQuad"
            });
        });

        input.addEventListener("blur", function() {
            anime({
                targets: input,
                scale: [1.05, 1],
                duration: 200,
                easing: "easeOutQuad"
            });
        });
    });

    // Login Form Submission Animation
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        anime({
            targets: "#loginForm",
            translateX: [-10, 10, -5, 5, 0],
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                alert("Login Successful!");
                window.location.href = "homepage.html";
            }
        });
    });

    // Signup Form Submission Animation
    document.getElementById("signupForm").addEventListener("submit", function(event) {
        event.preventDefault();
        anime({
            targets: "#signupForm",
            translateX: [-10, 10, -5, 5, 0],
            duration: 500,
            easing: "easeInOutQuad",
            complete: function() {
                alert("Signup Successful! Please log in.");
                signupBox.classList.add("hidden");
                loginBox.classList.remove("hidden");
                anime({
                    targets: loginBox,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    duration: 500,
                    easing: "easeInOutQuad"
                });
            }
        });
    });
});

//login
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Get user input
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Example authentication check (replace with real validation)
        if (username === "admin" && password === "password123") {
            anime({
                targets: "#loginForm",
                opacity: [1, 0],
                scale: [1, 0.8],
                duration: 800,
                easing: "easeInOutQuad",
                complete: function () {
                    window.location.href = "homepage.html";
                }
            });
        } else {
            // Shake animation for incorrect login
            anime({
                targets: "#loginForm",
                translateX: [-10, 10, -5, 5, 0],
                duration: 500,
                easing: "easeInOutQuad"
            });
            alert("Invalid username or password!");
        }
    });
});

