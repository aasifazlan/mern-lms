import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const signup= async (req, res)=>{
    try {
        const {name, password, username, email } = req.body
        if(!name, !username, !password, !email){
            return res.status(400).json({msg: 'All fields are required'})
        }
        const existingUser= await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({msg: 'User already exists'})
        }
         const existingUsername= await User.findOne({username: username})
         if(existingUsername){
            return res.status(400).json({msg: 'Username already exists'})
        }

        if(password.length < 6){
            return res.status(400).json({msg: 'Password must be at least 6 characters long'})
        }
        const salt= await bcryptjs.genSalt(10)
        const hashedPassword= await bcryptjs.hash(password, salt)
        const user= new User(
            {
                name,
                password: hashedPassword,
                username,
                email
            }
        )
        await user.save()
        const token= jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        await res.cookie("jwt-lms-udemy",token,{
            httpOnly:true,
            maxAge: 1*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV
        })
        res.json({msg: 'User registered successfully', user})

    } catch (error) {
        console.log("Found some errors in signupController", error.message)
        res.status(500).json({message: 'Server error'})
    }
}

export const login=async (req, res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({msg: 'All fields are required'})
        }
        const user= await User.findOne({email: email})
        if(!user){
            return res.status(401).json({msg: 'Invalid credentials'})
        }
        const isMatch= await bcryptjs.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({msg: 'Invalid credentials'})
        }
        const token= jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
         await res.cookie("jwt-lms-udemy", token, {
            httpOnly:true,
            maxAge: 1*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV
         })
         res.json({message: 'User logged in successfully', user})

    } catch (error) {
        console.log("Error in login Controller", error.message)
        res.status(500).json({message: 'Server error'})
    }
}

export const logout=async (req, res)=>{
    try {
        res.clearCookie("jwt-lms-udemy")
        res.json({msg: 'User logged out successfully'})
    } catch (error) {
        console.log("Error in login Controller", error.message)
        res.status(500).json({message: 'Server error'})
    }
}