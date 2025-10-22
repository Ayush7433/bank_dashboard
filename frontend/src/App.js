import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ReqireAuth from "./components/RequireAuth";
import AppRoutes from "./components/AppRoutes";
import LoanDetailsView from "./views/LoansDetailsView";


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
    <Route path="/loans/:loanId" element={<LoanDetailsView />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
