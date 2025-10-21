import React, { useState } from "react";
import TransactionsTable from "../components/TransactionTable";
import AddTransactionModal from "../components/AddTransactionModal";

export default function TransactionView() {
    const [showModal, setShowModal] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        account_id: "",
        type: "",
        currency: "",
        start_date: "",
        end_date: "",
        min_amount: "",
        max_amount: "",
        description: "",
        min_balance_after: "",
        max_balance_after: ""
    });

    // Handle filter input changes
    function handleChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    // Apply filters (could toggle refresh, or pass to table)
    function handleFilter() {
        setRefreshFlag(!refreshFlag);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Transactions</h3>
                <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
                    + New Transaction
                </button>
            </div>

            {/* FILTER UI */}
            <div className="card shadow mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Account ID"
                                name="account_id"
                                value={filters.account_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="type" value={filters.type} onChange={handleChange}>
                                <option value="">All Types</option>
                                <option value="DEBIT">Debit</option>
                                <option value="CREDIT">Credit</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Currency (e.g., INR)"
                                name="currency"
                                value={filters.currency}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                name="start_date"
                                value={filters.start_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                name="end_date"
                                value={filters.end_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min Amount"
                                name="min_amount"
                                value={filters.min_amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max Amount"
                                name="max_amount"
                                value={filters.max_amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Description Contains"
                                name="description"
                                value={filters.description || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min Balance After"
                                name="min_balance_after"
                                value={filters.min_balance_after || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max Balance After"
                                name="max_balance_after"
                                value={filters.max_balance_after || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" onClick={handleFilter}>
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <TransactionsTable refreshFlag={refreshFlag} filters={filters} />

            {showModal && (
                <AddTransactionModal onClose={() => setShowModal(false)} onAdded={() => setRefreshFlag(!refreshFlag)} />
            )}
        </>
    );
}