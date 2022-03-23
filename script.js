// World Clock XL
// (c) 2022 by John Pavley


// ***************************
// *  Global Variables       *
// ***************************

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const faceRadius = 45;
const dotRadius = 6;
const faceBorderWidth = 4;
const faceColor = '#E18256';
const faceBoarderColor = '#313F76';

const labelColor = '#313F76';
const labelFont = 'bold 14px sans-serif';
const timeFont = 'bold 12px Courier New';

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
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12;

    //const currentTime24 = hours + ':' + minutes + ':' + seconds + ' 24';
    const currentTime24 = `${hour}:${minutes}:${seconds} 24`;

    //const currentTime12 = hour + ':' + minutes + ':' + seconds + ' ' + period;
    const currentTime12 = `${hour}:${minutes}:${seconds} ${period}`;

    drawLabel(centerX, centerY - faceRadius - 10, 'Local Time', labelFont, labelColor);
    drawCircle(centerX, centerY, faceRadius, faceColor, faceBoarderColor);
    drawLabel(centerX, centerY + faceRadius + 20, currentTime24, timeFont, labelColor);
    drawLabel(centerX, centerY + faceRadius + 34, currentTime12, timeFont, labelColor);
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

function drawLabel(x, y, text, font, fontColor) {
    ctx.font = font;
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = fontColor;
    ctx.fillText(text, x - textWidth/2, y);
}


// ***************************
// *  Main Program           *
// ***************************

animate(0);

