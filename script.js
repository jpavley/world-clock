// World Clock XL
// (c) 2022 by John Pavley

// ***************************
// *  Global Variables       *
// ***************************

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const viewPortWidth = getViewportSize().width;
const viewPortHeight = getViewportSize().height;
const positionsOnDial = 8;
const positionOffsetOnDial = 90; // so that 12 o'clock is 0 degrees

let shortSide = Math.min(viewPortWidth, viewPortHeight);
//shortSide = shortSide < 1000 ? shortSide : 1000; // TODO: add to configureCanvas or delete
let lastTime = 1;

// TODO: calculate all these values with dynamicMetrics

canvas.width = shortSide;
canvas.height = shortSide;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

let faceRadius = 0;
let dotRadius = 0;
let faceDotBorderWidth = 0;
let faceBorderWidth = 0;
let dialLineWidth = 0;
let dialRadius = 0;
let labelFont = '';
let timeFont = '';
let hourHandWidth = 0;
let minuteHandWidth = 0;
let hourHandLength = 0;
let minuteHandLength = 0;

// ***************************
// *  Metrics                *
// ***************************

const hardMetrics = {
    size: 540,
    centerX: 270,
    centerY: 270,

    faceRadius: 90/2,
    faceBorderWidth: 3,
    faceDotRadius: 18/2,
    faceDotBorderWidth: 4,

    minuteHandLength: 40,
    minuteHandWidth: 4,
    hourHandLength: 30,
    hourHandWidth: 6,

    dialRadius: 413/2,
    dialLineWidth: 8,

    lableFontSize: 14,
    timeFontSize: 12,

    // TODO: add faceDotBorderWidth, space between labels
    // TODO: hints for very small and very large sizes for fontsize and spacing
};

const dynamicMetrics = {
    size: 0,
    centerX: 0,
    centerY: 0,

    faceRadius: 0,
    faceBorderWidth: 0,
    faceDotRadius: 0,
    faceDotBorderWidth: 0,

    minuteHandLength: 0,
    minuteHandWidth: 0,
    hourHandLength: 0,
    hourHandWidth: 0,

    dialRadius: 0,
    dialLineWidth: 0,

    lableFontSize: 0,
    timeFontSize: 0
};

function updateDynamicMetrics(shortSide) {
    dynamicMetrics.size = shortSide;
    dynamicMetrics.centerX = shortSide / 2;
    dynamicMetrics.centerY = shortSide / 2;

    dynamicMetrics.faceRadius = shortSide / (hardMetrics.size / hardMetrics.faceRadius);
    dynamicMetrics.faceBorderWidth = shortSide / (hardMetrics.size / hardMetrics.faceBorderWidth);
    dynamicMetrics.faceDotRadius = shortSide / (hardMetrics.size / hardMetrics.faceDotRadius);
    dynamicMetrics.faceDotBorderWidth = shortSide / (hardMetrics.size / hardMetrics.faceDotBorderWidth);

    dynamicMetrics.minuteHandLength = shortSide / (hardMetrics.size / hardMetrics.minuteHandLength);
    dynamicMetrics.minuteHandWidth = shortSide / (hardMetrics.size / hardMetrics.minuteHandWidth);
    dynamicMetrics.hourHandLength = shortSide / (hardMetrics.size / hardMetrics.hourHandLength);
    dynamicMetrics.hourHandWidth = shortSide / (hardMetrics.size / hardMetrics.hourHandWidth);

    dynamicMetrics.dialRadius = shortSide / (hardMetrics.size / hardMetrics.dialRadius);
    dynamicMetrics.dialLineWidth = shortSide / (hardMetrics.size / hardMetrics.dialLineWidth);

    dynamicMetrics.lableFontSize = shortSide / (hardMetrics.size / hardMetrics.lableFontSize);
    dynamicMetrics.timeFontSize = shortSide / (hardMetrics.size / hardMetrics.timeFontSize);
}

// ***************************
// *  Colors                 *
// ***************************

const staticColors = {
    labelColor: '#313F76',
    timeColor: '#B5882D',
    dialBorderColor: '#CADADD',
    faceBoarderColor: '#313F76'
};

const amColors = {
    faceColor: '#CAE2AA',
    handColor: '#313F76',
    timeColor: '#E18256',
};

const pmColors = {
    faceColor: '#97A88E',
    handColor: '#F5E8D0',
    timeColor: '#7D579A',
};

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

function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    }
}

function configureCanvas() {
    ctx.fillStyle = '#F5E8D0';
    ctx.fillRect(0, 0, shortSide, shortSide);
    updateDynamicMetrics(shortSide);
    //console.log(dynamicMetrics);

    // TODO: add listeners for resize and orientation change

    // canvas.width = shortSide;
    // canvas.height = shortSide;
    // centerX = canvas.width / 2;
    // centerY = canvas.height / 2;

    faceRadius = dynamicMetrics.faceRadius;
    dotRadius = dynamicMetrics.faceDotRadius;
    faceBorderWidth = dynamicMetrics.faceBorderWidth;
    faceDotBorderWidth = dynamicMetrics.faceDotBorderWidth;
    dialLineWidth = dynamicMetrics.dialLineWidth;
    dialRadius = dynamicMetrics.dialRadius;
    labelFont = `bold ${dynamicMetrics.lableFontSize}px sans-serif`;
    timeFont = `bold ${dynamicMetrics.timeFontSize}px Courier New`;
    hourHandWidth = dynamicMetrics.hourHandWidth;
    minuteHandWidth = dynamicMetrics.minuteHandWidth;
    hourHandLength = dynamicMetrics.hourHandLength;
    minuteHandLength = dynamicMetrics.minuteHandLength;

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

// map function: create an array of angles with step of 360/count
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

    drawHourHand(x, y, hourHandLength, hourHandAngle * Math.PI / 180, hourHandWidth, fbc);
    drawMinuteHand(x, y, minuteHandLength, minuteHandAngle * Math.PI / 180, minuteHandWidth, fbc);

    drawFaceDot(x, y, fc, fbc);

    drawLabel(x, y + faceRadius + 16, currentTime12, timeFont, tc);
    drawLabel(x, y + faceRadius + 30, currentTime24, timeFont, tc);
}

function drawFace(x, y, radius, color) {

    // face border
    ctx.beginPath();
    ctx.arc(x, y, radius + faceDotBorderWidth, 0, Math.PI * 2, false);
    ctx.fillStyle = staticColors.faceBoarderColor;
    ctx.fill();

    // inner face
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
}


function drawFaceDot(x, y, color, borderColor) {

    // center dot border
    ctx.beginPath();
    ctx.arc(x, y, dotRadius + faceBorderWidth, 0, Math.PI * 2, false);
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

