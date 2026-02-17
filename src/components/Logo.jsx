import React from 'react';

const Logo = ({ className = "w-12 h-12", iconOnly = false }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative group">
                <div className="absolute inset-0 bg-brand/40 blur-xl rounded-full group-hover:bg-brand/60 transition-all duration-500 opacity-50"></div>
                <img
                    src="/logo.svg"
                    alt="ScanMyRide Logo"
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-lg scale-110"
                />
            </div>
            {!iconOnly && (
                <span className="font-black text-2xl tracking-tighter uppercase text-white">
                    SCANMY<span className="text-brand">RIDE</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
