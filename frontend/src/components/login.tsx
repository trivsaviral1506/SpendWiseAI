import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            const token =
                response.data.token;

            localStorage.setItem(
                "token",
                token
            );

            navigate("/dashboard");

        } catch (err: any) {

            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* LEFT SIDE */}

            <div className="login-left">

                <div className="brand">

                    <div className="brand-icon">
                        ₹
                    </div>

                    <h1>
                        SpendWise AI
                    </h1>

                </div>

                <div className="hero-content">

                    <h2>
                        Manage your money.
                        <br />
                        <span>
                            Make smarter decisions.
                        </span>
                    </h2>

                    <p>
                        Track your expenses, understand
                        your spending habits and take
                        control of your financial future.
                    </p>

                    <div className="features">

                        <div className="feature">
                            <span>✓</span>
                            <div>
                                <strong>
                                    Smart Tracking
                                </strong>
                                <p>
                                    Keep all your transactions
                                    organized.
                                </p>
                            </div>
                        </div>

                        <div className="feature">
                            <span>✓</span>
                            <div>
                                <strong>
                                    Powerful Analytics
                                </strong>
                                <p>
                                    Understand where your
                                    money goes.
                                </p>
                            </div>
                        </div>

                        <div className="feature">
                            <span>✓</span>
                            <div>
                                <strong>
                                    AI Insights
                                </strong>
                                <p>
                                    Get personalized spending
                                    recommendations.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="login-right">

                <div className="login-card">

                    <div className="mobile-brand">
                        <div className="brand-icon">
                            ₹
                        </div>

                        <h1>
                            SpendWise AI
                        </h1>
                    </div>

                    <h2>
                        Welcome Back
                    </h2>

                    <p className="login-subtitle">
                        Sign in to continue to your dashboard.
                    </p>


                    <form
                        onSubmit={handleLogin}
                    >

                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="login-error">
                                {error}
                            </div>

                        )}


                        {/* LOGIN */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </button>

                    </form>


                    <div className="register-text">

                        Don't have an account?

                        <Link to="/register">
                            Create account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;