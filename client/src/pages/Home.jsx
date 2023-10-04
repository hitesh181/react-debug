import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link, useLocation } from "react-router-dom";
export default function Home(){

  const [posts, setPosts] = useState([])
  
  const cat = useLocation().search

  /*whenever the query in search bar changes this funcitons is called,
   otherwise alag category pe click karne ke baad bhi kuch nahi hota tha
   bas searchstring badal jaati thi aur referesh karne padta tha
   */ 

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const res = await axios.get(`/api/posts/${cat}`)
        console.log(res.data)
        setPosts(res.data)
      }
      catch(err){
        console.log(err)
      }
  };
  fetchData();
  },[cat])

  console.log("Post is ", posts[0])

  const getText = (html)=>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent;
  }
    // const posts = [
    //       {
    //         id: 1,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //       },
    //       {
    //         id: 2,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //       },
    //       {
    //         id: 3,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //       },
    //       {
    //         id: 4,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //       },
    //     ];
    return (
        <div className="home">
          <div className="posts">
            {posts.length ? posts.map((post) => (
              <div className="post" key={post._id}>
                <div className="img">
                  <img src={`../public/upload/${post.img}`} alt="" />
                </div>
                <div className="content">
                  <Link className="link" to={`/post/${post._id}`}>
                    <h1>{post.title}</h1>
                  </Link>
                  <p>{getText(post.des)}</p>
                  <button>Read More</button>
                </div>
              </div>
            )):

            <h1 className="menu">No posts yet</h1>
            }
          </div>
        </div>
      );
    };
    