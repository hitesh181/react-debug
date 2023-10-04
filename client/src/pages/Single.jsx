import React, { useContext, useEffect, useState } from "react"
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import Menu from "../components/Menu"
import axios from "axios"
import moment from "moment"
import {AuthContext} from "../context/authContext"

export default function Single(){
  const navigate = useNavigate();
  const [post, setPost] = useState({});

  //const postId = useLocation().pathname.split('/')[2];

  const {currentUser} = useContext(AuthContext)
  const getText = (html)=>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent;
  }
  const postId = useParams().id;
  
  useEffect(() => {   
    console.log("post id  is ", postId)
    const fetchData = async () => {
      fetch(`/api/posts/${postId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data is ", data);
          setPost(data);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    };
    if(postId != "")
      fetchData();
  }, []);
  

  const handleDelete = async ()=>{
    try {
      await axios.delete(`/api/posts/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

    return (
        <div className="single">
        <div className="content">
          <img src={`../public/upload/${post?.postImg}`} alt=""/>

         <div className="user">
          {post.userImg &&
          <img src={`../public/upload/${post?.userImg}`} alt="" />
          }
          <div className="info">
           <span>{post?.username}</span>
           <p>Posted {moment(post.date).fromNow()} ago</p>
          </div>
          {currentUser?.username === post?.username && (
          <div className="edit">
                 <Link to={`/write?edit=2`} state={post}>
                <img src ={Edit} alt=""/>
                </Link>
                <img onClick ={handleDelete} src ={Delete} alt=""/>
          </div>
          )}
         </div>
            <h1>{getText(post.title)}</h1>
            {getText(post.des)}
        </div>
        {/* <Menu cat ={post.cat}/> */}
      </div>
      
    );
  };