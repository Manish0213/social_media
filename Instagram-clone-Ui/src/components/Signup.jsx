import React,{useEffect, useState,} from 'react'
import {Form,Button, Container  } from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom'
import './container.css'
// import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL;
function Signup() {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [toastMsg,setToastMsg]=useState('')

  const navigate=useNavigate();
const handleemail=(event)=>{
setEmail(event.target.value)
}
const handlepassword=(event)=>{
  setPassword(event.target.value)
  }
const handlename = (event)=>{
  setName(event.target.value)
}
 


 const PostData = ()=>{
   fetch(`${API_URL}/signup`,{
method:'POST',
headers:{
"content-type":"application/json"
},
body:JSON.stringify({
  name:name,
  email:email,
  password:password
   })
 }).then(res=>res.json())
 .then(data=>{
   if(data.error){
  setToastMsg(data.error);
   }else{
    navigate('/signin')
   }
  console.log(data);
 }).catch(err=>{
   console.log(err)
 })
}


  return (
    <Form className="up_margin xyz">
    <Container>
    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Name</Form.Label>
    <Form.Control type="email" value={name} onChange={handlename} placeholder="Enter name" />

  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" onChange={handleemail} placeholder="Enter email" />

  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" onChange={handlepassword} placeholder="Password" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
   <Link to="/signin">Already have an account ? Signin</Link> 
  </Form.Group>
  <Button variant="primary" type="button" onClick={()=>PostData()}>
    Submit
  </Button>
  <p className="text-danger mt-3">{toastMsg}</p>

  </Container>
</Form>
  )
}

export default Signup