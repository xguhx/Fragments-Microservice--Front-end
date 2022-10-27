import "./Sidebar.css";
import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Sidebar(props) {
  console.log(props.user);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand>Fragments</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid">
            <Nav.Item>
              <Nav.Link as={Link} to="/">
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
              <Nav.Link as={Link} to="/logout">
                Sign Out
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Outlet />
    </Navbar>
  );
}

export default Sidebar;
