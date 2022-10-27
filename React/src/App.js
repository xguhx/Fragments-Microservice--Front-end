import "@aws-amplify/ui-react/styles.css";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import PostFragment from "./components/postFragment/PostFragment";
import ConvertFragment from "./components/convertFragment/ConvertFragment";
import ViewFragment from "./components/viewFragment/ViewFragment";
import ViewFragments from "./components/viewFragments/ViewFragments";
import NoPage from "./components/noPage/NoPage";
import Login from "./components/login/Login";
import Logout from "./components/logout/Logout";
Amplify.configure(awsconfig);
function App({ user }) {
  return (
    <div className="App">
      <Sidebar user={user} />

      <Routes>
        <Route path="/" element={<Sidebar />} />
        <Route index element={<PostFragment />} />
        <Route path="convert" element={<ConvertFragment />} />
        <Route path="view" element={<ViewFragment />} />
        <Route path="viewAll" element={<ViewFragments />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ["email", "name"],
});
