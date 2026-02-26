import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Smartphone, Download, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA = () => {
    const [show, setShow] = useState(false);
    const [platform, setPlatform] = useState('android');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // 1. Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone
            || document.referrer.includes('android-app://');

        if (isStandalone) return;

        // 2. Check if dismissed recently
        const dismissed = localStorage.getItem('smr_install_dismissed');
        if (dismissed) {
            const lastDismissed = parseInt(dismissed);
            const now = Date.now();
            // Show again after 7 days if they didn't install
            if (now - lastDismissed < 7 * 24 * 60 * 60 * 1000) return;
        }

        // 3. Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isiOS = /iphone|ipad|ipod/.test(userAgent);
        setPlatform(isiOS ? 'ios' : 'android');

        // 4. Handle Android Install Prompt
        const handlePrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShow(true);
        };

        window.addEventListener('beforeinstallprompt', handlePrompt);

        // For iOS or cases where prompt isn't supported, show after a delay
        const timer = setTimeout(() => {
            if (!show) setShow(true);
        }, 5000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handlePrompt);
            clearTimeout(timer);
        };
    }, [show]);

    const handleInstall = async () => {
        if (platform === 'android' && deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShow(false);
            }
            setDeferredPrompt(null);
        } else {
            // For iOS, they just read the instructions
            setShow(false);
            localStorage.setItem('smr_install_dismissed', Date.now().toString());
        }
    };

    const dismiss = () => {
        setShow(false);
        localStorage.setItem('smr_install_dismissed', Date.now().toString());
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 lg:bottom-6 left-4 right-4 z-[9999] lg:left-auto lg:right-6 lg:w-80"
            >
                <div className="bg-[#1a1a1c]/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={dismiss}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white">Install ScanMyRide</h3>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Mobile Web App</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {platform === 'ios' ? (
                            <div className="space-y-3">
                                <p className="text-xs text-white/70 leading-relaxed font-medium">
                                    Install this app on your iPhone for the best experience:
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/5">
                                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center"><Share size={12} /></div>
                                        <span>1. Tap the Share button</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/5">
                                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center"><PlusSquare size={12} /></div>
                                        <span>2. Selected "Add to Home Screen"</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs text-white/70 leading-relaxed font-medium">
                                    Get the ScanMyRide app on your phone for faster access and offline mode.
                                </p>
                                <button
                                    onClick={handleInstall}
                                    className="w-full py-3 bg-brand text-black rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
                                >
                                    <Download size={14} /> Install Now
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] border-t border-white/5">
                            <Info size={10} />
                            <span>No App Store needed</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPWA;
