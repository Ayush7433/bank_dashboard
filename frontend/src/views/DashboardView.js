import React, { useEffect, useState } from "react";
import API from "../api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import TransactionsTrendChart from "../components/TransactionsTrendChart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function DashboardView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await API.get('/dashboard');
                setData(res.data);
            } catch {
                alert('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading || !data) return <div>Loading dashboard...</div>;

    return (
        <div className="container mt_4">
            <h2>Bank Dashboard</h2>
            <div className="row my-4">
                <Card count={data.total_customers} label="Customers" color="info" />
                <Card count={data.total_accounts} label="Accounts" color="primary" />
                <Card count={data.total_loans} label="Loans" color="warning" />
                <Card count={data.outstanding_loans} label="Outstanding Loans" color="danger" prefix="₹" />
                <Card count={data.total_balance} label="Total Balance" color="success" prefix="₹" />
                <Card count={data.total_transactions} label="Transactions" color="secondary" />
                <Card count={data.total_deposits} label="Deposits" color="success" prefix="₹" />
                <Card count={data.total_withdrawals} label="Withdrawals" color="danger" prefix="₹" />
                <TransactionsTrendChart />
            </div>
        </div>
    );
}

function Card({ count, label, color, prefix }) {
    return (
        <div className="col-md-3 mb-3">
            <div className={'card text-bg-${color}'}>
                <div className="card-body text-center">
                    <h3>{prefix ? `${prefix}${Number(count).toLocaleString()}` : Number(count).toLocaleString()}</h3>
                    <div>{label}</div>
                </div>
            </div>
        </div>
    );
}