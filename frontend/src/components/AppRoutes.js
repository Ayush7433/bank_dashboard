import React, { useState, useEffect } from "react";
import API from "../api";
import Accounts from "./AccountTable";
import Transactions from "./TransactionTable";
import Customers from "./CustomerTable";
import { Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
    const [active, setActive] = useState('accounts');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('bd_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    if (!user) {
        return null;
    }

    const isAdmin = user.role === 'admin';

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand">Banking Dashboard</span>

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${active === "accounts" ? "active" : ""}`}
                                onClick={() => setActive("accounts")}
                            >
                                Accounts
                            </button>
                        </li>

                        {isAdmin && (
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${active === "transactions" ? "active" : ""}`}
                                    onClick={() => {
                                        if (!isAdmin) { alert('Transactions are visible to admins only'); return; }
                                        setActive('transactions');
                                    }}
                                >
                                    Transactions
                                </button>
                            </li>
                        )}

                        <li className="nav-item">
                            <button
                                className={`nav-link ${active === "customers" ? "active" : ""}`}
                                onClick={() => setActive("customers")}
                            >
                                Customers
                            </button>
                        </li>
                    </ul>

                    <span className="navbar-text text-light me-3">
                        {user.full_name} ({user.role})
                    </span>
                    <button
                        className="btn btn-outline-light"
                        onClick={() => {
                            localStorage.removeItem("bd_token");
                            localStorage.removeItem("bd_user");
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

        {/* Page content  */}
            <div className="container mt-4">
                {active === "accounts" && <Accounts />}
                {active === "transactions" && isAdmin && <Transactions />}
                {active === "customers" && <Customers />}
            </div>
        </div>
    );
}

export default AppRoutes;

