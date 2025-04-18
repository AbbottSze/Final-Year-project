var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
const animateButton = document.getElementById("animateButton");
const updateButton = document.getElementById("updateButton");
const plaintextInput = document.getElementById("CBCInput");
const ivInput = document.getElementById("xorInput");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

c.strokeStyle = 'black';

// CBC encryption variables + initial values
let blockSize = 50;
let iv = [1, 0, 0, 1, 0];
let CBCValues = [1, 0, 0, 0, 0, 1, 0, 1, 1];
let ciphertexts = [];
let processingIndex = null;
let processing = false;
let x = 100;
let lastx = x + (blockSize * 4);

// Function to get user input and apply padding
function updateInput() {
    let inputText = plaintextInput.value;
    iv = ivInput.value.split(",").filter(v => v.trim() !== "").map(Number);
    CBCValues = inputText.split(' ').map(Number);

    // Add padding if needed
    let blockLength = iv.length;
    let remainder = CBCValues.length % blockLength;

    if (remainder !== 0) {
        let paddingNeeded = blockLength - remainder;
        for (let i = 0; i < paddingNeeded; i++) {
            CBCValues.push("pad"); // Placeholder for padding bit
        }
    }
    console.log(CBCValues)
    drawCBCStructure();
    console.log(CBCValues)
}

// Draw CBC structure with connecting lines
function drawCBCStructure() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.font = "20px Helvetica";
    c.fillStyle = "black";

    x = 100;

    // Draw IV
    for (let i = 0; i < iv.length; i++) {
        drawBlock(x, 150, iv[i]);
        x += blockSize;
    }

    let blockLength = iv.length;
    let blocks = Math.ceil(CBCValues.length / blockLength);
    let baseX = 100;

    for (let b = 0; b < blocks; b++) {
        let startX = baseX + b * (blockSize * blockLength + 60);
        let startY1 = 100;
        let startY2 = 250;

        for (let i = 0; i < blockLength; i++) {
            let value = CBCValues[b * blockLength + i];
            drawBlock(startX + i * blockSize, startY1, value);
            drawBlock(startX + i * blockSize, startY2, ''); // placeholder for ciphertext
        }
    }

    // XOR circle and connecting lines
    drawLine(lastx + 50, 175, lastx + 290, 175);
    drawLine(lastx + 275, 150, lastx + 275, 250);
    drawXOR(lastx + 275);
}

function drawBlock(x, y, value) {
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + blockSize, y);
    c.lineTo(x + blockSize, y + blockSize);
    c.lineTo(x, y + blockSize);
    c.closePath();

    if (value === "pad") {
        c.fillStyle = '#ffff99'; // light yellow
        c.fillRect(x, y, blockSize, blockSize);
        c.stroke();
        c.fillStyle = 'black';
        c.fillText("0", x + 15, y + 5 + blockSize / 2); // Displayed as 0
    } else {
        c.stroke();
        c.fillStyle = "black";
        c.fillText(String(value), x + 15, y + 5 + blockSize / 2);
    }
}

function drawLine(x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
}

function drawXOR(x) {
    c.beginPath();
    c.arc(x, 175, 15, 0, 2 * Math.PI);
    c.stroke();
}

// Binary XOR function (used in animation)
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
    drawArrow(350, 175 + processingIndex * 100, 450, 175 + processingIndex * 100);

    processingIndex++;
    setTimeout(processBlock, 1000);
}

function startCBCAnimation() {
    if (!processing) {
        processingIndex = 0;
        ciphertexts = [];
        processing = true;
        animateButton.disabled = true;
        processBlock();
    }
}

// Placeholder for actual encryption blocks (not fully implemented)
let blocks = []; // you may want to build this from CBCValues if animation is used

drawCBCStructure();
updateButton.addEventListener("click", updateInput);
animateButton.addEventListener("click", startCBCAnimation);

// Button to homepage
document.getElementById("back").addEventListener("click", function () {
    anime({
        targets: "body",
        opacity: 0,
        translateX: [50, -50],
        duration: 500,
        easing: "easeInOutQuad",
        complete: function () {
            window.location.href = "homepage.html";
        }
    });
});
