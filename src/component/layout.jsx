import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import DarkModeToggle from "./darkmode.jsx";

function Layout({ children, minimal = false }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
        <div>
          <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            WalletCode
          </Link>
          <Link to="/register" style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
            Sign up
          </Link> 
          <Link to="/login" style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
            Sign in   
          </Link>
          <DarkModeToggle/>
        </div>

        {!minimal && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/">Fragments</Link>
            <Link to="/tags">Tags</Link>
            <Link to="/info">Info</Link>
          </div>
        )}
      </nav>

      <main style={{ padding: "1rem" }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
