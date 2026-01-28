<!-- Socket -->

io = server (the post office)
socket = one connected user (one phone)

<!-- WHAT IS io? -->
where it exists - only on Backend
const io = new Server(server)

<!-- What it represents -->
The Socket.io server
      Knows ALL connected users
      Can send messages to any socket
  Think of it like:
      📮 Post office that knows all addresses

<!-- What you do with io -->
io.on("connection", (socket) => {
  ...
}); - When ANY user connects, give me their socket

<!-- Send message using io -->
io.to(socketId).emit("event", data);

<!-- WHAT IS socket? -->
Where it exists - Both frontend & backend - ONE connected user

<!-- socket on BACKEND -->
io.on("connection", (socket) => {
  console.log(socket.id);
});

<!-- socket on FRONTEND -->
const socket = io(BASE_URL);


<!-- socket.on vs socket.emit -->
socket.emit - SEND event - socket.emit("addUser", userId);
socket.on - LISTEN to event  - socket.on("connect", () => {
  console.log("Connected");
});


<!-- ONE SENTENCE TO REMEMBER FOREVER -->
io manages everyone, socket manages one connection
emit sends, on receives