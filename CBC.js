var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
const animateButton = document.getElementById("animateButton");
const inputButton = document.getElementById("inputButton");
const plaintextInput = document.getElementById("plaintextInput");
const ivInput = document.getElementById("ivInput");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

c.strokeStyle = 'black';

// CBC encryption variables + initial values
let blockSize = 50;
let iv = "10100";
let CBCValues = [1,0,0,1,0]
let ciphertexts = [];
let processingIndex = 0;
let processing = false;

// Function to get user input
function updateInput() {
    let inputText = plaintextInput.value;
    iv = ivInput.value;
    CBCValues = inputText.split(' ');
    drawCBCStructure();
}

// Draw CBC structure with connecting lines
function drawCBCStructure() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    c.font = "20px Arial";
    c.fillStyle = "black";
    drawBlock(100, 150, iv, "IV");

    for (let i = 0; i < blocks.length; i++) {
        drawBlock(50, 50 + i * 100, blocks[i], `P${i+1}`);
        drawArrow(150, 175 + i * 100, 250, 175 + i * 100);
    }
}

function drawBlock(x, y, value, label) {
    c.strokeRect(x, y, blockSize * 2, blockSize);
    c.fillStyle = "black";
    c.fillText(value, x + blockSize, y + blockSize / 2);
    c.fillText(label, x - 30, y + blockSize / 2);
}

function drawArrow(x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.beginPath();
    c.moveTo(x2 - 5, y2 - 5);
    c.lineTo(x2, y2);
    c.lineTo(x2 - 5, y2 + 5);
    c.stroke();
}

function xorBinary(a, b) {
    return a.split('').map((bit, i) => (bit ^ b[i]).toString()).join('');
}

function processBlock() {
    if (processingIndex >= blocks.length) {
        processing = false;
        animateButton.disabled = false;
        return;
    }

    let previousCipher = processingIndex === 0 ? iv : ciphertexts[processingIndex - 1];
    let xorResult = xorBinary(previousCipher, blocks[processingIndex]);
    let encryptedBlock = xorResult.split('').reverse().join(''); // Simulated encryption
    ciphertexts.push(encryptedBlock);
    
    drawBlock(250, 150 + processingIndex * 100, xorResult, "XOR");
    drawBlock(450, 150 + processingIndex * 100, encryptedBlock, `C${processingIndex+1}`);
    drawArrow(350, 175 + processingIndex * 100, 450, 175 + processingIndex * 100);
    
    processingIndex++;
    setTimeout(processBlock, 1000);
}

function startCBCAnimation() {
    if (!processing) {
        processingIndex = 0;
        ciphertexts = [];
        drawCBCStructure();
        processing = true;
        animateButton.disabled = true;
        processBlock();
    }
}

drawCBCStructure();
document.getElementById("UpdateButton").addEventListener("click", updateInput);
document.getElementById("animateButton").addEventListener("click", startCBCAnimation);


// Button to homepage
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
