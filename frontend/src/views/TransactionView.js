import React,{useState} from "react";
import TransactionsTable from "../components/TransactionTable";
import AddTransactionModal from "../components/AddTransactionModal";

export default function TransactionView() {
    const [showModal, setShowModal] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const handleAdded = () => { 
        setShowModal(false);
        setRefreshFlag(!refreshFlag);
     };

     return(
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Transactions</h3>
                <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
                    + New Transaction
                </button>
            </div>

            <TransactionsTable refreshFlag={refreshFlag} />

            {showModal &&(
                <AddTransactionModal onClose={() => setShowModal(false)} onAdded={handleAdded} />
            )}
        </>
     );
}