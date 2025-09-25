const express=require('express');

const PORT=8002;

const app=express()

app.use(express.json())

app.get('/users',(req,res)=>{
    res.status(200).json({
        message: "This is home page"
    })
})

app.listen(PORT,()=>{
    console.log(`server is up and running on http://localhost:${PORT}`);
})