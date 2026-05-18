import React, { useEffect, useState } from 'react';
import UndoIcon from './UndoIcon';

interface ToastProps {
    message: string;
    isVisible: boolean;
    timestamp?: number;
    onUndo: () => void;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, timestamp, onUndo, onClose }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [progress, setProgress] = useState(100);
    const [bounce, setBounce] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setProgress(100);
            
            // Trigger slight bounce animation
            setBounce(true);
            const bounceTimer = setTimeout(() => setBounce(false), 150);
            
            // Short delay to allow browser to paint initial state before transitioning
            const animationTimer = setTimeout(() => {
                setProgress(0);
            }, 50);

            const timer = setTimeout(() => {
                onClose();
            }, 3500);
            
            return () => {
                clearTimeout(bounceTimer);
                clearTimeout(animationTimer);
                clearTimeout(timer);
            };
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300); // Wait for fade out animation
            return () => clearTimeout(timer);
        }
    }, [isVisible, timestamp, onClose]);

    if (!shouldRender) return null;

    // Number of ticks for the progress bar
    const ticks = Array.from({ length: 42 });

    return (
        <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 
        bg-neutral-950 border border-neutral-800 rounded-2xl p-4
        shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out
        ${isVisible ? (bounce ? 'translate-y-0 opacity-100 scale-[1.03]' : 'translate-y-0 opacity-100 scale-100') : 'translate-y-4 opacity-0 scale-95'}
        w-[320px] flex flex-col gap-4`}
        >
            <div className="flex items-center justify-between">
                <span className="text-neutral-200 text-[15px] font-geist-mono font-medium pl-1 tracking-wide">
                    {message}
                </span>
                <div className="flex items-center gap-4 pr-1">
                    <div className="w-[1px] h-6 bg-neutral-800" />
                    <button
                        onClick={onUndo}
                        className="relative flex items-center justify-center w-[34px] h-[34px] rounded-[10px] border border-neutral-700/80 bg-neutral-900/40 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-200 text-neutral-300 hover:text-white group"
                        aria-label="Undo"
                    >
                        <UndoIcon className="w-[18px] h-[18px] transition-transform group-hover:-translate-x-0.5" />
                        <div className="absolute -top-[3px] -right-[3px] w-[6px] h-[6px] bg-red-500 rounded-full border border-neutral-950" />
                    </button>
                </div>
            </div>

            {/* Visual Countdown */}
            <div className="relative w-full h-[6px]">
                {/* Background Ticks */}
                <div className="absolute inset-0 flex justify-between px-1">
                    {ticks.map((_, i) => (
                        <div key={i} className="w-[1.5px] h-full bg-neutral-800/80 rounded-sm" />
                    ))}
                </div>
                {/* Foreground Ticks (Animated) */}
                <div 
                    className="absolute inset-0 flex justify-between px-1"
                    style={{ 
                        clipPath: `inset(0 ${100 - progress}% 0 0)`,
                        transition: isVisible && progress === 0 ? 'clip-path 3400ms linear' : 'none'
                    }}
                >
                    {ticks.map((_, i) => (
                        <div key={i} className="w-[1.5px] h-full bg-neutral-200 rounded-sm shadow-[0_0_2px_rgba(255,255,255,0.4)]" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Toast;
