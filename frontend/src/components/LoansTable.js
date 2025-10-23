import React, { useState, useEffect, use } from 'react';
import EditLoanModal from './EditLoanMoadal';
import API from '../api';
import { Link } from "react-router-dom";

export default function LoansTable({ refreshFlag, onRefresh }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editLoan, setEditLoan] = useState(null);

    //Fetch loan once on mount
    useEffect(() => {
        async function fetchLoans() {
            setLoading(true);
            try {
                const res = await API.get('/loans');
                setLoans(res.data || []);
            } catch (err) {
                alert("Failed to fetch loans: ");
            } finally {
                setLoading(false);
            }
        }
        fetchLoans();
    }, [refreshFlag]);

    async function handleDelete(loanId) {
        if (!window.confirm("Are you sure to delete this loan?")) return;
        try {
            await API.delete(`/loans/${loanId}`);
            setLoans(loans.filter(l => l.id !== loanId));
            alert("Loan deleted!");
        } catch {
            alert("Failed to delete loan!");
        }
    }



    return (
        <div className='card mt-3'>
            <div className='card-body'>
                <h4>Loans</h4>
                {loading ? (<div>Loading...</div>
                ) : (
                    <table className='table table-striped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>Account</th>
                                <th>Principal</th>
                                <th>Interest Rate</th>
                                <th>Term</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.length === 0 ? (
                                <tr><td colSpan={7}>No loans found.</td></tr>
                            ) : (
                                loans.map(loan => (
                                    <tr key={loan.id}>
                                        <td>{loan.id}</td>
                                        <td>{loan.account_id}</td>
                                        <td>{loan.principal}</td>
                                        <td>{loan.interest_rate}</td>
                                        <td>{loan.term_months}</td>
                                        <td>{loan.status}</td>
                                        <td>{loan.created_at}</td>
                                        <td>
                                            <button className="btn btn-sm btn-primary me-2"
                                                onClick={() => setEditLoan(loan)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(loan.id)}>
                                                Delete
                                            </button>
                                        </td>
                                        <td>
                                            <Link to={`/loans/${loan.id}`}>{loan.id}</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                )}
                {
                    editLoan && (
                        <EditLoanModal
                            loan={editLoan}
                            onClose={() => setEditLoan(null)}
                            onSaved={() => {
                                setEditLoan(null);
                                onRefresh && onRefresh() // trigger table reload
                            }}
                        />
                    )
                }
            </div>
        </div>
    );
}