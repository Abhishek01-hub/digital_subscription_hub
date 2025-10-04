const express=require('express');

const usersRouter=require('./routes/users.js')
const servicesRouter=require('./routes/services.js')
const subscriptionsRouter=require('./routes/subscriptions.js')
const paymentRouter=require('./routes/payments.js')


const PORT=8002;

const app=express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).json({
        message: "This is home page"
    })
})

app.use('/users',usersRouter);
app.use('/services',servicesRouter);
app.use('/subscriptions',subscriptionsRouter);
app.use('/payments',paymentRouter);

app.use((req,res)=>{
    res.status(500).json({
        message:"Not Built Yet"
    })
})

app.listen(PORT,()=>{
    console.log(`server is up and running on http://localhost:${PORT}`);
})