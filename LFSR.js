var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var bits = canvas.getContext('2d');
const animateButton = document.getElementById("animateButton");


canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.6;

c.strokeStyle = 'black';
bits.strokeStyle = 'black';

// Default LFSR values & XOR positions
var lfsrValues = [1, 0, 1, 1, 0];
var xorPositions = [2, 3];
let startX = 300;
let boxSize = 50;

// Function to draw LFSR structure (boxes & feedback loop)
function drawLFSRStructure() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    let numBoxes = lfsrValues.length;
    let lastBoxX = startX + (numBoxes - 1) * boxSize + boxSize;

    c.beginPath();
    c.moveTo(lastBoxX, 275);
    c.lineTo(lastBoxX + 150, 275);
    c.lineTo(lastBoxX + 150, 170);
    c.lineTo(startX - 50, 170);
    c.lineTo(startX - 50, 275);
    c.lineTo(startX, 275);

    //output arrow
    c.moveTo(lastBoxX + 150, 275);
    c.lineTo(lastBoxX + 200, 275);
    c.lineTo(lastBoxX + 180, 250);
    c.moveTo(lastBoxX + 200, 275);
    c.lineTo(lastBoxX + 180, 300);
    c.stroke();

    //output
    c.font = "20px Helveticas";
    c.fillStyle = "black";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText('Output', lastBoxX + 200, 240);

    // Draw boxes
    for (let i = 0; i < numBoxes; i++) {
        let x = startX + i * boxSize;
        let y = 250;

        c.beginPath();
        c.rect(x, y, boxSize, boxSize);
        c.stroke()

        drawBits(x, y, lfsrValues[i]);
    }

    // Draw XOR gates at specified positions
    xorPositions.forEach(pos => {
        if (pos >= 0 && pos < numBoxes + 1) {
            let xorX = lastBoxX - pos * boxSize + 25;

            c.beginPath();
            c.moveTo(xorX, 155);
            c.lineTo(xorX, 250);
            c.stroke();

            c.beginPath();
            c.arc(xorX, 170, 15, 0, 2 * Math.PI);
            c.stroke();
        } else {
            alert("Please enter valid XOR positions (comma-separated, within range).");
            return;
        }
    });
}

// Function to draw bit values inside boxes
function drawBits(x, y, bitValue) {
    bits.font = "20px Helvetica";
    bits.fillStyle = "black";
    bits.textAlign = "center";
    bits.textBaseline = "middle";
    bits.fillText(bitValue, x + boxSize / 2, y + boxSize / 2);
}

// Function to update LFSR and XOR positions
function updateLFSRAndXOR() {
    results = [];
    let lfsrInput = document.getElementById("lfsrInput").value;
    let xorInput = document.getElementById("xorInput").value;

    // Validate LFSR input (only allow 0s and 1s, max 3-5 characters)
    if (/^[01]{3,5}$/.test(lfsrInput)) {
        if (/^0+$/.test(lfsrInput)) {
            alert("LFSR cannot be all zeros! Please enter a valid sequence.");
            return;
        }
        lfsrValues = lfsrInput.split('').map(Number).reverse();
        movingBit = lfsrValues[lfsrValues.length - 1];
        // Recalculate x and lastbox based on new lfsrValues
        x = startX + (lfsrValues.length - 1) * boxSize;
        lastbox = startX + (lfsrValues.length - 1) * boxSize + boxSize;
    } else {
        alert("Please enter a valid binary sequence (0s and 1s, between 3-5 digits).");
        return;
    }

    // Validate XOR positions (comma-separated numbers within valid range)
    let positions = xorInput.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));

    // Check for duplicates
    let uniquePositions = new Set(positions);
    if (uniquePositions.size !== positions.length) {
        alert("Duplicate XOR positions detected! Please enter unique positions.");
        return;
    }

    // Check if all positions are within range
    if (positions.some(pos => pos < 1 || pos > lfsrValues.length)) {
        alert(`XOR positions must be between 1 and ${lfsrValues.length}`);
        return;
    }

    if (positions.length > 0) {
        xorPositions = positions;
    } else {
        alert("Please enter valid XOR positions (comma-separated, within range).");
        return;
    }
    reset();
}


let x = startX + (lfsrValues.length - 1) * boxSize;
let y = 250;
let dx = 2, dy = 2;
let phase = 0;
let lastbox = startX + (lfsrValues.length - 1) * boxSize + boxSize;
let paused = false;
let xorPauseDone = false;
var movingBit = lfsrValues[lfsrValues.length - 1];

let xorBitsY = {};
let xorTargetY = 170; 
let xorResult = null;
let counter = 0
let results = [];

// Initialize XOR bits
function initXorBits() {
    xorBitsY = {};
    xorPositions.forEach(pos => {
        xorBitsY[pos] = 250;
    });
    xorResult = null;
}

function calculateXORResult() {
    // Collect tap bits according to xorPositions
    let tapBits = xorPositions.map(pos => lfsrValues[lfsrValues.length - pos]);
    if (tapBits[counter] == movingBit){
        xorResult = 0;
        movingBit = 0;
    } else {
        xorResult = 1;
        movingBit = 1;
    }
    counter += 1
    return xorResult;
}

// Animation loop
function moveBits() {
    if (paused) return;
    requestAnimationFrame(moveBits);
    bits.clearRect(0, 0, canvas.width, canvas.height);
    drawLFSRStructure();

    drawBits(x, y, movingBit);

    // Animate XOR bits moving up
    xorPositions.forEach(pos => {
        let boxX = startX + (lfsrValues.length - pos) * boxSize;
        let bitVal = lfsrValues[lfsrValues.length - pos];
        let currentY = xorBitsY[pos];
        if (currentY > xorTargetY) xorBitsY[pos] -= dy;
        drawBits(boxX + boxSize / 2 - 10, currentY, bitVal);
    });

    // Motion phases
    if (phase === 0) {
        x += dx;
        if (x >= lastbox + 125) {phase = 1;    
            results.push(movingBit)
            document.getElementById("results").textContent = results.join('');}
    } else if (phase === 1) {
        y -= dy;
        if (y <= 135) phase = 2;
    } else if (phase === 2) {
        x -= dx;
        xorPositions.forEach(pos => {
            let xorX = lastbox - pos * boxSize + 20;
            if (Math.abs(x - xorX) <= 1 && !xorPauseDone) {
                paused = true;
                xorPauseDone = true;
                animateButton.disabled = false;
                xorResult = calculateXORResult();
                movingBit = xorResult;
            
                // Draw XOR result near arc (left of arc)
                if (xorResult !== null) {
                    bits.font = "20px Helvetica";
                    bits.fillStyle = "red";
                    bits.fillText(`${xorResult}`, xorX - 20, 160);
                    x-= 20
                }
            }
        });
        if (x <= startX - 100) phase = 3;
    } else if (phase === 3) {
        y += dy;
        if (y >= 250) {
            phase = 4
        }
    } else if (phase ===4) {
        x += dx;
        if (x >= startX - 40) {
            paused = true;
            animateButton.disabled = false;
                // Shift LFSR and insert XOR result and reset
            lfsrValues.pop();
            lfsrValues.unshift(xorResult);
            reset ();
        }
    }
}

// Control button handler
function handleAnimationButton() {
    if (paused) {
        paused = false;
        xorPauseDone = false;
        animateButton.disabled = true;
        moveBits();
    } else {
        x = startX + (lfsrValues.length - 1) * boxSize;
        y = 250;
        phase = 0;
        xorResult = null;
        initXorBits();
        animateButton.disabled = true;
        moveBits();
    }
}

// reset animation state
function reset() {
    phase = 0;
    x = startX + (lfsrValues.length - 1) * boxSize;
    y = 250;
    xorResult = null;
    xorPauseDone = false;
    counter = 0;
    movingBit = lfsrValues[lfsrValues.length - 1];

    drawLFSRStructure();
    initXorBits();
}

// initial Setup 
drawLFSRStructure();
initXorBits();

// Event Listeners
document.getElementById("updateButton").addEventListener("click", () => {
    updateLFSRAndXOR();
    initXorBits();
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
   {speed, string: "Why can't the LFSR bits be all 0s? Click me to find out!" },
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
    textLines = [{speed, string: "If all the bits become 0, the LFSR will stay stuck at 0 forever — because XOR of zeros is still zero, and it will keep shifting zeros endlessly. This is called a 'lock-up' state."}]
    init();
    revealOneCharacter(characters);
    hint.disabled = true
});