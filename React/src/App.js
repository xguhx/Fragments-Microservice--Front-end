import "@aws-amplify/ui-react/styles.css";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify, Auth } from "aws-amplify";
import awsConfig from "./aws-exports";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import PostFragment from "./components/postFragment/PostFragment";
import ConvertFragment from "./components/convertFragment/ConvertFragment";
import ViewFragment from "./components/viewFragment/ViewFragment";
import ViewFragments from "./components/viewFragments/ViewFragments";
import NoPage from "./components/noPage/NoPage";
import Home from "./components/home/Home";

import Container from "react-bootstrap/Container";

import { getUser } from "./auth";

import { useEffect, useState } from "react";

Amplify.configure(awsConfig);

function App({ user }) {
  const [authUser, setAuthUser] = useState("This is a test");
  useEffect(() => {
    (async () => {
      setAuthUser(await getUser());
    })();
  }, []);

  console.log(authUser, "AUTH USER!");

  const handleSignOut = () => {
    Auth.signOut();
  };

  return (
    <div className="App">
      <Sidebar user={authUser} signOut={handleSignOut} />
      <Container fluid="md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/newFragment"
            element={<PostFragment user={authUser} />}
          />
          <Route path="convert" element={<ConvertFragment user={authUser} />} />
          <Route path="view" element={<ViewFragment user={authUser} />} />
          <Route path="viewAll" element={<ViewFragments user={authUser} />} />

          <Route path="*" element={<NoPage user={authUser} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ["email", "name"],
});
