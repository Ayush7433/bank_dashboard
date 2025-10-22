import React, { useState } from 'react';
import API from '../api';

export default function AddLoanModal({ onClose, onAdded }) {
    const [form, setForm] = useState({
        account_id: '',
        principal: '',
        interest_rate: '',
        term_months: ''
    });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/loans", form);
            onAdded && onAdded();
            onClose();
        } catch (err) {
            alert("Failed to add loan: ");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='modal show' tabIndex="-1" style={{ display: "block", background: "#0009" }}>
            <div className='modal-dialog'>
                <form className='modal-content' onSubmit={handleSubmit}>
                    <div className='modal-header'>
                        <h5 className='modal-title'>Add New Loan</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className='modal-body'>
                        <input type='number' className='form-control mb-2' name='account_id' placeholder='Account ID' value={form.account_id} onChange={handleChange} required />
                        <input type="number" className="form-control mb-2" name="principal" placeholder="Principal Amount" required value={form.principal} onChange={handleChange} />
                        <input type="number" className="form-control mb-2" step="0.01" name="interest_rate" placeholder="Interest Rate" required value={form.interest_rate} onChange={handleChange} />
                        <input type="number" className="form-control mb-2" name="term_months" placeholder="Term (Months)" required value={form.term_months} onChange={handleChange} />

                    </div>
                    <div className='modal-footer'>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Adding..." : "Add Loan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}