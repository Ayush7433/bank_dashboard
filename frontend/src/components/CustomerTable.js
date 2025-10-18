import React, { useEffect, useState } from 'react';
import API from '../api';

export default function CustomerTable({ refreshFlag }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await API.get('/customers?limit=200');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Error fetching customers', err?.response?.data || err.message);
      alert('Failed to fetch customers. Check backend.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, [refreshFlag]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <button className="btn btn-primary btn-sm" onClick={fetchCustomers} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>DOB</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No data</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.first_name}</td>
                    <td>{c.last_name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={c.address}>{c.address}</td>
                    <td>{c.dob || '-'}</td>
                    <td>{c.created_at}</td>
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
