import "./PostFragment.css";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import axios from "axios";

/**
 * TODO: ADD USE REF FOR THE FORM
 * TODO: MAKE POST FETCH
 *
 * */

function PostFragment({ user }) {
  const [resData, setResData] = useState({});
  const [success, setSuccess] = useState(false);

  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("text/plain");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user === undefined) {
      navigate("/");
    }

    const getData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/fragments`,
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

        setResData(res.data);
      } catch (err) {
        console.error("Unable to call GET /v1/fragments");
      }
    };

    getData();
  }, []);

  console.log(resData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(content);
    console.log(contentType);

    return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/fragments`,
        content,
        {
          headers: {
            // Include the user's ID Token in the request so we're authorized
            Authorization: `Bearer ${user.idToken}`,
            "Content-Type": contentType,
          },
        }
      );

      if (!res) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      console.log(res);
    } catch (err) {
      console.error("Unable to Create your Fragment.");
    }

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);

    event.target.reset();
    setContent("");
    setContentType("");
  };

  return (
    <>
      <h1>Hello {user && <> {user.username} </>}, lets create a Fragment!</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 mt-5" controlId="formBasicContent">
          <Form.Label>Fragment Content: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicContentType">
          <Form.Label>Content-Type: </Form.Label>

          <Form.Control
            as="select"
            aria-label="Default select example"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="text/plain" defaultValue={"text/plain"}>
              text/plain
            </option>
            <option value="text/markdown">text/markdown</option>
            <option value="text/html">text/html</option>
            <option value="application/json">application/json</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Your Image: </Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              setContent(e.target.value);
              setContentType(content.type);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {success && (
        <Alert key="success" variant="success" className="mb-3 mt-5">
          Fragment created!
        </Alert>
      )}
    </>
  );
}

export default PostFragment;
