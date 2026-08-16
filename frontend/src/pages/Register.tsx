import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            navigate("/");

        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Registration failed"
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
                        Start managing
                        <br />
                        <span>
                            your money smarter.
                        </span>
                    </h2>

                    <p>
                        Create your account and get a
                        clear picture of your spending,
                        savings and financial habits.
                    </p>

                    <div className="features">

                        <div className="feature">
                            <span>✓</span>

                            <div>
                                <strong>
                                    Track Every Expense
                                </strong>

                                <p>
                                    Keep your financial
                                    transactions organized.
                                </p>
                            </div>
                        </div>

                        <div className="feature">
                            <span>✓</span>

                            <div>
                                <strong>
                                    Smart Analytics
                                </strong>

                                <p>
                                    Understand your spending
                                    patterns easily.
                                </p>
                            </div>
                        </div>

                        <div className="feature">
                            <span>✓</span>

                            <div>
                                <strong>
                                    Personalized Insights
                                </strong>

                                <p>
                                    Make better financial
                                    decisions.
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
                        Create Account
                    </h2>

                    <p className="login-subtitle">
                        Join SpendWise AI and start
                        managing your money.
                    </p>


                    <form onSubmit={handleRegister}>

                        {/* NAME */}

                        <div className="input-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


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
                                    setEmail(e.target.value)
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                minLength={6}
                            />

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>

                    </form>


                    <div className="register-text">

                        Already have an account?

                        <Link to="/">
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;