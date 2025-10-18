import React, { useState } from 'react';
import AccountsView from './views/AccountsView';
import CustomersView from './views/CustomersView';

function App() {
  const [active, setActive] = useState('accounts');
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Bank Dashboard</span>
        </div>
      </nav>

      {/* Content */}
      <div className="container mt-4">
        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${active === 'accounts' ? 'active' : ''}`}
              onClick={() => setActive('accounts')}
            >
              Accounts
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${active === 'customers' ? 'active' : ''}`}
              onClick={() => setActive('customers')}
            >
              Customers
            </button>
          </li>
        </ul>

        {/* Views */}
        {active === 'accounts' && <AccountsView />}
        {active === 'customers' && <CustomersView />}
      </div>
    </div>
  );
}

export default App;
