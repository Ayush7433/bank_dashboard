import React, {useEffect, useState} from "react";
import API from "../api";

export default function AuditLogstable() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        API.get("/audit_logs").then(res => setLogs(res.data || []))
        .finally(() => setLoading(false));
    },[]);

    return(
        <div className="card mt-4">
            <div className="card body">
                <h4>Audit Logs</h4>
                {loading?(
                    <div>Loading...</div>
                ): (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                    <th>Details</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0? (
                                    <tr>
                                    <td colSpan={6} className="text-centered">
                                        No logs found
                                    </td>
                                    </tr>
                                ) : (
                                    logs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.id}</td>
                                            <td>{log.user_id}</td>
                                            <td>{log.role}</td>
                                            <td>{log.action}</td>
                                            <td>
                                                <pre className="small">
                                                    {log.details}
                                                </pre>
                                            </td>
                                            <td>{log.created_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}