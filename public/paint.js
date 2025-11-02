import { socket } from './socket.js';

socket.init();

const canvas = document.getElementById('cosmos');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');
const half = { width: canvas.width / 2, height: canvas.height / 2 };

const xy = position => [
    (position.x - socket.data.display.x) * socket.data.display.scale + half.width,
    (position.y - socket.data.display.y) * socket.data.display.scale + half.height
];

const paint = async () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const star of socket.data.stars) {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(...xy(star.position), 2, 0, Math.PI * 2);
        ctx.fill();
    }

    if (socket.data.display.grid && socket.data.display.cell) {
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        const cell = socket.data.display.cell * socket.data.display.scale;

        for (let x = half.width; x < canvas.width; x += cell) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }

        for (let x = half.width; x > 0; x -= cell) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }

        for (let y = half.height; y < canvas.height; y += cell) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        for (let y = half.height; y > 0; y -= cell) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
        const r = socket.data.meta.halfMassRadius * socket.data.display.scale;
        ctx.arc(...xy(socket.data.meta.densityCenter), r, 0, Math.PI * 2);
        ctx.stroke();
    }

    requestAnimationFrame(paint);
}

paint();
