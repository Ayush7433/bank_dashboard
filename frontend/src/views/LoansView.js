import React, { useState } from "react";
import LoansTable from "../components/LoansTable";
import AddLoanModal from "../components/AddLoanModal";

export default function LoansView() {
    const [showModal, setShowModal] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    function handleAdded() {
        setRefreshFlag(!refreshFlag);
    }

    function handleRefresh() {
    setRefreshFlag(f => !f); // simple toggle triggers useEffect reload
  }
  
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Loans Manager</h2>
                <button className="btn btn-success" onClick={() => setShowModal(true)}>+ Add Loan</button>
            </div>
            <LoansTable refreshFlag={refreshFlag} onRefresh={handleRefresh} />
            {showModal && (<AddLoanModal onClose={() => setShowModal(false)} onAdded={handleAdded} />)}
        </div>
    );
}