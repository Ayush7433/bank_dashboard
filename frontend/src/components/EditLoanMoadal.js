import React, { useState } from 'react';
import API from '../api';

export default function EditLoanModal({ loan, onClose, onSaved }) {
    const [form, setForm] = useState({ ...loan });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/loans/${form.id}`, form);
            alert('Loan updated successfully');
            onSaved && onSaved();
            onClose();
        } catch (err) {
            alert('Error updating loan');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='modal show' tabIndex='-1' style={{ display: 'block', background: '#0009' }}>
            <div className='modal-dialog'>
                <form className='modal-content' onSubmit={handleSubmit}>
                    <div className='modal-header'>
                        <h5 className='modal-title'>Edit Loan #{loan.id}</h5>
                    </div>
                    <div className='modal-body'>
                        <input type="number" className="form-control mb-2" name="principal" placeholder="Principal" value={form.principal} onChange={handleChange} required />
                        <input type="number" className="form-control mb-2" step="0.01" name="interest_rate" placeholder="Interest Rate" value={form.interest_rate} onChange={handleChange} required />
                        <input type="number" className="form-control mb-2" name="term_months" placeholder="Term (Months)" value={form.term_months} onChange={handleChange} required />
                        <input type="number" className="form-control mb-2" name="outstanding" placeholder="Outstanding" value={form.outstanding} onChange={handleChange} required />
                        <select className="form-select mb-2" name="status" value={form.status} onChange={handleChange} required>
                            <option value="ONGOING">Ongoing</option>
                            <option value="PAID">Paid</option>
                            <option value="DEFAULTED">Defaulted</option>
                        </select>
                    </div>
                    <div className='modal-footer'>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}