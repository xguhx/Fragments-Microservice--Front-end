import "./ViewFragments.css";
import FragmentCard from "../smallerComponents/fragmentCard/FragmentCard";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";

function ViewFragments({ user }) {
  const [resData, setResData] = useState();
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
        console.error("Unable to call GET /v1/fragments: " + err);
      }
    };

    getData();
  }, []);

  return (
    <div className="ViewFragments">
      <h1>Hello {user && <> {user.username} </>}, check your Fragments!</h1>

      <Container fluid="md">
        <Row>
          {resData &&
            resData.fragments.map((frag) => {
              return (
                <Col className="m-3" key={frag}>
                  <FragmentCard user={user} id={frag} />
                </Col>
              );
            })}
        </Row>
      </Container>
    </div>
  );
}

export default ViewFragments;
