import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, QrCode, Shield, Zap, ArrowRight, Smartphone } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-brand selection:text-black">
            {/* Background elements */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-black z-0 border-x border-white/5" />
            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />

            <nav className="relative z-10 px-4 sm:px-8 py-6 sm:py-8 flex items-center justify-between max-w-7xl mx-auto">
                <Logo />
                <div className="flex items-center gap-4 sm:gap-8">
                    <ThemeToggle />
                    <Link to="/login" className="font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-brand transition-colors">Login</Link>
                    <Link to="/register" className="bg-brand text-black px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_15px_30px_-10px_rgba(244,176,11,0.3)]">Join Fleet</Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-24 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-zinc-900 border border-white/5 text-brand font-black text-[10px] uppercase tracking-[0.2em] mb-10">
                            <Zap size={14} className="animate-pulse" /> Verified System 2.0
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8 sm:mb-12 uppercase">
                            Digital <br />
                            <span className="text-brand">Identity</span> <br />
                            System.
                        </h1>
                        <p className="text-xl text-zinc-500 font-bold max-w-lg mb-12 leading-relaxed uppercase tracking-tighter italic">
                            The ultimate digital connection for your vehicle. Establish your presence, secure your ride, and connect instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <Link to="/register" className="bg-brand hover:bg-white text-black px-8 sm:px-10 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-[0_20px_40px_-15px_rgba(244,176,11,0.4)] flex items-center justify-center gap-4 transition-all group">
                                GET STARTED <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        {/* Premium Mockup */}
                        <div className="relative z-10 mx-auto w-full max-w-[380px] aspect-[9/19] bg-black rounded-[4rem] p-[10px] border-[1px] border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden">
                            <div className="w-full h-full rounded-[3.5rem] bg-zinc-950 border border-white/5 overflow-hidden flex flex-col">
                                <div className="h-48 w-full bg-zinc-900 border-b border-white/5 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-50" />
                                    <div className="absolute bottom-6 left-8 flex flex-col gap-2">
                                        <div className="w-12 h-1 bg-brand rounded-full" />
                                        <div className="w-32 h-6 bg-white/10 rounded-lg blur-[2px]" />
                                    </div>
                                </div>
                                <div className="px-8 pt-10 space-y-6">
                                    <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-3xl" />
                                    <div className="space-y-3">
                                        <div className="h-10 w-full bg-white/5 border border-white/5 rounded-2xl" />
                                        <div className="h-10 w-full bg-white/5 border border-white/5 rounded-2xl" />
                                    </div>
                                    <div className="h-16 w-full bg-brand rounded-2xl mt-12" />
                                </div>
                            </div>
                        </div>

                        {/* Floating QR Element */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(244,176,11,0.5)] rotate-12 flex items-center justify-center"
                        >
                            <QrCode size={120} className="text-black" />
                        </motion.div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-48">
                    <FeatureCard
                        icon={<QrCode className="text-brand" size={32} />}
                        title="SMART GENERATION"
                        desc="Unique encrypted QR profiles generated instantly for your vehicle windshield."
                    />
                    <FeatureCard
                        icon={<Shield className="text-brand" size={32} />}
                        title="SECURE PRIVACY"
                        desc="Dynamic control over your personal data. You decide what's visible to the scanner."
                    />
                    <FeatureCard
                        icon={<Smartphone className="text-brand" size={32} />}
                        title="MOBILE FIRST"
                        desc="A premium, app-like experience for everyone who interacts with your car identity."
                    />
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                    <Logo className="mb-8 opacity-50 grayscale hover:grayscale-0 transition-all scale-75 sm:scale-90" />
                    <p className="text-zinc-600 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-center">Advancing Vehicle Connectivity Since 2024</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border-t border-white/5 hover:border-brand/20 transition-all group overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />
        <div className="w-16 h-16 bg-zinc-950 border border-white/5 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{title}</h3>
        <p className="text-zinc-500 font-bold text-sm leading-relaxed tracking-tight italic">{desc}</p>
    </div>
);

export default Home;
