const express = require('express');
const app = express();
const cors = require("cors");
const http = require('http').Server(app);
const PORT = 8080;
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const KVStore = {};
app.use(cors());

io.on("connection", (socket) => {
  KVStore[socket.id] ||= 'guest'
  socket.emit("user id", KVStore[socket.id]);

  // socket.emit("user id", () => {
  //   return socket.id + "test" // replace with kv search
  // });
  socket.on('set user id', ({ username }) => {
    socket.username = username;
    KVStore[socket.id] = username;
    // socket.emit('new username', user);
    obj = {};
    obj[socket.id] = username;
    io.emit('username', obj );
  })
  socket.on("sendMessage", (body) => {
    console.log(body)
    io.emit("message", body);
  });
});

app.get('/connect', (req, res) => {
  res.send("connected")
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});