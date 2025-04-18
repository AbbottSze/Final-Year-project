var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var bits = canvas.getContext('2d');
const animateButton = document.getElementById("animateButton");
const updateButton = document.getElementById("updateButton");
let plaintextInput = document.getElementById("CBCInput");
let ivInput = document.getElementById("IV");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

// CBC encryption variables + initial values
let blockSize = 50;
let iv = [0,0,1,0,0];
let CBCValues = [1,0,0,1,0,1,1];
let AllValues = [];
let ciphertexts = [];
let processingIndex = null;
let processing = false;
let x = 100;
let lastx = x + (blockSize *4)
let padding = false

// Draw CBC structure with connecting lines
function drawCBCStructure() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    //draw iv block
    for (let i = 0; i < 5; i++) {
        //console.log(`Drawing IV block ${i + 1} at x=${x} with value=${iv[i]}`);
        drawBlock(x, 150, iv[i]);
        x += 50;
    }
    x += 100;

    //draw input value block
    for (let i = 0; i < 5; i++) {
        value = CBCValues[i];
        if (value == null){
            //console.log('hi')
            if (i == CBCValues.length){
                value = 1;
            }
            else {
                value = 0;
            }
            padding = true;
        }
        AllValues.push(value);
        drawBlock(x, 100, value, padding);
        drawBlock(x, 250, ciphertexts[i] , padding)
        x+=50;
    }
    drawLine(lastx +50, 175, lastx + 290, 175);
    drawLine(lastx + 275, 150, lastx + 275, 250);
    drawXOR(lastx + 275)
    if (CBCValues.length > 5) {
        x = 800
        for (let i = 0 ; i < 5; i++) {
            value = CBCValues[i + 5];
            if (value == null){
                if (i + 5 == CBCValues.length){
                    value = 1;
                }
                else {
                    value = 0;
                }
                padding = true;
            }
            AllValues.push(value);
            drawBlock(x, 100, value, padding)
            drawBlock(x, 250,ciphertexts[i+5], padding)
            x += 50
        }
        drawLine(lastx + 400, 275, lastx + 450, 275);
        drawLine(lastx + 450, 275, lastx + 450, 175);
        drawLine(lastx + 450, 175, lastx + 640, 175);
        drawLine(lastx + 625, 150, lastx + 625, 250);
        drawXOR(lastx + 625)
        x = 100;
        padding = false;
    }
}

function drawBits(x, y, bitValue) {
    if (padding == true){
        bits.fillStyle = 'Yellow'
    } else {
        bits.fillStyle = "black";
    }
    bits.font = "20px Helvetica";
    bits.textAlign = "center";
    bits.textBaseline = "middle";
    bits.fillText(bitValue, x + 5, y - 5);
}

function drawBlock(x, y, value, padding) {
    c.beginPath()
    c.moveTo(x, y);
    c.lineTo(x + blockSize, y);
    c.lineTo(x + blockSize, y + blockSize);
    c.lineTo(x, y + blockSize);
    c.closePath();
    c.stroke();
    if (value === undefined) {
        //console.log('yo')
        drawBits(x + 20, y + 5 + blockSize / 2, '')}
    else if (padding == true) {
        drawBits(x + 20, y + 5 + blockSize / 2, value)
        padding = false;
    } else {
    drawBits(x + 20, y + 5 + blockSize / 2, value)
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

drawCBCStructure();
let pos = 0;
let movingBit = AllValues[pos];
let xorResult = null;
let paused = true;
let ivBit = [iv[pos]];
let startx = 580;
let starty = 130;
let currentx = 585;
let currenty = 130;
let phase = 0;
let dx = 2, dy = 2;
let ivx = 325;
let ivy = 180;
let ivTargetx = 530;
let ivTargety = 180;
let counter = 0;

function Block1() {
    if (paused) return;
    requestAnimationFrame(Block1);
    bits.clearRect(0, 0, canvas.width, canvas.height);
    drawCBCStructure();

    // Draw moving right bit
    drawBits(currentx, currenty, movingBit);
    drawBits(ivx, ivy, ivBit);
    if (currenty <= starty + 25) {
        currenty += dy;
    }
    
    // Motion phases
    if (phase === 0) {
        if (ivx < ivTargetx) {
            ivx += dx;}
        else {phase = 1}
    } else if (phase === 1) {
        // Draw XOR result near arc (left of arc)
        if (xorResult == null) {
            //console.log('diu')
            paused = true;
            animateButton.disabled = false;
            xorResult = calculateXORResult();
            console.log("XOR Result is now moving:", movingBit);
            //console.log('hi')
            bits.fillStyle = "red";
            bits.fillText(`${xorResult}`, currentx + 5, currenty + 40);
            currenty += 40
        }
        currenty += dy;
        if (currenty >= 250) {phase = 2};
    } else if (phase === 2) {
        paused = true;
        pos += 1;
        animateButton.disabled = false;
        ciphertexts.push(movingBit);
        counter += 1;
    
        if (counter < 5) {
            reset1();
            drawCBCStructure();
        } else {
            // Automatically switch to Block2
            reset2();
            Block2();
        }
    }
}

let ivx_2 = 675;
let ivy_2 = 250;
let ivTargetx_2 = 750;
let ivTargety_2 = 180;
let startx_2 = 930;
let starty_2 = 130;
let currentx_2 = 930;
let currenty_2 = 130;

function Block2() {
    counter+=1
    if (paused) return;
    requestAnimationFrame(Block2);
    bits.clearRect(0, 0, canvas.width, canvas.height);
    drawCBCStructure();
    console.log(iv);

    drawBits(currentx_2, currenty_2, movingBit);
    drawBits(ivx_2, ivy_2, ivBit);
    if (currenty_2 <= starty_2 + 25) {
        currenty_2 += dy;
    }

    if (phase === 0) {
        console.log('0')
        if (ivx_2 < ivTargetx_2) {
            ivx_2 += dx;}
        else {phase = 1}
    }
    if (phase === 1) {
        console.log('1')
        ivy_2 -= dy;
        if (ivy_2 < ivTargety_2) {
            phase = 2;}
    } else if (phase === 2) {
        console.log('2')
        ivx_2 += dx;
        if (ivx_2 > ivTargetx_2 + 130) {
            phase = 3
        }
    } else if (phase === 3 ) {
        console.log('3')
        if (xorResult == null) {
            //console.log('diu')
            paused = true;
            animateButton.disabled = false;
            xorResult = calculateXORResult();
            console.log("XOR Result is now moving:", movingBit);
            //console.log('hi')
            bits.fillStyle = "red";
            bits.fillText(`${xorResult}`, currentx_2 + 5, currenty_2 + 40);
            currenty_2 += 40
        }
        currenty_2 += dy;
        if (currenty_2 >= 250) {phase = 4};
    } else if (phase === 4) {
        paused = true;
        pos += 1
        animateButton.disabled = false;
        ciphertexts.push(movingBit);
        drawCBCStructure();
        reset2()
    }
}

function calculateXORResult() {
// Collect tap bits according to xorPositions
    if (ivBit == movingBit){
        return movingBit = 0;
    } else {
        return movingBit = 1;
    }
};

function reset1() {
    movingBit = AllValues[pos];
    ivBit = [iv[pos]];
    phase = 0;
    ivx = 325;
    ivy = 180;
    ivTargetx = 530;
    ivTargety = 180;
    startx = 580;
    starty = 130;
    currentx = 585;
    currenty = 130;
    xorResult = null;
    animateButton.disabled = false;
}

function reset2() {
    movingBit = AllValues[pos];
    ivBit = [iv[pos]];
    phase = 0;
    ivx_2 = 675;
    ivy_2 = 250;
    ivTargetx_2 = 750;
    ivTargety_2 = 180;
    startx_2 = 930;
    starty_2 = 130;
    currentx_2 = 930;
    currenty_2 = 130;
    xorResult = null;
    iv = ivValue+ciphertexts;
    animateButton.disabled = false;
}

// Control button handler
function handleAnimationButton() {
    if (counter < 5) {
        if (paused) {
            paused = false;
            animateButton.disabled = true;
            Block1();
        }
    } else {
        if (paused) {
            paused = false;
            animateButton.disabled = true;
            Block2();
        }
    }
}

document.getElementById("updateButton").addEventListener("click", () => {

    let CBCInput = document.getElementById("CBCInput").value;
    let ivInput = document.getElementById("IV").value;
    if (/^[01]{3,5}$/.test(CBCInput)) {
        if (/^0+$/.test(CBCInput)) {
            alert("CBC cannot be all zeros! Please enter a valid sequence.");
            return;
        }
        CBCValues = CBCInput.split('').map(Number);
        console.log(CBCValues);
        // Recalculate x and lastbox based on new lfsrValues
    } else {
        alert("Please enter a valid binary sequence (0s and 1s, between 3-10 digits).");
        return;
    }
    ciphertexts = [];
    if (iv.length == 0){
        ivValue = ivInput.split(' ').map(Number);
    }
    drawCBCStructure();
    reset1();
});


document.getElementById("RandomIV").addEventListener("click", () => {
    let ran = 0;
    iv = [];
    for (i=0; i < 5; i++){
        ran = Math.random(1)
        if (ran>0.5) {
            iv.push(1)
        } else {
        iv.push(0)}
    }
    drawCBCStructure()
    reset1();
});

document.getElementById("animateButton").addEventListener("click", handleAnimationButton);

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