const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Sign-in route
router.get('/signin', (req, res) => {
    return res.render('signin');
});

// Sign-up route
router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.post('/signin',async (req,res)=>{
    const {email,password}=req.body
    try{
    const token = await User.matchpasswordandgeneratetoken(email,password)
    return res.cookie('token',token).redirect("/")
    } catch(error){
        return res.render("signin",{
            error:"Incorrect Email or Password",
        })
    }

})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})


router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        await User.create({ fullname, email, password });

        return res.redirect("/");
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
