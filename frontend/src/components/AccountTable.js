import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AccountTable() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const res = await API.get('/accounts?limit=100');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      alert('Failed to fetch accounts. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-primary btn-sm"
            onClick={fetchAccounts}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Account Number</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Currency</th>
                <th>Balance</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No data
                  </td>
                </tr>
              ) : (
                accounts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.account_number}</td>
                    <td>{`${a.first_name || ''} ${a.last_name || ''}`}</td>
                    <td>{a.account_type}</td>
                    <td>{a.currency}</td>
                    <td>{a.balance}</td>
                    <td>{a.branch_name}</td>
                    <td>{a.status}</td>
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
