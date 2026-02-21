import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Shield, Zap, ArrowRight, Smartphone, Car, User, Download, Eye, CheckCircle, Star, ChevronRight } from 'lucide-react';
import Logo from '../components/Logo';

/* ── tiny animation helpers ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.35, delay }
});

/* ─────────────── MOCK PHONE SNAPSHOT ─────────────── */
const PhoneMockup = ({ screen }) => (
    <div className="relative mx-auto w-[220px] aspect-[9/19] bg-white rounded-[2.5rem] p-[8px] border-2 border-brand/30 shadow-[0_20px_60px_-10px_rgba(244,176,11,0.25)] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-50 rounded-full z-20 border border-brand/10" />
        <div className="w-full h-full rounded-[2rem] bg-[#fffdf4] overflow-hidden relative">
            {screen}
        </div>
    </div>
);

/* ── Screen 1: Sticker on windshield ── */
const ScanScreen = () => (
    <div className="flex flex-col h-full">
        <div className="flex-1 bg-gradient-to-b from-amber-100 to-amber-50 flex flex-col items-center justify-center gap-3 p-4">
            <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(244,176,11,0.3)]">
                <QrCode size={50} className="text-black" />
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-amber-800">Scan QR Code</p>
            <p className="text-[7px] text-center text-amber-600 font-bold">Use your camera app to scan the sticker on the car windshield</p>
        </div>
        <div className="h-1 bg-brand" />
        <div className="bg-white p-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center">
                <CheckCircle size={12} className="text-brand" />
            </div>
            <span className="text-[7px] font-black uppercase tracking-wider text-amber-900">ScanMyRide • Verified</span>
        </div>
    </div>
);

/* ── Screen 2: Profile Card ── */
const ProfileScreen = () => (
    <div className="flex flex-col h-full bg-[#fffdf4]">
        <div className="h-20 bg-gradient-to-b from-amber-200 to-amber-100 relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-full bg-brand border-2 border-white flex items-center justify-center shadow-md">
                <User size={20} className="text-black" />
            </div>
        </div>
        <div className="pt-8 px-3 flex flex-col items-center gap-1">
            <p className="text-[9px] font-black uppercase tracking-tight text-amber-900">Shivansh Sharma</p>
            <p className="text-[7px] text-amber-600 font-bold">Matte Black Mustang GT500 • CAR</p>
            <div className="w-full h-[1px] bg-brand/20 my-2" />
            <div className="w-full grid grid-cols-2 gap-1">
                {['📞 Call Owner', '🚨 Emergency', '📸 Instagram', '💼 LinkedIn'].map(item => (
                    <div key={item} className="text-[6px] font-bold bg-amber-50 border border-brand/20 rounded-md px-1.5 py-1 text-amber-800 truncate">{item}</div>
                ))}
            </div>
        </div>
    </div>
);

/* ── Screen 3: Dashboard ── */
const DashboardScreen = () => (
    <div className="flex flex-col h-full">
        <div className="bg-white border-b border-brand/15 px-3 py-2 flex items-center justify-between">
            <p className="text-[7px] font-black uppercase text-amber-900">Control Center</p>
            <div className="w-4 h-4 rounded-full bg-brand" />
        </div>
        <div className="flex-1 p-3 space-y-2 overflow-hidden">
            <div className="w-full h-14 bg-amber-50 border border-brand/20 rounded-xl flex items-center justify-center">
                <QrCode size={30} className="text-brand opacity-60" />
            </div>
            {['Car Name', 'Owner Name', 'Phone'].map(f => (
                <div key={f} className="w-full h-5 bg-amber-50 border border-brand/15 rounded-lg flex items-center px-2">
                    <p className="text-[6px] text-amber-800 font-bold">{f}</p>
                </div>
            ))}
            <div className="w-full h-7 bg-brand rounded-lg flex items-center justify-center">
                <p className="text-[7px] font-black text-black uppercase tracking-wide">Save Profile</p>
            </div>
        </div>
    </div>
);

/* ─────────────── MAIN PAGE ─────────────── */
const Home = () => {
    const steps = [
        {
            number: '01',
            icon: <User size={28} className="text-brand" />,
            title: 'Create Your Profile',
            desc: 'Sign up and fill in your details — car info, contact, social links, and emergency contacts.',
            screen: <DashboardScreen />,
        },
        {
            number: '02',
            icon: <Download size={28} className="text-brand" />,
            title: 'Download Your QR Sticker',
            desc: 'Get a premium, print-ready QR sticker. Stick it on your car windshield in seconds.',
            screen: <ScanScreen />,
        },
        {
            number: '03',
            icon: <Smartphone size={28} className="text-brand" />,
            title: 'Anyone Can Scan & Connect',
            desc: 'When scanned, people instantly see your profile — name, contact, emergency info, and more.',
            screen: <ProfileScreen />,
        },
    ];

    const features = [
        { icon: <Shield size={24} className="text-brand" />, title: 'Privacy First', desc: 'You control what is visible. Show only what you want — hide your phone number if you prefer.' },
        { icon: <Zap size={24} className="text-brand" />, title: 'Instant Profiles', desc: 'No app needed to scan. Anyone with a phone camera can access your profile in 1 second.' },
        { icon: <Car size={24} className="text-brand" />, title: 'Multiple Profiles', desc: 'Manage multiple vehicles or personas — car, business, or portfolio — all from one dashboard.' },
        { icon: <Star size={24} className="text-brand" />, title: 'Emergency Mode', desc: 'Activate emergency mode to display critical info prominently when help is needed most.' },
        { icon: <QrCode size={24} className="text-brand" />, title: 'Premium QR Stickers', desc: 'Download beautiful, branded QR stickers ready to print and place on any surface.' },
        { icon: <Eye size={24} className="text-brand" />, title: 'Live Guestbook', desc: 'Let admirers or contacts leave messages directly on your public profile page.' },
    ];

    const useCases = [
        { icon: '🚗', title: 'Car Enthusiasts', desc: 'Show off your build specs, mods, Instagram, and let fans at car meets connect with you instantly.' },
        { icon: '🏢', title: 'Business Owners', desc: 'Turn your car into a moving business card. Share your services and portfolio with everyone who parks next to you.' },
        { icon: '🛡️', title: 'Emergency Safety', desc: "In case of an accident, first responders can scan your sticker to access your emergency contacts and blood group." },
        { icon: '🎨', title: 'Creative Portfolio', desc: 'Artists, photographers, and creators — link your portfolio and social profiles to your vehicle profile.' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">

            {/* ── Fixed yellow glow bg ── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-brand/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-brand/8 blur-[100px] rounded-full" />
            </div>

            {/* ── NAVBAR ── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand/15 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
                {/* Logo — never shrinks */}
                <div className="flex-shrink-0">
                    <Logo />
                </div>

                {/* Right side — all items, collapse gracefully */}
                <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
                    <a href="#how-it-works" className="hidden md:block text-[11px] font-black uppercase tracking-widest text-[var(--text-color)] opacity-60 hover:text-brand hover:opacity-100 transition-all">How It Works</a>
                    <a href="#features" className="hidden md:block text-[11px] font-black uppercase tracking-widest text-[var(--text-color)] opacity-60 hover:text-brand hover:opacity-100 transition-all">Features</a>
                    <Link to="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-[var(--text-color)] opacity-60 hover:text-brand hover:opacity-100 transition-all whitespace-nowrap">Login</Link>
                    <Link to="/register" className="bg-brand text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_8px_20px_-5px_rgba(244,176,11,0.4)] whitespace-nowrap">
                        Get Started →
                    </Link>
                </div>
            </nav>


            {/* ── HERO ── */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-28 pb-20 sm:pb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/30 text-amber-700 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                        <Zap size={12} className="animate-pulse" /> Smart Digital Identity for Your Vehicle
                    </div>
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">
                        Your Car.<br />
                        <span className="text-brand">One Scan.</span><br />
                        Everything.
                    </h1>
                    <p className="text-lg sm:text-xl text-[var(--text-color)] opacity-55 font-bold max-w-2xl mx-auto mb-10 leading-relaxed">
                        ScanMyRide creates a smart QR profile for your vehicle. Stick it on your windshield — let anyone scan to see your contact, car specs, socials, and emergency info instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-brand text-black px-8 py-4 rounded-2xl font-black text-lg shadow-[0_15px_40px_-10px_rgba(244,176,11,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-3 group">
                            Create My Profile Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#how-it-works" className="bg-white text-[var(--text-color)] border-2 border-brand/30 px-8 py-4 rounded-2xl font-black text-lg hover:border-brand transition-all flex items-center justify-center gap-3">
                            See How It Works
                        </a>
                    </div>
                </motion.div>

                {/* Hero Visual – 3 phones side by side */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-20 flex items-end justify-center gap-4 sm:gap-8"
                >
                    <div className="opacity-60 scale-90 -rotate-6 hidden sm:block">
                        <PhoneMockup screen={<DashboardScreen />} />
                    </div>
                    <div className="relative z-10 scale-110 sm:scale-115">
                        <div className="absolute -inset-4 bg-brand/15 blur-2xl rounded-full" />
                        <PhoneMockup screen={<ProfileScreen />} />
                    </div>
                    <div className="opacity-60 scale-90 rotate-6 hidden sm:block">
                        <PhoneMockup screen={<ScanScreen />} />
                    </div>
                </motion.div>

                {/* Social proof bar */}
                <motion.div {...fadeUp(0.05)} className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[var(--text-color)] opacity-50 text-xs font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CheckCircle size={14} className="text-brand opacity-80" /> No app needed to scan</span>
                    <span>•</span>
                    <span className="flex items-center gap-2"><CheckCircle size={14} className="text-brand opacity-80" /> Free to use</span>
                    <span>•</span>
                    <span className="flex items-center gap-2"><CheckCircle size={14} className="text-brand opacity-80" /> Works on any phone</span>
                </motion.div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how-it-works" className="relative z-10 bg-white border-y border-brand/10 py-20 sm:py-28">
                <div className="max-w-6xl mx-auto px-6 sm:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <p className="text-brand font-black text-[11px] uppercase tracking-[0.3em] mb-3">How It Works</p>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">3 Steps.<br className="sm:hidden" /> That's It.</h2>
                    </motion.div>

                    <div className="space-y-24">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                {...fadeUp(0.05 * i)}
                                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                            >
                                {/* Text side */}
                                <div className="flex-1 space-y-5">
                                    <div className="flex items-center gap-4">
                                        <span className="text-6xl sm:text-8xl font-black text-brand/15 leading-none">{step.number}</span>
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">{step.title}</h3>
                                    <p className="text-[var(--text-color)] opacity-60 font-bold text-lg leading-relaxed">{step.desc}</p>
                                    <Link to="/register" className="inline-flex items-center gap-2 text-brand font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                                        Try It Now <ChevronRight size={16} />
                                    </Link>
                                </div>

                                {/* Phone mockup side */}
                                <div className="flex-shrink-0 relative">
                                    <div className="absolute -inset-8 bg-brand/8 blur-3xl rounded-full" />
                                    <PhoneMockup screen={step.screen} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── USE CASES ── */}
            <section className="relative z-10 py-20 sm:py-28">
                <div className="max-w-6xl mx-auto px-6 sm:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <p className="text-brand font-black text-[11px] uppercase tracking-[0.3em] mb-3">Who Is It For?</p>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">Built For Everyone<br />With A Vehicle</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {useCases.map((u, i) => (
                            <motion.div key={u.title} {...fadeUp(0.05 * i)} className="glass-card rounded-3xl p-8 border border-brand/15 hover:border-brand/40 transition-all group">
                                <div className="text-4xl mb-4">{u.icon}</div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{u.title}</h3>
                                <p className="text-[var(--text-color)] opacity-55 font-bold leading-relaxed">{u.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="relative z-10 bg-white border-y border-brand/10 py-20 sm:py-28">
                <div className="max-w-6xl mx-auto px-6 sm:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <p className="text-brand font-black text-[11px] uppercase tracking-[0.3em] mb-3">Features</p>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">Everything You Need,<br />Nothing You Don't</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div key={f.title} {...fadeUp(0.04 * i)} className="p-7 rounded-3xl bg-amber-50/60 border border-brand/15 hover:border-brand/40 hover:bg-amber-50 transition-all group">
                                <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-black mb-2 uppercase tracking-tight">{f.title}</h3>
                                <p className="text-[var(--text-color)] opacity-55 font-bold text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="relative z-10 py-20 sm:py-28">
                <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    <motion.div
                        {...fadeUp()}
                        className="bg-brand rounded-[2.5rem] p-12 sm:p-16 text-center relative overflow-hidden shadow-[0_30px_80px_-20px_rgba(244,176,11,0.5)]"
                    >
                        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[80%] bg-white/10 blur-3xl rounded-full" />
                        <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight uppercase mb-4 relative z-10">
                            Ready to Scan<br />Your World?
                        </h2>
                        <p className="text-black/60 font-bold mb-8 text-lg relative z-10">Join hundreds of car owners who already have a smart profile. Free to create, zero apps needed to scan.</p>
                        <Link to="/register" className="inline-flex items-center gap-3 bg-black text-brand px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all relative z-10 group">
                            Create My Free Profile
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 border-t border-brand/15 bg-white py-12">
                <div className="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <Logo />
                    <p className="text-[var(--text-color)] opacity-35 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                        © 2024 ScanMyRide • All Rights Reserved
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-color)] opacity-40 hover:text-brand hover:opacity-100 transition-all">Login</Link>
                        <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-color)] opacity-40 hover:text-brand hover:opacity-100 transition-all">Sign Up</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
