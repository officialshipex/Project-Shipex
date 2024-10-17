const express=require('express')

const router=express()
const authRouter=require('../routes/auth')
router.use('/auth',authRouter)

module.exports=router