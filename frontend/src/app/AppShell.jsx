import Navbar from "./shared/layout/Navbar";
import Sidebar from "./shared/layout/Sidebar";

export default function AppShell({ children, boards, setBoards }) {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* 👇 IMPORTANT CHANGE */}
                <Sidebar boards={boards} setBoards={setBoards} />

                <main
                    className="flex-1 p-6 overflow-auto"
                    style={{ background: "var(--bg-primary)" }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
