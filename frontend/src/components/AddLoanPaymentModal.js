import React, { useState } from "react";
import API from "../api";

export default function AddLoanPaymentModal({ loanId, onClose, onAdded }) {
    const [form, setForm] = useState({
        payment_date: "",
        amount: "",
    });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/loan_payments", {
                loan_id: loanId,
                payment_date: form.payment_date,
                amount: form.amount
            });
            alert("Payment added successfully");
            onAdded();
            onClose();
        } catch (err) {
            alert("Error adding payment");
        } finally {
            setLoading(false);
        }
    }

    if (!loanId) return null;

    return (
        <div className="modal show" tabIndex="-1" style={{ display: "block", background: "#0009" }}>
            <div className="modal-dialog">
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">Add Loan Payment</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="date"
                            className="form-control mb-2"
                            name="payment_date"
                            value={form.payment_date}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            className="form-control mb-2"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Amount"
                            required
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Adding..." : "Add Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}