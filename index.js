const express = require('express');
const app=express();
const path=require('path');
const userRoute=require('./routes/user');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const blogRoute=require('./routes/blog');
const Blog=require('./models/blog')


app.set('view engine','ejs')//ejs setup
app.set('views',path.resolve("./views"))//ejs setup

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')))

mongoose.connect('mongodb://localhost:27017/blogify').then(e=>console.log("MongoDB connected"))

app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    })
})

app.listen(8000,()=>console.log("server started on port 8000"));
