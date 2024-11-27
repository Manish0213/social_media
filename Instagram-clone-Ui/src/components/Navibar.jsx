import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import "./container.css";

function Navibar() {
  const { state, dispatch } = useContext(UserContext);
  if("state",state);

  const renderList = () => {
    if (state) {
      return [
        <Nav.Link key="home" className="h5 px-4 navbar-font"><Link to="/"><i className="fas fa-home"></i>Home</Link></Nav.Link>,
        <Nav.Link key="profile" className="h5 px-4"><Link to="/profile"><i className="fas fa-user"></i>Profile</Link></Nav.Link>,
        <Nav.Link key="createpost" className="h5 px-4"><Link to="/createpost"><i className="fas fa-plus-circle"></i>Add post</Link></Nav.Link>,
        <Nav.Link
          key="logout"
          className="h5 px-4"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "LOGOUT" });
          }}
        >
          <Link to="/signin"><i className="fas fa-sign-out-alt"></i>Logout</Link>
        </Nav.Link>
      ];
    } else {
      return [
        <Nav.Link key="signup" className="h5"><Link to="/signup">Signup</Link></Nav.Link>,
        <Nav.Link key="signin" className="h5"><Link to="/signin">Signin</Link></Nav.Link>
      ];
    }
  };

  return (
    <>
      <Navbar bg="light" variant="light" className="fixed-top">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand className="brand-logo"><Link to={state ? '/' : '/signin'}>GoSocial</Link></Navbar.Brand>
          <Nav>
            {renderList()}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navibar;
