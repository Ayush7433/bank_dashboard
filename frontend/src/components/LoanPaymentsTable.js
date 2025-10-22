import React, { useEffect, useState } from 'react';
import API from '../api';

export default function LoanPaymentsTable({ loanId }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPayments() {
        try {
            const res = await API.get(`/loan_payments?loan_id=${loanId}`);
            setPayments(res.data || []);
        } catch (err) {
            alert('Error fetching loan payments');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (loanId) {
            fetchPayments();
        }
    }, [loanId]);

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this payment?')) return;
        try {
            await API.delete(`/loan_payments/${id}`);
            setPayments(payments.filter(p => p.id !== id));
            alert('Payment deleted successfully');
        } catch (err) {
            alert('Error deleting payment');
        }
    }

    return (
        <div className='card mt-3'>
            <div className='card-body'>
                <h5 className='mb-3'>Loan Payments</h5>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className='table table-striped align-middle'>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>Payment Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No payments yet
                                    </td>
                                </tr>
                            ) : (
                                payments.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.payment_date}</td>
                                        <td>{p.amount}</td>
                                        <td>{p.status}</td>
                                        <td>
                                            <button className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(p.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}