// World Clock XL


// ***************************
// *  Global Variables       *
// ***************************

const canvas = document.getElementById('canvas');
console.log(canvas)
const ctx = canvas.getContext('2d');

function configureCanvas() {
    ctx.fillStyle = '#F5E8D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

configureCanvas();




