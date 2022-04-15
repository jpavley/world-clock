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
const dotRadius = 8;
const faceBorderWidth = 4;
const dialLineWidth = 8;
const dialRadius = 210;
const positionsOnDial = 8;
const positionOffsetOnDial = 90; // so that 12 o'clock is 0 degrees
const labelFont = 'bold 14px sans-serif';
const timeFont = 'bold 12px Courier New';
var lastTime = 1;

// ***************************
// *  Colors                 *
// ***************************

const staticColors = {
    labelColor: '#313F76',
    timeColor: '#B5882D',
    dialBorderColor: '#CADADD',
    faceBoarderColor: '#313F76'
}

const amColors = {
    faceColor: '#CAE2AA',
    handColor: '#313F76',
    timeColor: '#E18256',
}

const pmColors = {
    faceColor: '#97A88E',
    handColor: '#F5E8D0',
    timeColor: '#7D579A',
}

// ***************************
// *  Timezones              *
// ***************************

const citiesAndLocales = {
    "New York": "America/New_York",
    "London": "Europe/London",
    "Berlin": "Europe/Berlin",
    "Tel Aviv": "Asia/Jerusalem",
    "Bangalore": "Asia/Kolkata",
    "Beijing": "Asia/Shanghai",
    "Sydney": "Australia/Sydney",
    "San Francisco": "America/Los_Angeles",
};

// ***************************
// *  Functions              *
// ***************************

function configureCanvas() {
    ctx.fillStyle = '#F5E8D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    const listOfAngels = calcuateListOfAngles(positionsOnDial);
    lastTime = timeStamp;

    configureCanvas();
    drawDial(centerX, centerY, dialRadius, staticColors.dialBorderColor, dialLineWidth);

    // draw clock faces around the dial

    for (let i = 0; i < listOfAngels.length; i++) {
        const angle = listOfAngels[i];
        const x = centerX + dialRadius * Math.cos((angle - positionOffsetOnDial) * Math.PI / 180);
        const y = centerY + dialRadius * Math.sin((angle - positionOffsetOnDial) * Math.PI / 180);
        const key = Object.keys(citiesAndLocales)[i];
        drawClock(key, citiesAndLocales[key], x, y);

    }
    drawClock("Local Time", "local", centerX, centerY);
    requestAnimationFrame(animate);
}

function calcuateListOfAngles(count) {
    return Array.from(Array(count), (_, i) => i * (360) / count);
}

function convertDateToTimeZone(date, timeZone) {
    return new Date(date.toLocaleString("en-Us", {timeZone: timeZone}));
}

function drawClock(lableText, timeZone, x, y) {

    const now = new Date();
    let nowAtTimezone;

    timeZone == "local" ? nowAtTimezone = now : nowAtTimezone = convertDateToTimeZone(now, timeZone);

    let hours24 = nowAtTimezone.getHours();
    let hours12 = hours24 % 12;
    let minutes = nowAtTimezone.getMinutes();
    let seconds = nowAtTimezone.getSeconds();
    const period = hours24 >= 12 ? 'PM' : 'AM';

    seconds < 10 ? seconds = '0' + seconds : seconds = seconds;
    minutes < 10 ? minutes = '0' + minutes : minutes = minutes;
    hours12 < 10 ? hours12 = '0' + hours12 : hours12 = hours12;
    hours24 < 10 ? hours24 = '0' + hours24 : hours24 = hours24;

    const currentTime24 = `${hours24}:${minutes} 24`;
    const currentTime12 = `${hours12}:${minutes} ${period}`;

    const fc = period == 'AM' ? amColors.faceColor : pmColors.faceColor;
    const fbc = period == 'AM' ? amColors.handColor : pmColors.handColor;
    const tc = period == 'AM' ? amColors.timeColor : pmColors.timeColor;

    drawLabel(x, y - faceRadius - 10, lableText, labelFont, staticColors.labelColor);
    drawFace(x, y, faceRadius, fc);

    const hourHandHour = hours24 == 12 ? 0 : hours24;
    const hourHandAngle = (hourHandHour * 30) + (minutes / 2);
    const minuteHandAngle = (minutes * 6);

    // radians = degrees * (pi / 180)

    drawHourHand(x, y, faceRadius * 0.6, hourHandAngle * Math.PI / 180, 6, fbc);
    drawMinuteHand(x, y, faceRadius * 0.9, minuteHandAngle * Math.PI / 180, 4, fbc);

    drawFaceDot(x, y, faceRadius, fc, fbc);

    drawLabel(x, y + faceRadius + 16, currentTime12, timeFont, tc);
    drawLabel(x, y + faceRadius + 30, currentTime24, timeFont, tc);
}

function drawFace(x, y, radius, color) {

    // face border
    ctx.beginPath();
    ctx.arc(x, y, radius + faceBorderWidth, 0, Math.PI * 2, false);
    ctx.fillStyle = staticColors.faceBoarderColor;
    ctx.fill();

    // inner face
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
}


function drawFaceDot(x, y, radius, color, borderColor) {

    // center dot border
    ctx.beginPath();
    ctx.arc(x, y, dotRadius + 3, 0, Math.PI * 2, false);
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

function drawHourHand(x, y, length, angle, lineWidth, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

function drawMinuteHand(x, y, length, angle, lineWidth, color) { 
    drawHourHand(x, y, length, angle, lineWidth, color);
}

function drawDial(x, y, radius, borderColor, lineWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}


// ***************************
// *  Main Program           *
// ***************************

animate(0);

