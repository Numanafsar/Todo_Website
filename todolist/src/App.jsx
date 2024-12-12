import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Sign_Up from "./Pages/Sign_Up";
import Login from "./Pages/Login";
import ErrorPage from "./Components/ErrorPage";
import Notes from "./Pages/Notes";
import Layout from "./Pages/Layout";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Sign_Up />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="notes" element={<Notes />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}
