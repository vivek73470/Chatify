<!-- Socket -->
What is Socket.IO really?
A persistent, bi-directional connection between browser and server

Unlike HTTP:
HTTP = request → response → done
Socket = connection stays open

So:
Server can talk to client anytime
Client can talk to server anytime

 <!-- Core Principles -->
 One socket connection per user
 Multiple components reuse the same socket
 Events are subscribed/unsubscribed cleanly
 HTTP APIs are source of truth
 Sockets are for realtime UI updates only

<!-- Who creates the connection? -->

<!-- Frontend -->
Browser(client) -io("http://localhost:4500") - Opens a WebSocket connection to the server
- Create socket ONCE, reuse it everywhere
- It is not connect every time -
- Safe to call 100 times
- Only ONE real connection

if (socket exists and connected)
  return it
if connection in progress
  wait for it
else
  create socket

<!-- Backend -->
Server - io.on("connection", socket => { ... })
- this runs immediately when io() connects from frontend
- happen before connect user 
- this happen even if we not emit anything

Server assigns socket.id
- Connection is now alive
- Server is waiting for events

At this point:
- Server knows a socket exists
- Server does NOT know which user it belongs to


<!-- Online users tracking (critical concept) -->
Why -  Map<userId, Set<socketId>>?

Because - 
- One user can open multiple tabs
- One user can open mobile + desktop
- Closing one tab ≠ user offline

Map {
  userId => Set(socketId1, socketId2)
}

<!-- Event subscription pattern (VERY IMPORTANT) -->
Rule - Every on() must have a matching off()


<!-- WHAT IS io? -->
where it exists - only on Backend
const io = new Server(server)

- What it represents
The Socket.io server
      Knows ALL connected users
      Can send messages to any socket
  Think of it like:
       Post office that knows all addresses

<!-- broadcast to ALL connected clients -->
io.emit

<!-- Send message using io -->
io.to(socketId).emit("event", data);

<!-- socket.on vs socket.emit -->
socket.emit - SEND event 
socket.on - LISTEN to event

<!-- ONE SENTENCE TO REMEMBER FOREVER -->
io manages everyone, socket manages one connection
socket.emit- sends - Client → Server OR Server → Client
socket.on- receives - Client → Server OR Server → Client
