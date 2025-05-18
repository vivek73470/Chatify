const express = require('express')
const connection = require('./config/db')
const app = express();

const PORT = process.env.port || 4500;


app.get('/',(req,res)=>{
    return res.send('Heloo')
})

app.listen(PORT, async()=>{
    try{
        await connection;
        console.log("connected to db")

    }catch(e){
        console.log(e)
    }
})