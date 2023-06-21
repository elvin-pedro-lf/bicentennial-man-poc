import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import homeIcon from "../assets/img/home.png";
import workoutIcon from "../assets/img/workout.png";
import historyIcon from "../assets/img/history.png";
import connectIcon from "../assets/img/connect.png";

const NavBar = () => {
  return (
    <Navbar bg="light" variant="dark" fixed="bottom">
      <Container>
        <Navbar.Brand></Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link style={{ float: "right" }}>
            <Link to="/">
              <img src={homeIcon} alt="Home" width="20" />
              <br />
              Home
            </Link>
          </Nav.Link>
          <Nav.Link style={{ float: "right" }}>
            <Link to="/client/workouts">
              <img src={workoutIcon} alt="My Workouts" width="20" />
              <br />
              My Workouts
            </Link>
          </Nav.Link>
          <Nav.Link style={{ float: "right" }}>
            <Link to="/client/history">
              <img src={historyIcon} alt="History" width="20" />
              <br />
              History
            </Link>
          </Nav.Link>
          <Nav.Link style={{ float: "right" }}>
            <Link to="/">
              <img src={connectIcon} alt="Connect" width="20" />
              <br />
              Connect
            </Link>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
