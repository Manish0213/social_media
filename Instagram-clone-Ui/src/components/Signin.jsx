import React, { useState, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import "./container.css";
function Signin() {
  const { state, dispatch } = useContext(UserContext);
  // console.log(useContext(UserContext))
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(API_URL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const navigate = useNavigate();
  const handleemail = (event) => {
    setEmail(event.target.value);
  };
  const handlepassword = (event) => {
    setPassword(event.target.value);
  };

  const PostData = () => {
    fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setToastMsg(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          navigate("/");
        }
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Form className="up_margin xyz">
        <Container>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              onChange={handleemail}
              value={email}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={handlepassword}
              value={password}
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Link to="/signup">Don't have an account? Sign up</Link>
          </Form.Group>
          <Button variant="primary" type="button" onClick={() => PostData()}>
            Submit
          </Button>
          <div>
            <br></br>
            sample id : "a@gmail.com" and password : "a"
          </div>
        </Container>
      </Form>

      <div className="toast-message text-center text-danger">{toastMsg}</div>
    </>
  );
}

export default Signin;
