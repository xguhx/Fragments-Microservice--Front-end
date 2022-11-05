import "./PostFragment.css";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import axios from "axios";
import { setFormOrder } from "@aws-amplify/ui";

/**
 * TODO: ADD USE REF FOR THE FORM
 * TODO: MAKE POST FETCH
 *
 * */

function PostFragment({ user }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [contentType, setContentType] = useState("text/plain");

  const navigate = useNavigate();
  const location = useLocation();

  const editing = location.state ? true : false;

  useEffect(() => {
    if (!user || user === undefined) {
      navigate("/");
    }

    if (editing) {
      location.state.fragment.type.startsWith("text")
        ? setContent(location.state.data)
        : setImage("");

      setContentType("text/plain");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //Validate Input

    if (content === "" && image === "") {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);

      return;
    }

    try {
      const res = editing
        ? await axios.put(
            `${process.env.REACT_APP_API_URL}/v1/fragments/${location.state.fragment.id}`,
            image !== "" ? image : content,
            {
              headers: {
                // Include the user's ID Token in the request so we're authorized
                Authorization: `Bearer ${user.idToken}`,
                "Content-Type": contentType,
              },
            }
          )
        : await axios.post(
            `${process.env.REACT_APP_API_URL}/v1/fragments`,
            image !== "" ? image : content,
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

      event.target.reset();
      setContent("");
      setImage("");
    } catch (err) {
      console.log(err);
      setError2(true);
      setTimeout(() => {
        setError2(false);
      }, 3000);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <>
      <h1>
        Hello {user && <> {user.username} </>}, lets{" "}
        {editing ? "update" : "create"} a Fragment!
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 mt-5" controlId="formBasicContent">
          <Form.Label>Fragment Content: </Form.Label>
          <Form.Control
            type="text"
            placeholder={content !== "" ? content : "Enter content"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicContentType">
          <Form.Label>Content-Type: </Form.Label>

          <Form.Select
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
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Or Upload Your Image: </Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setContentType(e.target.files[0].type);
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

      {error && (
        <Alert key="incompleteForm" variant="danger" className="mb-3 mt-5">
          Please, complete the form before submitting!
        </Alert>
      )}

      {error2 && (
        <Alert key="error" variant="danger" className="mb-3 mt-5">
          Unable to {editing ? "update" : "create"} Fragment, please contact
          support!
        </Alert>
      )}
    </>
  );
}

export default PostFragment;
