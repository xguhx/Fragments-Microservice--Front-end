import "./ViewFragments.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function ViewFragments({ user }) {
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

  console.log(resData);
  return (
    <div className="ViewFragments">
      <p>ViewFragments!</p>
    </div>
  );
}

export default ViewFragments;
