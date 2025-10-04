
const express=require('express')
const {subscriptions}=require('../data/subscriptions.json')
const {users}=require('../data/users.json')
const router=express.Router()

// Dynamically update the status of the subscriptions
const now = new Date();
subscriptions.forEach(sub => {
    if(new Date(sub.endDate) < now && sub.status==="active"){
        sub.status="expired"
    }
});

// Utility: Standardized response format
function sendResponse(res, status, success, message, data = null) {
    res.status(status).json({ success, message, data });
}

router.post('/',(req,res)=>{

    const {subscriptionId,userId,serviceId,planType,startDate,endDate,status}=req.body
    if(typeof subscriptionId!='number' || typeof userId!='number' || typeof serviceId!='number' || typeof planType!='string' || typeof startDate!='string' || typeof endDate!='string' || typeof status!='string'){
        return sendResponse(res,400,false,"provide all info of required field");
    }

    const subId=subscriptions.find(sub=>sub.subscriptionId===subscriptionId)
    if(subId){
        return sendResponse(res,409,false,"subscriptionId already exists")
    }

    const userSub=subscriptions.find(sub => sub.userId===userId && sub.serviceId===serviceId);
    if(userSub){
        return sendResponse(res,409,false,"you already have an active plan on this service ",userSub)
    }

    subscriptions.push({subscriptionId,userId,serviceId,planType,startDate,endDate,status})
    return sendResponse(res,200,true,"subscriptions",subscriptions)
})

// Renew/Cancel subscription
router.put('/:Id',(req,res)=>{

})

router.get('/active',(req,res)=>{
    
    const activeSubscription=subscriptions.filter(sub=>sub.status==="active")
    if(!activeSubscription){
        return sendResponse(res,200,true,"There are no active subscription available");
    }
    sendResponse(res,200,true,"active subscription's",activeSubscription)
})

router.get('/expired',(req,res)=>{

    const expiredSubscription=subscriptions.filter(sub=>sub.status==="expired")
    if(expiredSubscription.length===0){
        return sendResponse(res,200,true,"There are no subscription's that are expired")
    }
    sendResponse(res,200,true,"Follwing subscriptions has bee expired",expiredSubscription)
})

module.exports=router;