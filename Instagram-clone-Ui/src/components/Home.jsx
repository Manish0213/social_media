import React, { useEffect,useContext,useState} from 'react'
import './Home.css';
import { Container } from 'react-bootstrap'
import {UserContext} from '../App'
import {
  MDBInputGroup,
  MDBInputGroupText,
  MDBInputGroupElement,
  MDBBtn,
  MDBSpinner
  
} from 'mdb-react-ui-kit';
import {Link} from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;
function Home() {

  
  const {state,dispatch} = useContext(UserContext)
  // console.log(state) 
  const [posts,setPosts] = useState([])


  useEffect(()=>{
  fetch(API_URL+'/allposts',{
    headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
  }).then(res=>res.json())
  .then(data=>{
    console.log(data)
    setPosts(data.posts)
  })
},[])


const likePost = (id)=>{
  fetch(API_URL+'./like',{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId:id
    })
  }).then(res=>res.json())
  .then(result=>{
    console.log(result);
    // setLikes(result.likes.length);
    const newData = posts.map(item=>{
      if(item._id === result._id){
        return result
      }else{
        return item
    }
  })
  // console.log(newData)
  setPosts(newData);
})
}

const unlikePost = (id)=>{
  fetch(API_URL+'./unlike',{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId:id
    })
  }).then(res=>res.json())
  .then(result=>{
    const newData = posts.map(item=>{
      if(item._id === result._id){
        return result
      }else{
        return item
    }
  })
  setPosts(newData);
  })
}

const makeComment=(text,postId)=>{
 
fetch(API_URL+'/comment',{
  method:"put",
  headers:{ // important for authorization to work
    "content-type": "application/json",
    "Authorization":"Bearer "+localStorage.getItem("jwt")
  },
  body:JSON.stringify({ // what we are sending to api
    postId,
    text
  })
}).then(res=>res.json())
.then(result=>{
// console.log(result);
const newData = posts.map(item=>{
  if(item._id === result._id){
    return result
  }else{
    return item
}
})
setPosts(newData);
}).catch(err=>{
  console.error(err);
})

}

console.log(posts)

const deletePost = (postid)=>{
  fetch(`${API_URL}/deletepost/${postid}`,{
      method:"delete",
      headers:{
          Authorization:"Bearer "+localStorage.getItem("jwt")
      }
  }).then(res=>res.json())
  .then(result=>{
      console.log(result)
      const newData = posts.filter(item=>{
          return item._id !== result._id
      })
      setPosts(newData)
  })
}

const deletePostComment = (postid,commentId)=>{
  console.log(postid,commentId)
  fetch(`${API_URL}/deletecomment/${postid}/${commentId}`,{
      method:"put",
      headers:{
          Authorization:"Bearer "+localStorage.getItem("jwt")
      }
  }).then(res=>res.json())
  .then(result=>{
      console.log(result)
      
      const newData = posts.map(item=>{
          if(item._id === result._id){
              return result
          }else{
              return item
          }
      })
      setPosts(newData)
  })
}



  return (
    <Container className="up_margin">
   {
     posts.length ===0 ?
      
     <div className="d-flex justify-content-center">
     <MDBBtn disabled>
        <MDBSpinner grow size='sm' role='status' tag='span' className='me-2' />
        Loading...
      </MDBBtn>
      </div>

     :

      
      posts.map(post=>{
        return(
          <div>
           
            <div className="d-flex justify-content-center mb-5" key={post._id}>
    <div className="card w-50  custom-border p-3 shadow-0" >
      
      <div className="d-flex justify-content-between mb-1">
        <div className="d-flex align-items-center">
          <div className="border rounded-circle">
        <img
  src={post.postedBy.profilePic}
  class=" post_logo"

  
  alt="Avatar"
/>
</div>
      <h3 className="post_heading_name ms-3"><Link to={ state._id===post.postedBy._id ? '/profile'  :`/profile/${post.postedBy._id}`} >{post.postedBy.name}</Link></h3>
          </div>

      { 
        post.postedBy._id === state._id  &&
        
      <MDBBtn className='shadow-0 ankit' color='danger' onClick={()=>deletePost(post._id)}>
        Delete
      </MDBBtn>

      }
      </div>
    
  <img src={post.photo} className="card-img-top" alt="..."/>
  <div className="post_logos">
    {
      post.likes.includes(state._id) ?
      <i className="fas fa-heart   like" onClick={()=>{unlikePost(post._id)}}></i>
      :<i className="far fa-heart  not_like" onClick={()=>likePost(post._id)}></i>
    }
  </div>

  <div className="p-1">
    {
      post.likes.length >0 &&
      <p className="">{post.likes.length} likes</p>
    }
    <h5 className="">{post.title}</h5>
    <h6 className="">{post.body}</h6>
    { post.comments.length >0 && 
    <div className="fw-light fst-italic">comments</div>
      }
 { 
 post.comments.map((comment)=>{
   return (
     <div>
        {(comment.postedBy._id === state._id)  && <i class="fas fa-trash" onClick={()=>{deletePostComment(post._id,comment._id)}}></i>  }
  <span className="fw-bold">  {comment.postedBy.name}</span> <span>{comment.text}</span>
   </div>
   )
 })
 }
    <form
    onSubmit={(e)=>{
      e.preventDefault();
      // console.log(e.target[0].value); to get the value
      makeComment(e.target[0].value,post._id)
      e.target[0].value='';
     
    }}>
    <MDBInputGroup className='mb-3'>
        <MDBInputGroupElement placeholder="Add a comment..." type='text' />
        <MDBBtn outline  >Post</MDBBtn>
      </MDBInputGroup>
      </form>
  </div>
</div>
</div>
          </div>
        )
      })
    }
  
     
    </Container>
  )
}

export default Home