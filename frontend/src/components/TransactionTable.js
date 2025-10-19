import React, { useEffect, useState } from "react";
import API from "../api";

export default function TransactionsTable({ refreshFlag }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchTransactions() {
        try {
            setLoading(true);
            const res = await API.get('/transactions?limit=200');
            setTransactions(res.data || []);
        } catch (err) {
            console.error('Error fetching transaction', err);
            alert('Failed to fetch transactions.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [refreshFlag]);

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <button className="btn btn-primary btn-sm" onClick={fetchTransactions} disabled={loading}>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Account</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Balance After</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">No data</td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.id}</td>
                                        <td>{t.account_number || t.account_id}</td>
                                        <td>{t.type}</td>
                                        <td>{parseFloat(t.amount).toFixed(2)}</td>
                                        <td>{t.currency}</td>
                                        <td>{t.description}</td>
                                        <td>{t.created_at}</td>
                                        <td>{t.balance_after}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}