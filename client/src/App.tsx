import { Routes, Route, Navigate } from "react-router-dom";
import {  useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import "./App.css";
import Profile from "./pages/Profile/Profile";

function App() {
  const [user, setUser] = useState<Array<{
    firstName: string,
    lastName: string,
    gender: string,
    dateOfBirth: string,
    email: string,
    mobile: string,
    loginTime: string,
    image: string
  }>>([]);
  return (
    <div className="container">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route
           path="/"
          element={
            user.length > 0 ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/data/profile" element={<Home />} />

      </Routes>
    </div>
  );
}

export default App;


