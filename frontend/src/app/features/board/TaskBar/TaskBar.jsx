import { useState } from "react";
import { TaskAdder } from "../TaskAdder";

export default function TaskBar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 1. Main Wrapper: Jo screen ke bottom par chipka rahega */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-4">
                
                {/* 2. TaskBar Container: 
                   Isme 'w-[95%]' ya 'container' use kiya hai taake ye image ki tarah background de.
                   Aapki original 'fn-taskbar' class iska main look handle karegi.
                */}
                <div className="fn-taskbar fn-card flex items-center justify-between px-6 py-3 rounded-2xl w-fit max-w-[90%] border border-[#ffffff10] shadow-2xl bg-[#090c10]/90 backdrop-blur-xl">
                    
                    <div className="flex items-center gap-4">
                        {/* Add Task Button (Primary) */}
                        <button
                            className="fn-btn px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                            onClick={() => setOpen(true)}
                        >
                            <span className="text-lg">+</span>
                            Add Task
                        </button>

                        {/* Add Board Button (Secondary) */}
                        <button
                            className="fn-btn px-5 py-2 rounded-xl text-sm font-bold opacity-70 hover:opacity-100 transition-opacity border border-[#ffffff10]"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                            onClick={() => console.log("Add Board Clicked")}
                        >
                            Add Board
                        </button>
                    </div>

                    {/* Right Side: Status Indicator */}
                    <div className="flex items-center gap-3 pl-4 border-l border-[#ffffff10]">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-black tracking-widest text-[#8b949e]">LIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Adder Modal */}
            {open && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg">
                        <TaskAdder onClose={() => setOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}