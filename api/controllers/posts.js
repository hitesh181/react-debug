import express from "express";
// import {db} from "../db.js"
import  jwt from "jsonwebtoken";
import mongoose from "mongoose";
import pkg from 'mongodb';
const { ObjectId } = pkg;
// const { ObjectId } = require('mongodb');

import Post from "../models/Posts.js"

// ALL POSTS
export const getPosts =async (req, res)=>{ 

    // const q = req.query.cat ?
    // posts = await Post.find({cat:req.query.cat}) :
    // posts = await Post.find()

    //displaying specific category posts if cat presetn else displaying all
    let posts = await Post.find(req.query.cat && {cat:req.query.cat});

    if(posts){
        // console.log("posts are ", posts)
        return res.status(200).json(posts)
    }
    else
        return res.status(400).json("No posts ");
}

//INDIVIDUAL POSTS
export const getPost = async (req, res)=>{   
    console.log("on single post route")
    console.log(req.params)
    const {id} = req.params
    //const filter = { _id: new ObjectId(id)};
    const knownObjectId = new ObjectId("651c554670baed47d8b1e631");
    console.log(typeof(knownObjectId), knownObjectId)
    try{
        const post = await Post.findById(knownObjectId).populate("author",['username'])
        console.log(post)
        if(post){
            //console.log(post)
            return res.status(200).json(post)
        }
        else
            return res.status(404).json("Post not found ")
    }
    catch(err){
        console.log("Error ",err)
        return res.status(404).json({msg:"Post not found ",err})
    }
    
    //const q = "select  posts.id, username, title, des,cat, date, posts.img as postImg, users.img as userImg from users join posts on posts.uid = users.id where posts.id = ?"
    // db.query(q, [req.params.id], (err, data)=>{
    //     console.log(data)
    //     if(err) return res.status(404).json("Could not find post ")
    //     return res.status(200).json(data[0])
    // })
}

//ADD POST
export const addPost = async (req, res)=>{
    console.log("On Addpost Route")
    console.log(req.body)
    const {title, cat, des, img} = req.body

    
    console.log("Cookie is ", req.cookies)
    const token = req.cookies.access_token;

    if(!token)
        return res.status(401).json("Not Authenticated")

    jwt.verify(token,"jwtkey", async (err, userInfo)=>{
        if(err)return res.status(403).json("Token is not valid")
        console.log("userInfo is ", userInfo)  

        try{
            const newPost = await Post.create({
                title, 
                cat, 
                des,
                img,
                author:userInfo.id
            })
            if(newPost){
                console.log("new Post is ", newPost)
                return res.status(200).json(newPost)
            }
            else{
                console.log("Post counld not be created ", newPost)
                return res.status(400).json(newPost)
            }
        }
        catch(err){
            console.log("error occured ",err)
            res.status(400).json("error occured ",err)
        }
    })
 }


//DELETE POSTSS
export const deletePost =  (req, res)=>{
    console.log("Cookie is ", req.cookies)
    const token = req.cookies.access_token;
    if(!token)
        return res.status(401).json("Token is not valid")

    jwt.verify(token,"jwtkey", async (err, userInfo)=>{
        if(err)return res.status(403).json("Not Authenticated ")
        const postId = req.params.id
        console.log(postId)

        try{
            const deletedPost = await Post.deleteOne({_id : postId})
            console.log(deletedPost)
            if(deletedPost.deletedCount == 1){
                return res.status(200).json(deletedPost)
            }
            else if(deletedPost.deletedCount == 0){
                return res.status(400).json("No posts exist ")
            }
        }
        catch(err){
            console.log(err)
            return res.status(400).json({msg:"Could not delete ", err})
        }
    })
}

//UPDATE POST
export const updatePost = (req, res)=>{
    console.log("Cookie is ", req.cookies)
    console.log(req.body)
    const token = req.cookies.access_token;
    if(!token)
        return res.status(401).json("Not Authenticated")
 
    jwt.verify(token,"jwtkey", async (err, userInfo)=>{
        if(err)return res.status(403).json("Token is not valid")
        const postId = req.params.id;

            try {
            const filter = { _id: new ObjectId(postId) }; // Use ObjectId as a property, not a function
            const updateData = { $set: req.body }; // Use $set to update specific fields from the request body

            const updatedPost = await Post.updateOne(filter, updateData);

            if (updatedPost.modifiedCount === 1) {
                return res.status(200).json(updatedPost);
            } else {
                return res.status(400).json("Could not update");
            }
            } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "An error occurred" });
            }
    })
}

