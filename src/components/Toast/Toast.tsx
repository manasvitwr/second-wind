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


            setBounce(true);
            const bounceTimer = setTimeout(() => setBounce(false), 150);


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


    const formattedMessage = message
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div
            className={`fixed top-6 right-6 z-50 
        bg-neutral-950 border border-neutral-800 rounded-xl px-4 
        py-3.5
        shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out
        ${isVisible ? (bounce ? 'translate-y-0 opacity-100 scale-[1.02]' : 'translate-y-0 opacity-100 scale-100') : '-translate-y-4 opacity-0 scale-95'}
        w-[200px]
        flex items-center justify-between overflow-hidden`}
        >
            <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-neutral-500 stroke-[1.5]" />
                <span className="text-neutral-200 text-xs font-geist-mono font-medium tracking-wide">
                    {formattedMessage}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-[1px] h-4 bg-neutral-800" />
                <button
                    onClick={onUndo}
                    className="text-neutral-200 hover:text-white font-geist-mono text-xs underline transition-all duration-200 cursor-pointer bg-transparent border-none p-0"
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
