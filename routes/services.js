
const express=require('express')
const {services}=require('../data/services.json');
const { param } = require('./users');
const router=express.Router()

// Utility: Standardized response format
function sendResponse(res, status, success, message, data = null) {
    res.status(status).json({ success, message, data });
}

router.get('/',(req,res)=>{
    res.status(200).json({
        success: true,
        data: services
    })
})

router.post('/',(req,res)=>{
    const {serviceId,name,description,basePrice}=req.body
    if(typeof serviceId!='number' || typeof name!='string' || typeof description!='string' || typeof basePrice!='number'){
        return sendResponse(res,400,false,"Provide all required fields");
    }

    const service=services.find(ser=>ser.serviceId===serviceId)
    if(service){
        return sendResponse(res,409,false,"specified service is already available");
    }

    services.push({serviceId,name,description,basePrice})
    sendResponse(res,201,true,"successfully registered a new service")
})

router.get('/:serviceId',(req,res)=>{
    const id=parseInt(req.params.serviceId)
    const service=services.find(ser=>ser.serviceId===id)

    if(!service){
        return sendResponse(res,404,false,"Service not found")
    }
    sendResponse(res,200,true,"Service",service)
})

router.put('/:id',(req,res)=>{
    const id=parseInt(req.params.id)
    const index=services.findIndex(ser=>ser.serviceId===id)
    
    if(index===-1){
        return sendResponse(res,404,"Service not found")
    }
    services[index]={
        ...services[index],
        ...req.body
    }
    sendResponse(res,200,true,"successfully updated a service",services[index])
})

module.exports=router;