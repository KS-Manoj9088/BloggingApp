const express=require('express')
const path=require('path')
const app=express()
const port=8000
const userroute=require('./routes/userroutes')
const blogroute=require('./routes/blog')
const mongoose=require('mongoose')
const connectDB=require("./config/dbconnection")
const cookieparser=require('cookie-parser')
const { checkforauth } = require('./middleware/auth')
const Blog=require('./models/blog')
app.use(express.static(path.resolve('./public')))

//app.use(express.static(path.resolve('./public')))
connectDB()
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))


app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())
app.use(checkforauth('token'))
app.use(express.json()); 


app.get('/', async(req,res)=>{

const allblogs=await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs:allblogs,
    })
})


app.use('/user',userroute)
app.use('/blog',blogroute)



app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
