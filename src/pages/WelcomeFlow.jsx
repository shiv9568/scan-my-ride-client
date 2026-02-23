import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Megaphone, ArrowRight, Zap, Star, Shield, QrCode, ChevronRight } from 'lucide-react';

/* ─── Particle dots ─── */
const Particle = ({ style }) => (
    <div
        className="absolute rounded-full bg-brand opacity-20 animate-pulse"
        style={style}
    />
);

const particles = Array.from({ length: 18 }, (_, i) => ({
    width: `${4 + (i % 5) * 3}px`,
    height: `${4 + (i % 5) * 3}px`,
    top: `${Math.floor((i * 17 + 11) % 90 + 5)}%`,
    left: `${Math.floor((i * 23 + 7) % 88 + 6)}%`,
    animationDelay: `${(i * 0.35).toFixed(2)}s`,
    animationDuration: `${2.5 + (i % 4) * 0.6}s`,
}));

/* ─── Option Card ─── */
const OptionCard = ({ icon: Icon, title, subtitle, badge, features, accent, onClick, delay }) => (
    <motion.button
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="group relative w-full text-left rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 lg:p-8 overflow-hidden transition-all hover:border-opacity-50 focus:outline-none"
        style={{ '--accent': accent }}
    >
        {/* Glow blob */}
        <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
            style={{ backgroundColor: accent }}
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: accent + '22', border: `1px solid ${accent}44` }}
            >
                <Icon size={26} style={{ color: accent }} />
            </div>
            {badge && (
                <span
                    className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border"
                    style={{ color: accent, borderColor: accent + '50', backgroundColor: accent + '15' }}
                >
                    {badge}
                </span>
            )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-white mb-1.5 leading-tight">{title}</h3>
        <p className="text-sm text-white/45 font-medium mb-6 leading-relaxed">{subtitle}</p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
            {features.map(f => (
                <span
                    key={f}
                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: accent + '18', color: accent + 'cc' }}
                >
                    {f}
                </span>
            ))}
        </div>

        {/* CTA row */}
        <div
            className="flex items-center gap-2 text-sm font-black transition-all group-hover:gap-3 duration-200"
            style={{ color: accent }}
        >
            <span>Get Started</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1 duration-200" />
        </div>
    </motion.button>
);

/* ─── MAIN COMPONENT ─── */
export default function WelcomeFlow({ userName, onSelect }) {
    const [selected, setSelected] = useState(null);

    const choose = (type) => {
        setSelected(type);
        setTimeout(() => onSelect(type), 600);
    };

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            style={{ fontFamily: 'Outfit, sans-serif' }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0c0c0e]/95 backdrop-blur-xl" />

            {/* Particle field */}
            {particles.map((p, i) => <Particle key={i} style={p} />)}

            {/* Animated grid lines */}
            <div className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(244,176,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,176,11,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 lg:py-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-10"
                >
                    {/* Logo mark */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-brand flex items-center justify-center shadow-[0_0_24px_rgba(244,176,11,0.5)]">
                            <QrCode size={20} className="text-black" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">
                            Scan<span className="text-brand">My</span>Ride
                        </span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/25 mb-4">
                            <Star size={12} className="text-brand" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand">Welcome Aboard</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                            Hey {userName?.split(' ')[0] || 'there'}! 👋
                        </h1>
                        <p className="text-white/50 text-base lg:text-lg font-medium max-w-md mx-auto leading-relaxed">
                            Tell us how you'll be using ScanMyRide so we can give you the perfect experience.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Option cards */}
                <AnimatePresence>
                    {!selected && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <OptionCard
                                delay={0.3}
                                icon={Car}
                                title="My Vehicle"
                                subtitle="Perfect for car lovers, bike riders & scooter owners. Create a smart QR profile for your vehicle with safety info, specs & social links."
                                badge="Most Popular"
                                features={['Car / Bike / Activa', 'QR Safety Card', 'Spec Sheet', 'Emergency Info', 'QR Sticker']}
                                accent="#f4b00b"
                                onClick={() => choose('car')}
                            />
                            <OptionCard
                                delay={0.42}
                                icon={Megaphone}
                                title="Advertise My Brand"
                                subtitle="Turn any surface into a marketing channel. Put your QR code on vehicles, banners & stickers — let people scan & discover your business instantly."
                                badge="New ✦"
                                features={['Business Profile', 'Brand QR Code', 'Contact Page', 'Social Links', 'Campaign Tracking']}
                                accent="#a78bfa"
                                onClick={() => choose('business')}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Selected state transition */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center gap-5 py-16"
                        >
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                                style={{
                                    backgroundColor: selected === 'car' ? '#f4b00b22' : '#a78bfa22',
                                    border: `2px solid ${selected === 'car' ? '#f4b00b44' : '#a78bfa44'}`
                                }}>
                                {selected === 'car'
                                    ? <Car size={36} className="text-brand" />
                                    : <Megaphone size={36} className="text-violet-400" />
                                }
                            </div>
                            <p className="font-black text-xl text-white">
                                {selected === 'car' ? 'Setting up your Vehicle Profile…' : 'Setting up your Brand Profile…'}
                            </p>
                            <div className="flex gap-2">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: selected === 'car' ? '#f4b00b' : '#a78bfa' }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Trust footer */}
                {!selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                        className="flex items-center justify-center gap-6 mt-8 flex-wrap"
                    >
                        {[
                            { icon: Shield, text: 'Privacy First' },
                            { icon: Zap, text: 'Instant QR Code' },
                            { icon: Star, text: 'Free to Start' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-white/25">
                                <Icon size={13} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{text}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
