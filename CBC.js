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
let iv = [1,0,0,1,0];
let CBCValues = [1,0,0,0,0]
let ciphertexts = [];
let processingIndex = null;
let processing = false;
let x = 100;
let lastx = x + (blockSize *4)

// Function to get user input
function updateInput() {
    let inputText = plaintextInput.value;
    iv = ivInput.value.split(",").filter(v => v.trim() !== "").map(Number);
    CBCValues = inputText.split(' ').map(Number);
    drawCBCStructure();
}



// Draw CBC structure with connecting lines
function drawCBCStructure() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    c.font = "20px Helvetica";
    c.fillStyle = "black";

    for (let i = 0; i < iv.length; i++) {
        console.log(`Drawing IV block ${i + 1} at x=${x} with value=${iv[i]}`);
        drawBlock(x, 150, iv[i]);
        x += 50;
    }
    x += 100;
    for (let i = 0; i < CBCValues.length; i++) {
        drawBlock(x, 100, CBCValues[i],);
        drawBlock(x, 250,'')
        x+=50;
    }
    
    if (CBCValues.length > 5) {

    }
    drawLine(lastx +50, 175, lastx + 275, 175);
    drawLine(lastx + 275, 150, lastx + 275, 250);
}

function drawBlock(x, y, value) {

    c.beginPath()
    c.moveTo(x, y);
    c.lineTo(x + blockSize, y);
    c.lineTo(x + blockSize, y + blockSize);
    c.lineTo(x, y + blockSize);
    c.closePath();
    c.stroke();
    c.fillStyle = "black";
    c.fillText(String(value), x + 20, y + 5 + blockSize / 2);
}



function drawLine(x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
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
    
    //drawBlock(250, 150 + processingIndex * 100, xorResult, "XOR");
    //drawBlock(450, 150 + processingIndex * 100, encryptedBlock, `C${processingIndex+1}`);
    drawArrow(350, 175 + processingIndex * 100, 450, 175 + processingIndex * 100);
    
    processingIndex++;
    setTimeout(processBlock, 1000);
}

function startCBCAnimation() {
    if (!processing) {
        processingIndex = 0;
        ciphertexts = [];
        //drawCBCStructure();
        processing = true;
        animateButton.disabled = true;
        processBlock();
    }
}

drawCBCStructure();
updateButton.addEventListener("click", updateInput);
animateButton.addEventListener("click", startCBCAnimation);

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
