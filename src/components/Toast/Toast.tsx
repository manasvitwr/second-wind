import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    timestamp?: number;
    duration?: number;
    onUndo: () => void;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, timestamp, duration = 3500, onUndo, onClose }) => {
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
            }, duration);
            
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

    return (
        <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 
        bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5
        shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out
        ${isVisible ? (bounce ? 'translate-y-0 opacity-100 scale-[1.03]' : 'translate-y-0 opacity-100 scale-100') : 'translate-y-4 opacity-0 scale-95'}
        w-[320px] flex items-center justify-between overflow-hidden`}
        >
            <div className="flex items-center gap-3">
                <Trash2 className="w-[18px] h-[18px] text-neutral-500" />
                <span className="text-neutral-200 text-[14px] font-geist-mono font-medium tracking-wide">
                    {message}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-[1px] h-5 bg-neutral-800" />
                <button
                    onClick={onUndo}
                    className="text-neutral-200 hover:text-white font-geist-mono text-sm underline transition-all duration-200 cursor-pointer"
                >
                    undo
                </button>
            </div>

            {/* Visual Countdown */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900/40">
                <div 
                    className="h-full bg-neutral-200 shadow-[0_0_2px_rgba(255,255,255,0.4)]"
                    style={{ 
                        width: `${progress}%`,
                        transition: isVisible && progress === 0 ? `width ${duration - 100}ms linear` : 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default Toast;
