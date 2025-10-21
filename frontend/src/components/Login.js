import React,{ useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";


function Login() {
    // const token = localStorage.getItem("bd_token");
    // if (token) return <Navigate to="/" replace />;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('auth/login', {username, password});
            const {token, user} = res.data;
            // Store token in localStorage
            localStorage.setItem("bd_token", token);
            localStorage.setItem("bd_user", JSON.stringify(user));
            // setUser && setUser(user);
            navigate('/');
        } catch (err){
            console.error(err);
            const msg = err?.response?.data?.message || "Login failed";
            alert(msg);
        } finally{
            setLoading(false);
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{width: '420px'}}>
                <h3 className="text-center mb-3">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e)=> setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;