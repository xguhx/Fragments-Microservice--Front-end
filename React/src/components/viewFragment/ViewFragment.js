import "./ViewFragment.css";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";

import axios from "axios";

//TODO
//ADD UPDATE FRAGMENT BUTTON
//ADD CONVERT FRAGMENT BUTTON

function ViewFragment({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const data = location.state.data.data;
  const fragment = location.state.data.fragment;

  const onClickDelete = async () => {
    const confirmed = window.confirm("Are you sure?");

    if (!confirmed) {
      return;
    }
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1/fragments/${fragment.id}`,
        {
          headers: {
            // Include the user's ID Token in the request so we're authorized
            Authorization: `Bearer ${user.idToken}`,
          },
        }
      );

      if (!res) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Unable to call Delete Fragment: " + fragment.id);
    }

    navigate("/viewAll");
  };

  const onClickUpdate = () => {
    navigate("/newFragment", {
      state: { data: data, fragment: fragment },
    });
  };

  const onClickConvert = () => {
    navigate("/convert", {
      state: { user: user, data: data, fragment: fragment },
    });
  };

  return (
    <div className="ViewFragment">
      <Container fluid="md">
        <Card>
          <Card.Header>
            Details for Fragment{" "}
            <strong>{user && fragment && fragment.id}</strong>
          </Card.Header>

          {user && fragment && fragment.type.startsWith("text/") && (
            <Card.Title className="text-center m-3">{data}</Card.Title>
          )}
          {user && data && fragment.type.startsWith("image/") && (
            <Card.Img
              className="mx-auto m-3"
              style={{ width: "auto", maxWidth: "70%" }}
              variant="top"
              src={data}
            />
          )}
          <Card.Body>
            <ListGroup variant="flush">
              {user &&
                location &&
                Object.entries(fragment).map(([key, value]) => {
                  return (
                    <div key={key}>
                      <ListGroup.Item>
                        <strong>
                          {key === "ownerId"
                            ? "Owner"
                            : key.charAt(0).toLocaleUpperCase() +
                              key.substring(1)}
                        </strong>
                        :{" "}
                        {key === "ownerId"
                          ? user.username
                          : key === "created" || key === "updated"
                          ? new Date(value).toString()
                          : value}
                        {key === "size" && " bytes"}
                      </ListGroup.Item>
                    </div>
                  );
                })}
            </ListGroup>

            <Row className="text-center m-3">
              <Col>
                <Button onClick={onClickUpdate}> Update </Button>
              </Col>
              <Col>
                <Button onClick={onClickConvert}> Convert </Button>
              </Col>
              <Col>
                <Button onClick={onClickDelete}> Delete </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ViewFragment;
