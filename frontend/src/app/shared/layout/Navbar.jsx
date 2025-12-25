import { useState, useEffect } from "react";
import Button from "../ui/Button";

export default function Navbar({ toggleTheme }) {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        // Persist theme in localStorage
        localStorage.setItem("theme", theme);
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    function handleToggleTheme() {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    }

    return (
        <header className="fn-flex fn-gap-md border-b border-gray-800" style={{ padding: "12px 16px" }}>
            {/* Logo */}
            <h2><a href="">Flownex</a></h2>

            <div style={{ flex: 1 }} />

            {/* Theme Toggle Button */}
            <button
                className="fn-btn fn-btn-secondary"
                onClick={handleToggleTheme}
            >
                Toggle Theme
            </button>
        </header>
    );
}
