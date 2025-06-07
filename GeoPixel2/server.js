const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Statik dosyalarý 'public' klasöründen sun
app.use(express.static(path.join(__dirname, 'public')));

const MAP_WIDTH = 50;
const MAP_HEIGHT = 50;

// Harita: 0 = kara, 1 = su
let map = [];
for(let y = 0; y < MAP_HEIGHT; y++){
    let row = [];
    for(let x = 0; x < MAP_WIDTH; x++){
        if(x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1){
            row.push(1); // Su
        } else {
            row.push(0); // Kara
        }
    }
    map.push(row);
}

let players = {};

io.on('connection', (socket) => {
    console.log('Yeni oyuncu baðlandý:', socket.id);

    players[socket.id] = {
        x: Math.floor(MAP_WIDTH / 2),
        y: Math.floor(MAP_HEIGHT / 2),
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    socket.emit('init', { map, players });
    socket.broadcast.emit('playerJoined', { id: socket.id, player: players[socket.id] });

    socket.on('move', (dir) => {
        let player = players[socket.id];
        if(!player) return;

        let { x, y } = player;

        if(dir === 'up') y--;
        else if(dir === 'down') y++;
        else if(dir === 'left') x--;
        else if(dir === 'right') x++;

        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT && map[y][x] === 0) {
            player.x = x;
            player.y = y;
            io.emit('playerMoved', { id: socket.id, x, y });
        }
    });

    socket.on('disconnect', () => {
        console.log('Oyuncu ayrýldý:', socket.id);
        delete players[socket.id];
        io.emit('playerLeft', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalýþýyor.`);
});
