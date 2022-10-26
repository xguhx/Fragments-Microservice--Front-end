import "./Sidebar.css";
import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Sidebar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to="/">Fragments</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link to="/">Post Fragment</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/convert">Convert Fragment</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/view">View Fragment</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/viewAll">View All Fragments</Link>
            </Nav.Link>

            <Outlet />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Sidebar;
