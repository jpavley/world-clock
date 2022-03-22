// World Clock XL


// ***************************
// *  Global Variables       *
// ***************************

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const lastTime = 1;

function configureCanvas() {
    ctx.fillStyle = '#F5E8D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

configureCanvas();

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    configureCanvas();
    requestAnimationFrame(animate);
}


