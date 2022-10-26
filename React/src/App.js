import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import PostFragment from "./components/postFragment/PostFragment";
import ConvertFragment from "./components/convertFragment/ConvertFragment";
import ViewFragment from "./components/viewFragment/ViewFragment";
import ViewFragments from "./components/viewFragments/ViewFragments";
import NoPage from "./components/noPage/NoPage";
import Login from "./components/login/Login";
import Logout from "./components/logout/Logout";

function App() {
  return (
    <div className="App">
      <Sidebar />

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

export default App;
