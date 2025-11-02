import express from 'express';
import multer from 'multer';
import { config } from 'dotenv';
import { v4 as uuid } from 'uuid';
import { WebSocketServer } from 'ws';
import { cluster } from './cluster.js';

config({ path: './data/server.env' });
const { PORT } = process.env;
const app = express();
app.use(express.json());
app.use(express.static('./public/'));
app.get('/api/cluster/stars/', (_req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename="cluster.json"');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(cluster.stars, null, 4));
});

const upload = multer({ storage: multer.memoryStorage() });

app.put('/api/cluster/stars/', upload.single('file'), (req, res) => {
    cluster.stars = JSON.parse(req.file.buffer.toString('utf8'));
    cluster.meta.mass = cluster.stars.reduce((sum, star) => sum + star.mass, 0);
    cluster.meta.time = 0;
    cluster.params();
    return res.status(200).json(true);
});

app.get('/api/cluster/display/', (_req, res) => res.status(200).json(cluster.display));
app.put('/api/cluster/display/', (req, res) => {
    cluster.display = { ...cluster.display, ...req.body };
    return res.status(200).json(true);
});

const server = app.listen(PORT, () => console.log(`Server is up and listening on port ${PORT}...`));
const socketServer = new WebSocketServer({ server });
const sockets = {};
socketServer.on('connection', socket => {
    const id = uuid();
    sockets[id] = socket;
    socket.on('close', () => delete sockets[id]);
});

const pause = () => new Promise(resolve => setImmediate(resolve));

while (true) {
    if (!(cluster.meta.time % 1000)) cluster.params(30);
    if (!(cluster.meta.time % 100)) for (const id in sockets) sockets[id].send(cluster.json());
    cluster.step(0.01);
    await pause();
}
