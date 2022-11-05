import "./ViewFragments.css";
import FragmentCard from "../smallerComponents/fragmentCard/FragmentCard";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";

function ViewFragments({ user }) {
  const [resData, setResData] = useState();
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  user = user ? user : location.state.user;
  useEffect(() => {
    if (!user) {
      navigate("/");
    }

    const getData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/fragments/?expand=1`,
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

        setResData(res.data.fragments);
      } catch (err) {
        console.error("Unable to call GET /v1/fragments: " + err);
      }
    };

    getData();
    setReload(false);
  }, [reload, user, navigate]);

  return (
    <div className="ViewFragments">
      <h1>Hello {user && <> {user.username} </>}, check your Fragments!</h1>

      <Container fluid="md">
        <Row>
          {resData &&
            resData
              .sort((a, b) => {
                let fa = a.updated.toLowerCase(),
                  fb = b.updated.toLowerCase();

                if (fa > fb) {
                  return -1;
                }
                if (fa < fb) {
                  return 1;
                }
                return 0;
              })
              .map((frag) => {
                return (
                  <Col className="m-3" key={frag.id}>
                    <FragmentCard
                      user={user}
                      id={frag.id}
                      setReload={setReload}
                    />
                  </Col>
                );
              })}
        </Row>
      </Container>
    </div>
  );
}

export default ViewFragments;
