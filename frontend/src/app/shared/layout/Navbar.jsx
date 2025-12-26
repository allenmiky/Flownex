import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    function handleToggleTheme() {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    }

    return (
        /* 1. Yahan se bg-[#0d1117] hata diya hai taake theme badle */
        <header
            className="fn-flex border-b border-gray-800 transition-colors duration-300"
            style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                /* 2. Agar variable set hain to var use hoga, warna default transparent */
                backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
        >

            {/* Left Section */}
            <h2 className="font-bold" style={{ margin: 0 }}>
                <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Flownex</a>
            </h2>

            {/* Right Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

                {/* Theme Toggle Button */}
                <button
                    className="fn-btn fn-btn-secondary"
                    onClick={handleToggleTheme}
                    title="Toggle Theme"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        /* Button colors according to theme */
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                        color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}
                >
                    {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
                </button>

                {/* Profile Icon */}
                <FaUserCircle size={28} color="#798df2" style={{ cursor: 'pointer' }} />
            </div>
        </header>
    );
}