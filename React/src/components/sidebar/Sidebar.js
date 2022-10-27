import "./Sidebar.css";
import { Outlet, Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

function Sidebar({ user, signOut }) {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Nav.Link as={Link} to="/">
          <Navbar.Brand>Fragments</Navbar.Brand>
        </Nav.Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid">
            <Nav.Item>
              <Nav.Link as={Link} to="/newFragment">
                Post Fragment
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/convert">
                Convert Fragment
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/view">
                View Fragment
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/viewAll">
                View All Fragments
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="ms-auto">
              <Nav.Link onClick={signOut}>Sign Out</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Outlet />
    </Navbar>
  );
}

export default Sidebar;
