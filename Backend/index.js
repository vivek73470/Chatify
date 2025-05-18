const express = require('express')
const connection = require('./config/db')
const userRouter = require('./routes/userroute')
const app = express();

const PORT = process.env.port || 4500;
app.use(express.json());

app.use('/user',userRouter)


app.get('/',(req,res)=>{
    return res.send('Heloo')
})

app.listen(PORT, async()=>{
    try{
        await connection;
        console.log("connected to db")
        console.log(`server running at ${PORT}`)


    }catch(e){
        console.log(e)
    }
})