const express = require('express')
const http = require('http');
const { Server } = require('socket.io')
const {initSocket} = require("./socket/index.js");

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
app.use(cors({ origin: "*" }))
app.use('/', routes)

initSocket(io);



server.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to db")
    console.log(`server running at ${PORT}`)
  } catch (e) {
    console.log(e)
  }
})