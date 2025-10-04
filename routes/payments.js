
const express=require('express')
const {payments}=require('../data/payments.json');
const router=express.Router()
let newPaymentId=150

// Utility: Standardized response format
function sendResponse(res, status, success, message, data = null) {
    res.status(status).json({ success, message, data });
}

router.get('/:id',(req,res)=>{
    const id=parseInt(req.params.id)
    const payment=payments.find(pay=>pay.paymentId===id)

    if(!payment){
        return sendResponse(res,404,false,"Payment dosen't exists with this id")
    }
    sendResponse(res,200,true,"Payment Details",payment)
})

router.post('/',(req,res)=>{
    
    const {paymentId,subscriptionId,amount,currency,paymentDate,status,method,transactionRef}=req.body

    if(typeof paymentId!='number' || typeof subscriptionId!='number' || typeof amount!='number' || typeof currency!='string' || typeof paymentDate!='string' || typeof status!='string' || typeof method!='string' || typeof transactionRef!='string'){
        return sendResponse(res,400,false,"Please fill all required fields")
    }
    const payment=payments.find(pay=>pay.paymentId===paymentId)
    if(payment){
        return sendResponse(res,409,false,"Payment already exists with this id",payment)
    }
    payments.push({paymentId,subscriptionId,amount,currency,paymentDate,status,method,transactionRef})
    return sendResponse(res,200,true,"payment successful")
})

module.exports=router;