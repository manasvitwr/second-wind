import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onUndo: () => void;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onUndo, onClose }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300); // Wait for fade out animation
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3 
        bg-black/75 backdrop-blur-md border border-white/10 rounded-xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
            <span className="text-white text-sm font-geist-mono font-normal">
                {message}
            </span>
            <button
                onClick={onUndo}
                className="text-white text-sm font-geist-mono font-medium px-3 py-1.5 rounded-md 
          hover:bg-white/10 transition-colors duration-200 border-none bg-transparent outline-none"
            >
                Undo
            </button>
        </div>
    );
};

export default Toast;
