import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Banking Dashboard</Link>
          <div>
            <Link className="btn btn-outline-light mx-2" to="/login">Login</Link>
            <Link className="btn btn-outline-light" to="/register">Register</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<h1 className="text-center mt-5">Welcome to Banking Dashboard</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
