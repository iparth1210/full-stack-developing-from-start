
import React, { useEffect, useState } from 'react';

const HudCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            const hoverable = target.closest('button, a, input, [role="button"]');
            setIsHovering(!!hoverable);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{ left: 0, top: 0 }}
        >
            {/* Main Reticle */}
            <div
                className="absolute transition-transform duration-100 ease-out"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
                }}
            >
                {/* Outer Ring */}
                <div className={`w-8 h-8 border-2 border-indigo-400/40 rounded-full transition-all duration-500 ${isClicking ? 'scale-75 opacity-100' : 'scale-100 opacity-50'}`}></div>

                {/* Targeting Lines */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-indigo-400 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-indigo-400 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-indigo-400 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-indigo-400 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Center Point */}
                <div className={`absolute inset-0 m-auto w-1 h-1 bg-white rounded-full transition-transform duration-300 ${isClicking ? 'scale-[3]' : 'scale-100'}`}></div>
            </div>

            {/* Trailing Glory */}
            <div
                className="absolute transition-transform duration-300 ease-out opacity-20"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
                }}
            >
                <div className="w-12 h-12 border border-indigo-500/30 rounded-full animate-ping"></div>
            </div>
        </div>
    );
};

export default HudCursor;
