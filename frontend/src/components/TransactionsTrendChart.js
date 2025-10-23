// src/components/TransactionsTrendChart.js
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import API from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TransactionsTrendChart() {
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard/transactions_by_month")
      .then(res => setTrend(res.data))
      .catch(() => alert("Failed to load transaction trends"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!trend.length) return <div>No transaction data to display</div>;

  const labels = trend.map(t => t.month);
  const deposits = trend.map(t => t.deposits);
  const withdrawals = trend.map(t => Math.abs(t.withdrawals));

  const data = {
    labels,
    datasets: [
      {
        label: "Deposits",
        data: deposits,
        fill: false,
        borderColor: "green",
        tension: 0.4,
      },
      {
        label: "Withdrawals",
        data: withdrawals,
        fill: false,
        borderColor: "red",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="card my-4">
      <div className="card-body">
        <h5>Deposits / Withdrawals Trend</h5>
        <Line data={data} />
      </div>
    </div>
  );
}