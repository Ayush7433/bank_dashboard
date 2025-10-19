import React, {useEffect, useState} from "react";
import API from '../api';

export default function AddTransactionModal({onClose, onAdded}) {
    const [form, setForm] = useState({
        account_id:'',
        type:'DEBIT',
        amount:'',
        description:''
    });
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //fetch account so user can pick account_id
        API.get('/accounts?limit=500').then(res => setAccounts(res.data || [])).catch(err => console.error(err));
    },[]);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!form.account_id || !form.amount){
            alert('Select account and enter amount');
            return;
        }
        try{
            setLoading(true);
            // POST /api/transactions expects account_id,type,amount,description
            await API.post('/transactions', {
                account_id: parseInt(form.account_id),
                type: form.type,
                amount: parseFloat(form.amount),
                description: form.description
            });
            alert('Transaction created');
            onAdded();
        }catch(err){
            console.error(err);
            alert('Failed to create transaction' + (err?.response?.error || err.message));   
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Transaction</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Account</label>
                <select name="account_id" className="form-select" value={form.account_id} onChange={handleChange} required>
                  <option value="">-- select account --</option>
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.account_number} — {a.first_name || ''} {a.last_name || ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Type</label>
                <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                  <option value="DEBIT">DEBIT</option>
                  <option value="CREDIT">CREDIT</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Amount</label>
                <input type="number" step="0.01" name="amount" className="form-control" value={form.amount} onChange={handleChange} required />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <input type="text" name="description" className="form-control" value={form.description} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
}