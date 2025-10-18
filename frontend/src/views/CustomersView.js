import React, { useState } from 'react';
import CustomerTable from '../components/CustomerTable';
import AddCustomerModal from '../components/AddCustomerModal';

export default function CustomersView() {
  const [showModal, setShowModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleAdded = () => {
    setShowModal(false);
    setRefreshFlag(!refreshFlag); // triggers table refresh
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customers</h3>
        <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
          + Add Customer
        </button>
      </div>

      <CustomerTable refreshFlag={refreshFlag} />

      {showModal && (
        <AddCustomerModal onClose={() => setShowModal(false)} onAdded={handleAdded} />
      )}
    </>
  );
}
