import { socket } from './socket.js';

const method = 'PUT';
const headers = { 'Content-Type': 'application/json' };
const displayResponse = await fetch('/api/cluster/display/');
const display = await displayResponse.json();

const scaleInput = document.getElementById('scale-input');
const scaleButton = document.getElementById('scale-button');
const gridInput = document.getElementById('grid-input');
const gridButton = document.getElementById('grid-button');
const cellInput = document.getElementById('cell-input');
const cellButton = document.getElementById('cell-button');
const xInput = document.getElementById('x-input');
const xButton = document.getElementById('x-button');
const yInput = document.getElementById('y-input');
const yButton = document.getElementById('y-button');
const massInput = document.getElementById('mass-input');
const timeInput = document.getElementById('time-input');
const hmrInput = document.getElementById('hmr-input');
const importInput = document.getElementById('import-input');
const exportButton = document.getElementById('export-button');

scaleInput.value = display.scale;
scaleButton.onclick = async () => {
    const scale = Number(scaleInput.value);
    await fetch('/api/cluster/display/', { method, headers, body: JSON.stringify({ scale }) });
    display.scale = scale;
};

const gridInputValue = () => gridInput.value = display.grid ? 'E N A B L E D' : 'D I S A B L E D';
gridInputValue();
gridButton.onclick = async () => {
    const grid = !display.grid;
    await fetch('/api/cluster/display/', { method, headers, body: JSON.stringify({ grid }) });
    display.grid = grid;
    gridInputValue();
};

cellInput.value = display.cell;
cellButton.onclick = async () => {
    const cell = Number(cellInput.value);
    await fetch('/api/cluster/display/', { method, headers, body: JSON.stringify({ cell }) });
    display.cell = cell;
};

xInput.value = display.x;
xButton.onclick = async () => {
    const x = Number(xInput.value);
    await fetch('/api/cluster/display/', { method, headers, body: JSON.stringify({ x }) });
    display.x = x;
};

yInput.value = display.y;
yButton.onclick = async () => {
    const y = Number(yInput.value);
    await fetch('/api/cluster/display/', { method, headers, body: JSON.stringify({ y }) });
    display.y = y;
};

socket.init(() => {
    massInput.value = socket.data.meta.mass;
    timeInput.value = socket.data.meta.time;
    hmrInput.value = Math.round(socket.data.meta.halfMassRadius);
});

importInput.onchange = async e => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    await fetch('/api/cluster/stars/', { method, body: formData });
};

exportButton.onclick = () => window.location.href = '/api/cluster/stars/';
