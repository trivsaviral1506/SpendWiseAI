import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="logo-icon">₹</div>
                <div>
                    <h2>SpendWise AI</h2>
                    <span>Smart Finance</span>
                </div>
            </div>

            <nav className="sidebar-nav">

                <p className="nav-label">MENU</p>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <span>🏠</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <span>💳</span>
                    Transactions
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <span>📊</span>
                    Analytics
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <div className="sidebar-user">
                    <div className="user-avatar">
                        👤
                    </div>

                    <div>
                        <strong>My Account</strong>
                        <span>Personal Finance</span>
                    </div>
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    ↪ Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;