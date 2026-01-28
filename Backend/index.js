const express = require('express')
const http = require('http');
const { Server } = require('socket.io')

const connection = require('./config/db')
const routes = require('./routes/index')
const cors = require('cors');
const PORT = process.env.port || 4500;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(express.json());

app.use(cors({
  origin: "*"
}))

app.use('/', routes)

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit(
      "getOnlineUsers",
      Array.from(onlineUsers.keys())
    );
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit(
      "getOnlineUsers",
      Array.from(onlineUsers.keys())
    );
  });
});



server.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to db")
    console.log(`server running at ${PORT}`)
  } catch (e) {
    console.log(e)
  }
})