const mongoose = require('mongoose');
require('dotenv').config()

const mongoUri =
  process.env.mongoURL ||
  process.env.MONGO_URL ||
  process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    'MongoDB URI missing. Set one of: mongoURL, MONGO_URL, or MONGODB_URI.'
  );
}

const connection = mongoose.connect(mongoUri);

module.exports = connection;


// const mongoose = require('mongoose');
// require('dotenv').config()

// const connection = mongoose.connect(process.env.mongoURL);

// module.exports= connection
