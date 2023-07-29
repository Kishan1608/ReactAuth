import express from "express";
import bcrypt from 'bcryptjs';
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async( req, res ) => {
    const{fullName, username, email, password} = req.body;
    try {
        if(fullName === "" || username === "" || email === "" || password === ""){
            return res.status(400).json({error: "Please enter all required field"});
        }

        if(password.length < 6){
            return res.status(500).json({error: "Password length should be minimum of 6"});
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(500).json({error: 'User already exist'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName, 
            username,
            email,
            password: hashedPassword,
        })
        const savedUser = await newUser.save();

        //JWT token 
        const token = jwt.sign({
            id: savedUser._id
        }, process.env.JWT_SECRET);

        res.cookie("token", token,{httpOnly: true}).send();
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err});
    }
});

router.post('/login', async(req, res) => {
    const{email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(401).json({error: "Enter all required fields"});
        }

        let user = await User.findOne({email});

        if(!user){
            return res.status(500).json({error: 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(500).json({error: 'Invalid Credentials'});
        }

        //JWT token 
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET);

        res.cookie("token", token,{httpOnly: true}).send();
    } catch (error) {
        console.log(error);
    }
});

router.get('/loggedIn', async(req, res) => {
    try {
        const token = req.cookies.token;

        if(!token) return res.json(null);

        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(validatedUser.id);
        res.json(user);
    } catch (error) {
        return res.json(null);
    }
})


router.get("/logout", async(req,res) => {
    try {
        res.cookie("token", "", {httpOnly: true}).send();
    } catch (error) {
        return res.json(null)
    }
})


export default router;