const express=require('express')

const router=express()
const authRouter=require('../routes/auth')

//auth route for authentication
router.use('/auth',authRouter)

module.exports=router