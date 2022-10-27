import "./PostFragment.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import axios from "axios";

/**
 * TODO: ADD USE REF FOR THE FORM
 * TODO: MAKE POST FETCH
 *
 * */

function PostFragment({ user }) {
  const [resData, setResData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
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

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicContent">
          <Form.Label>Fragment Content: </Form.Label>
          <Form.Control type="text" placeholder="Enter content" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicContentType">
          <Form.Label>Content-Type: </Form.Label>

          <Form.Select aria-label="Default select example">
            <option value="text/plain" selected>
              text/plain
            </option>
            <option value="text/markdown">text/markdown</option>
            <option value="text/html">text/html</option>
            <option value="application/json">application/json</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Your Image: </Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default PostFragment;
