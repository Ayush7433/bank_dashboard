import React, { useEffect, useState } from "react";
import LoanPaymentsTable from "../components/LoanPaymentsTable";
import AddLoanPaymentModal from "../components/AddLoanPaymentModal";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function LoanDetailsView() {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLoan() {
      try {
        const res = await API.get(`/loans?loan_id=${loanId}`);
        setLoan(res.data[0]);
      } catch {
        alert("Loan not found");
        navigate("/loans");
      }
    }
    fetchLoan();
  }, [loanId, navigate]);

  if (!loan) return <div>Loading loan info...</div>;

  return (
    <div className="container mt-3">
      <button className="btn btn-link mb-2" onClick={() => navigate("/")}>⟵ Back to Dashboard</button>
      <div className="card mb-4">
        <div className="card-body">
          <h3>
            Loan #{loan.id}
            <span className="fs-6 ms-3 badge bg-info">{loan.status}</span>
          </h3>
          <div className="row">
            <div className="col-md-4">Account: <b>{loan.account_id}</b></div>
            <div className="col-md-4">Principal: ₹{loan.principal}</div>
            <div className="col-md-4">Interest Rate: {loan.interest_rate}%</div>
            <div className="col-md-4 mt-2">Term: {loan.term_months} months</div>
            <div className="col-md-4 mt-2">Outstanding: <b>₹{loan.outstanding}</b></div>
            <div className="col-md-4 mt-2"><span className="text-muted">Opened:</span> {loan.created_at}</div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary mb-3" onClick={() => setShowAddPayment(true)}>
        + Add Payment
      </button>
      <LoanPaymentsTable loanId={loan.id} />
      {showAddPayment && (
        <AddLoanPaymentModal
          loanId={loan.id}
          onClose={() => setShowAddPayment(false)}
          onAdded={() => window.location.reload()}
        />
      )}
    </div>
  );
}