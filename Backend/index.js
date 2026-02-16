const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connection = require('./config/db');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

// Ensure DB is connected before handling requests in serverless/runtime.
app.use(async (req, res, next) => {
  try {
    await connection;
    next();
  } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/', routes);

// Export app for Vercel serverless.
module.exports = app;

// Local development server (not used by Vercel).
if (require.main === module) {
  const PORT = process.env.PORT || 4500;

  app.listen(PORT, async () => {
    try {
      await connection;
      console.log('connected to db');
    } catch (error) {
      console.log(error);
    }
    console.log(`server running on port ${PORT}`);
  });
}



// const express = require('express')
// const http = require('http');
// const { Server } = require('socket.io')
// const { initSocket } = require("./socket/index.js");

// const connection = require('./config/db')
// const routes = require('./routes/index')
// const cors = require('cors');
// const PORT = process.env.PORT || 4500;

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// })

// app.use(express.json());
// app.use(cors({ origin: "*" }))
// app.use('/', routes)

// // runs ONCE when backend starts.
// initSocket(io);



// server.listen(PORT, async () => {
//   try {
//     await connection;
//     console.log("connected to db")
//     console.log(`server running at ${PORT}`)
//   } catch (e) {
//     console.log(e)
//   }
// })