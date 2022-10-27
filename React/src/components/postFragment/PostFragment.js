import "./PostFragment.css";

import { useEffect, useState } from "react";
import axios from "axios";

function PostFragment({ user }) {
  const [serverUrl, setServerUrl] = useState(process.env.REACT_APP_API_URL);
  const [resData, setResData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${serverUrl}/v1/fragments`, {
          headers: {
            // Include the user's ID Token in the request so we're authorized
            Authorization: `Bearer ${user.idToken}`,
          },
        });

        if (!res) {
          throw new Error(`${res.status} ${res.statusText}`);
        }

        setResData(res.data);
      } catch (err) {
        console.error("Unable to call GET /v1/fragments", err.message);
      }
    };

    getData();
  }, []);

  return (
    <div className="PostFragment">
      <h1>PostFragment!</h1>
    </div>
  );
}

export default PostFragment;
