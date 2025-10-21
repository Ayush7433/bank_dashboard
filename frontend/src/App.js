import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ReqireAuth from "./components/RequireAuth";
import AppRoutes from "./components/AppRoutes";


function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/"
      element={
        <ReqireAuth>
          <AppRoutes />
        </ReqireAuth>
      }
    />
  </Routes>
</BrowserRouter>
  );
}

export default App;
