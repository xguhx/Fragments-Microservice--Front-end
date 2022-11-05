import "./FragmentCard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Buffer } from "buffer";

import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function FragmentCard({ user, id, setReload }) {
  const [resData, setResData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    //Redirect if not Authenticated
    if (!user) {
      navigate("/");
    }

    //fetchData will make 2 Fetches to get data and metadata of the given fragment
    const fetchData = async () => {
      let data = {};
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/fragments/${id}/info`,
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

        //set fragment metadata
        data["fragment"] = res.data.fragment;
      } catch (err) {
        console.error("Unable to call GET /v1/fragments/id/Info");
      }

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/fragments/${id}`,
          {
            headers: {
              // Include the user's ID Token in the request so we're authorized
              Authorization: `Bearer ${user.idToken}`,
            },
            responseType: data.fragment.type.startsWith("text")
              ? "json"
              : "arraybuffer",
          }
        );

        if (!res) {
          throw new Error(`${res.status} ${res.statusText}`);
        }

        //set fragment data
        //if image, then convert it to base64
        data.fragment.type.startsWith("image")
          ? (data["data"] = `data:${
              res.headers["content-type"]
            };base64,${Buffer.from(res.data, "binary").toString("base64")}`)
          : (data["data"] = res.data);
      } catch (err) {
        console.error("Unable to call GET /v1/fragments/id");
      }

      setResData(data);
    };

    fetchData();
  }, [id, navigate, user]);

  const onClickDetail = () => {
    navigate("/view", { state: { data: resData } });
  };

  const onClickDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1/fragments/${id}`,
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
      console.error("Unable to call Delete Fragment: " + id);
    }

    setReload(true);
  };

  return (
    <Container fluid="md">
      <Card style={{ width: "18rem" }} className="text-center">
        <Card.Header>ID: {resData && resData.fragment.id}</Card.Header>

        {resData && resData.fragment.type.startsWith("text/") && (
          <Card.Title>{resData && resData.data}</Card.Title>
        )}
        {resData && resData.fragment.type.startsWith("image/") && (
          <Card.Img variant="top" src={resData.data} />
        )}
        <Card.Body>
          <Row>
            <Col>
              <Button onClick={onClickDetail}> Details </Button>
            </Col>
            <Col>
              <Button onClick={onClickDelete}> Delete</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FragmentCard;
