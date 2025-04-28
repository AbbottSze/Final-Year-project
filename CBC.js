var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var bits = canvas.getContext('2d');
const animateButton = document.getElementById("animateButton");
const updateButton = document.getElementById("updateButton");
let plaintextInput = document.getElementById("CBCInput");
let ivInput = document.getElementById("IV");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.6;

// CBC encryption variables + initial values
let blockSize = 50;
let iv = [0,0,1,0,0];
let CBCValues = [1,0,0,1,0,0,0];
let AllValues = [];
let ciphertexts = [];
let Xortext = [];
let processingIndex = null;
let processing = false;
let x = 100;
let lastx = x + (blockSize *4)
let padding = false;
let AESResult = null;

// Draw CBC structure with connecting lines
function drawCBCStructure() {
    x = 100;
    padding = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black'
    c.font = "20px Helvetica";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText('IV', 110, 125);
    c.fillText('Plain Text', 450, 75);
    c.fillText('Cipher Text', 375, 375);
    c.fillText('Block 1', 575, 25);
    drawBlock(300, 285, "AES", padding);
    drawLine(450, 250, 325, 250);
    drawLine(325, 250, 325, 285);
    drawLine(350, 310, 575, 310);
    drawLine(575, 310, 575, 350);
    
    //draw iv block
    for (let i = 0; i < 5; i++) {
        drawBlock(x, 150, iv[i],padding);
        x += 50;
    }
    x += 100;

    //draw input value block
    for (let i = 0; i < 5; i++) {
        value = CBCValues[i];
        if (value == null){
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
        drawBlock(x, 225, Xortext[i] , padding)
        drawBlock(x, 350, ciphertexts[i] , padding)
        x+=50;
    }
    drawLine(lastx +50, 175, lastx + 290, 175);
    drawLine(lastx + 275, 150, lastx + 275, 225);
    drawXOR(lastx + 275)
    if (CBCValues.length > 5) {
        x = 800
        c.fillText('Plain Text', 825, 75);
        c.fillText('Block 2', 925, 25);
        drawBlock(1100, 285, "AES", padding);
        drawLine(1050, 250, 1125, 250);
        drawLine(1125, 250, 1125, 285);
        drawLine(1100, 310, 925, 310);
        drawLine(925, 310, 925, 350);
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
            drawBlock(x, 225, Xortext[i+5], padding)
            drawBlock(x, 350, ciphertexts[i+5], padding)
            x += 50
        }
        drawLine(lastx + 400, 375, lastx + 450, 375);
        drawLine(lastx + 450, 375, lastx + 450, 175);
        drawLine(lastx + 450, 175, lastx + 640, 175);
        drawLine(lastx + 625, 150, lastx + 625, 225);
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
    padding = false;
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
            paused = true;
            animateButton.disabled = false;
            xorResult = calculateXORResult();
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
        Xortext.push(movingBit);
        counter += 1;
        if (counter < 5) {
            reset1();
            drawCBCStructure();
        } else if (counter > CBCValues.length){
            paused = true;
            counter = 0;
            pos = 0;
            animateButton.disabled = false;
            // drawCBCStructure();
            block_1_AESReset();
            AESBlock1();
            animateButton.disabled = true;
            return
        }   else if (CBCValues.length > 5) {
                paused = true;
                counter = 0;
                pos = 0;
                animateButton.disabled = false;
                //drawCBCStructure();
                block_1_AESReset();
                AESBlock1();
        }   
        drawCBCStructure();
    } 
}

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

function block_1_AESReset() {
    movingBit = Xortext[pos];
    phase = 0;
    currentx = 400;
    currenty = 225;
    AESResult = null;
    animateButton.disabled = false;
}

function AESBlock1() {
    console.log("dllm")
    if (paused) return;
    requestAnimationFrame(Block1);
    bits.clearRect(0, 0, canvas.width, canvas.height);
    drawCBCStructure();

    // Draw moving right bit
    drawBits(currentx, currenty, movingBit);

    if (currentx >= 300) {
        console.log("hi")
        currentx -= dx;
    }

    // Motion phases
    if (phase === 0) {
        console.log("0")
        if (ivx < ivTargetx) {
            ivx += dx;}
        else {phase = 1}
    } else if (phase === 1) {
        console.log("1")
        // Draw XOR result near arc (left of arc)
        if (xorResult == null) {
            paused = true;
            animateButton.disabled = false;
            xorResult = calculateXORResult();
            bits.fillStyle = "red";
            bits.fillText(`${xorResult}`, currentx + 5, currenty + 40);
            currenty += 40
        }
        currenty += dy;
        if (currenty >= 250) {phase = 2};
    } else if (phase === 2) {
        console.log("2")
        paused = true;
        pos += 1;
        animateButton.disabled = false;
        Xortext.push(movingBit);
        counter += 1;
        if (counter < 5) {
            reset1();
            drawCBCStructure();
        } else if (counter > CBCValues.length){
            counter = 0;
            pos = 0;
            block_1_AESReset();
            drawCBCStructure();
            animateButton.disabled = true;
            return
        }   else if (CBCValues.length > 5) {
                // Automatically switch to Block2
                drawCBCStructure();
                reset2();
                Block2();
        }   
        drawCBCStructure();
    } 
}

function Block2() {
    if (paused) return;
    drawBits(ivx, ivy, ivBit);
    requestAnimationFrame(Block2);
    bits.clearRect(0, 0, canvas.width, canvas.height);
    drawCBCStructure();

    drawBits(currentx, currenty, movingBit);
    drawBits(ivx, ivy, ivBit);
    if (currenty <= starty + 25) {
        currenty += dy;
    }

    if (phase === 0) {
        if (ivx < ivTargetx) {
            ivx += dx;}
        else {phase = 1}
    }
    if (phase === 1) {
        ivy -= dy;
        if (ivy < ivTargety) {
            phase = 2;}
    } else if (phase === 2) {
        ivx += dx;
        if (ivx > ivTargetx + 130) {
            phase = 3
        }
    } else if (phase === 3 ) {
        if (xorResult == null) {
            paused = true;
            animateButton.disabled = false;
            xorResult = calculateXORResult();
            bits.fillStyle = "red";
            bits.fillText(`${xorResult}`, currentx + 5, currenty + 40);
            currenty += 40
        }
        currenty += dy;
        if (currenty >= 250) {phase = 4};
    } else if (phase === 4) {
        paused = true;
        pos += 1
        counter+=1
        animateButton.disabled = false;
        Xortext.push(movingBit);
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

function reset2() {
    movingBit = AllValues[pos];
    iv.push(Xortext[pos-5]);
    ivBit = [iv[pos]];
    phase = 0;
    ivx = 675;
    ivy = 374;
    ivTargetx = 750;
    ivTargety = 180;
    startx = 930;
    starty = 130;
    currentx = 930;
    currenty = 130;
    xorResult = null;
    animateButton.disabled = false;
}

function hardreset() {
    pos = 0;
    counter = 0;
    phase = 0;
    Xortext = [];
    ciphertexts = [];
    AllValues = [];
    paused = true;
    xorResult = null;
    ivx = 325;
    ivy = 180;
    ivTargetx = 530;
    ivTargety = 180;
    startx = 580;
    starty = 130;
    currentx = 585;
    currenty = 130;
    padding = false;

    drawCBCStructure();
    movingBit = AllValues[pos];
    ivBit = [iv[pos]];

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
    } else if (counter < 10 && CBCValues.length > 5) {
        if (paused) {
            paused = false;
            animateButton.disabled = true;
            Block2();
        }
        animateButton.disabled = true;
    }
}

document.getElementById("updateButton").addEventListener("click", () => {
    let CBCInput = document.getElementById("CBCInput").value;
    let ivInput = document.getElementById("IV").value;
    if (/^[01]{3,10}$/.test(CBCInput)) {
        if (/^0+$/.test(CBCInput)) {
            alert("CBC cannot be all zeros! Please enter a valid sequence.");
            return;
        }
        CBCValues = CBCInput.split('').map(Number);
    } else {
        alert("Please enter a valid binary sequence (0s and 1s, between 3-10 digits).");
        return;
    }
    let newiv = ivInput.split('').map(Number);
    if (/^[01]{5}$/.test(ivInput)){
        iv = newiv;
    } else if (newiv.length == 0) {
    } else {
        alert("Please enter a valid Initialization Vector (0s and 1s, 5 digits).");
        return
    }
    hardreset();
    drawCBCStructure();
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

var container = document.querySelector(".text");

var speed = 40

var textLines = [
   {speed, string: "What are the yellow bits at the end? Click me to find out!" },
];


var characters = [];
function init() {
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

document.getElementById("hint").addEventListener("click", function (){
    container.innerHTML = ""
    textLines = [{speed, string: "In CBC mode, extra bits (padding) are added to the last block to make it the correct block size, ensuring the cipher processes the data correctly. Padding is removed during decryption."}]
    init();
    revealOneCharacter(characters);
    hint.disabled = true
});