// World Clock XL
// (c) 2022 by John Pavley


// ***************************
// *  Global Variables       *
// ***************************

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const faceRadius = 45;
const dotRadius = 6;
const faceBorderWidth = 4;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

var lastTime = 1;

// ***************************
// *  Functions              *
// ***************************

function configureCanvas() {
    ctx.fillStyle = '#F5E8D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    configureCanvas();
    drawLocalClock();
    requestAnimationFrame(animate);
}

function drawLocalClock() {
    drawCircle(centerX, centerY, faceRadius, '#E18256', '#313F76');
}

function drawCircle(x, y, radius, color, borderColor) {

    // outer border
    ctx.beginPath();
    ctx.arc(x, y, radius + faceBorderWidth, 0, Math.PI * 2, false);
    ctx.fillStyle = borderColor;
    ctx.fill();

    // inner face
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();

    // center dot
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = borderColor;
    ctx.fill();

}


// ***************************
// *  Main Program           *
// ***************************

animate(0);

