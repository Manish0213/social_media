import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./Profile.css";
import { UserContext } from "../App";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";
import {
  MDBInputGroup,
  MDBInputGroupText,
  MDBInputGroupElement,
  MDBBtn,
  MDBSpinner,
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-react-ui-kit";
const API_URL = import.meta.env.VITE_API_URL;
function Profile() {


  const { state, dispatch } = useContext(UserContext);
  const [myPosts, setMyPosts] = useState([]);
  const [userProfile, setProfile] = useState(null);

  const [title,setTitle] = useState("")
  const [about,setAbout] = useState("")
  const [image,setImage]=useState('')
  const [url,setUrl] = useState("")
  // console.log(state)


  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);



  useEffect(() => {
    fetch(API_URL+"/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.mypost)
        setMyPosts(result.mypost);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(API_URL+"/myprofile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
        // dispatch({type:"UPDATE",payload:result})
      });
  }, []);

  // <--- Edit profile functionality--->

  useEffect(()=>{

    if(url){
    fetch(API_URL+"/updateprofile",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
         name:title,
         about:about,
        // email:userProfile.email,
        // password:userProfile.password,
        // about:userProfile.about,
        // title:title,
        profilePic:url
      })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      localStorage.setItem("user",JSON.stringify(result))
      dispatch({type:"UPDATE",payload:result})
      setProfile(result)
      toggleShow();
    })
  }
  },[url])






const updateProfile=()=>{

  const data = new FormData();
        data.append("file",image)
        data.append("upload_preset","Social Media");
        data.append("clout_name","litho")
        // const CLOUDINARY_URL= "cloudinary://368377658676819:D2BPRnM_JiA79P18mnktu03f0cs@litho"
        fetch("https://api.cloudinary.com/v1_1/litho/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data);
            setUrl(data.url)
            // console.log(url)
        })
        .catch(err=>{
            console.log(err)
        })
}








  return (
    <div className="up_margin xyz">
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Edit Profile</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
          <input
          type="text"
          className="form-control mb-3"
          id="exampleFormControlInput1"
           placeholder="name"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-3"
          id="exampleFormControlTextarea1"
          rows="3"
          onChange={(e)=>setAbout(e.target.value)}
          value={about}
        ></textarea>
           <input type="file" className="form-control mb-3" placeholder="Upload an image" onChange={(e)=>{
          setImage(e.target.files[0]);
        }} />
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={toggleShow}>
              Close
            </MDBBtn>
            <MDBBtn onClick={updateProfile}>Update</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>

      {
        userProfile===null ?
        <div className="d-flex justify-content-center">
        <MDBBtn disabled>
          <MDBSpinner
            grow
            size="sm"
            role="status"
            tag="span"
            className="me-2"
          />
          Loading...
        </MDBBtn>
      </div>
      :
      <div>
      <div className="profile">
        <div className="profile_image">
        <img
src={userProfile.profilePic}
                alt="profilePic"
              />    
        </div>
        <div className="profile_info">
          <div className="profile_name">
            <h2>{userProfile.name}</h2>
            <MDBBtn className='m-1 shadow-0' style={{ backgroundColor: '#55acee' }}  onClick={toggleShow}>
            <i class="far fa-edit">Edit</i>
      </MDBBtn>
          </div>
          <div className="profile_followers">
            <h5>{myPosts.length} posts</h5>
            <h5>{userProfile.followers.length} followers</h5>
            <h5>{userProfile.following.length} following</h5>
          </div>
          <div className="profile_details">
            {/* <p>Ankit nagar</p> */}
            <div className="profile_details_description">
              <p>{userProfile.about}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="seperation_line"></div>

      <div className="profile_posts">
        <div className="profile_post">



          {   myPosts.length===0 ?
          <div>
          <h1>No posts yet</h1>
          </div>
          :
          
          myPosts.map((post) => {
            return (
              <MDBCol lg="4" md="12" className="mb-4 profile_post_image">
                {/* <img src={post.photo} className="img-fluid rounded" alt="" /> */}
                <div className='bg-image hover-zoom' style={{ maxWidth: '22rem' }}>
               <img src={post.photo}  className='w-100' />
             </div>
              </MDBCol>
               
            );
          })}
        </div>

      </div>
      </div>
}
    </div>
  );
}

export default Profile;
