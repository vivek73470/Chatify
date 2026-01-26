const express = require('express')
const connection = require('./config/db')
const routes = require('./routes/index')
const chatRouter  = require('./routes/chatRoute')
const messageRouter  = require('./routes/messageRoute')
const cors = require('cors');
const app = express();

const PORT = process.env.port || 4500;
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.use('/', routes)

// app.use('/user',userRouter)
// app.use('/chats',chatRouter)
// app.use('/message',messageRouter)


app.listen(PORT, async()=>{
    try{
        await connection;
        console.log("connected to db")
        console.log(`server running at ${PORT}`)


    }catch(e){
        console.log(e)
    }
})