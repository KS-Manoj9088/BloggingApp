const express = require('express');
const path = require('path');
const app = express();
const userroute = require('./routes/userroutes');
const blogroute = require('./routes/blog');
const mongoose = require('mongoose');
const connectDB = require("./config/dbconnection");
const cookieparser = require('cookie-parser');
const { checkforauth } = require('./middleware/auth');
const Blog = require('./models/blog');
const serverless = require('serverless-http'); // ✅ REQUIRED FOR VERCEL

require("dotenv").config(); // Optional: use .env file for MongoDB URI

// DB Connection
connectDB();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(checkforauth('token'));
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
    const allblogs = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allblogs,
    });
});

app.use('/user', userroute);
app.use('/blog', blogroute);

// REMOVE app.listen() — Vercel handles this internally
// Instead, export the handler
module.exports.handler = serverless(app);  // ✅ THIS ENABLES SERVERLESS DEPLOYMENT
