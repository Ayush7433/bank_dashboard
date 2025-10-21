import React from "react";
import { Navigate } from "react-router-dom";

export default function ReqireAuth({children}) {
    const token = localStorage.getItem('bd_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
