import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { getCarLogoUrl } from '../components/StylishQR';
import {
    Phone, User, Briefcase, Instagram, Linkedin, MapPin,
    AlertCircle, Droplets, ChevronRight, QrCode, ShieldCheck,
    MessageCircle, Zap, Car, Gauge, Wrench, Youtube, Check,
    Shield, ExternalLink, Globe, Twitter, Mail, Star, Megaphone
} from 'lucide-react';

/* ── Shared helpers ── */
const Orb = ({ className }) => (
    <div className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`} />
);

const Glass = ({ children, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.4, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`bg-white/8 backdrop-blur-xl border border-white/12 rounded-[1.75rem] ${className}`}
        style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)' }}
    >
        {children}
    </motion.div>
);

const Pill = ({ icon: Icon, text, color }) => (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest"
        style={{ backgroundColor: color + '18', border: `1px solid ${color}30`, color }}>
        {Icon && <Icon size={10} />} {text}
    </div>
);

const ActionRow = ({ href, label, sub, icon: Icon, color, target }) => (
    <a href={href} target={target} rel={target === '_blank' ? 'noreferrer' : undefined}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all group active:scale-[0.98]"
        style={{ backgroundColor: color + '0d', borderColor: color + '25' }}>
        <div>
            <div className="font-black text-sm" style={{ color }}>{label}</div>
            {sub && <div className="text-[9px] font-bold text-white/30 mt-0.5">{sub}</div>}
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '15' }}>
            <Icon size={18} style={{ color }} />
        </div>
    </a>
);

/* ─────────────────────────────────────────
   VEHICLE PROFILE LAYOUT (car / default)
───────────────────────────────────────── */
const VehicleProfile = ({ profile, brand, carImg, avatarImg }) => {
    const phone = profile.phoneNumber?.replace(/\D/g, '');
    const [guestName, setGuestName] = useState('');
    const [guestMsg, setGuestMsg] = useState('');
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [guestbook, setGuestbook] = useState(profile.guestbook || []);
    const { uniqueId } = useParams();

    const postGuest = async (e) => {
        e.preventDefault(); setPosting(true);
        try {
            await api.post(`/api/profile/public/${uniqueId}/guestbook`, { name: guestName, message: guestMsg });
            const entry = { name: guestName || 'Anonymous', message: guestMsg, date: new Date().toISOString() };
            setGuestbook(prev => [entry, ...prev]);
            setGuestName(''); setGuestMsg(''); setPosted(true);
            setTimeout(() => setPosted(false), 3500);
        } catch { alert('Could not post.'); }
        setPosting(false);
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden text-white"
            style={{ background: '#0c0c0e', fontFamily: 'Outfit, sans-serif' }}>

            <Orb className="top-[-5%] left-[-10%] w-72 h-72 bg-amber-400/15" />
            <Orb className="top-[8%] right-[-8%] w-56 h-56 bg-yellow-500/12" />
            <Orb className="top-[35%] left-[-5%] w-48 h-48 bg-amber-300/10" />
            <Orb className="bottom-[5%] left-[20%] w-52 h-52 bg-amber-500/10" />

            {/* Hero */}
            <div className="relative h-[55vw] max-h-[340px] min-h-[220px] overflow-hidden">
                {carImg ? (
                    <>
                        <motion.img src={carImg} alt="Banner"
                            initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            onError={e => e.target.style.display = 'none'}
                            loading="eager" decoding="async"
                            className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0e]/50 via-[#0c0c0e]/20 to-[#0c0c0e]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/70 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-yellow-900/30 to-[#0c0c0e]" />
                )}

                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md z-10">
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: brand }}>
                        <Zap size={8} className="text-black" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/60">ScanMyRide</span>
                </div>

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md z-10">
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: brand }}>🚗 Vehicle</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 flex items-end justify-between z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1 opacity-70" style={{ color: brand }}>
                            {profile.isVerified ? '✦ Verified Build' : '⦿ Live Profile'}
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none uppercase drop-shadow-2xl">
                            {profile.carName || 'Profile'}
                        </h1>
                        {profile.carCompany && (
                            <div className="flex items-center gap-2 mt-2 bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-white/10 w-fit">
                                <div className="w-5 h-5 flex items-center justify-center bg-white rounded-md p-0.5 shadow-sm">
                                    <img
                                        src={getCarLogoUrl(profile.carCompany)}
                                        alt={profile.carCompany}
                                        className="w-full h-full object-contain"
                                        onError={(e) => e.target.parentElement.style.display = 'none'}
                                    />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{profile.carCompany}</span>
                            </div>
                        )}
                    </motion.div>
                    {avatarImg && (
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                            className="w-16 h-16 rounded-[1.25rem] overflow-hidden flex-shrink-0 border-2"
                            style={{ borderColor: brand + '88', boxShadow: `0 8px 24px ${brand}44` }}>
                            <img src={avatarImg} alt={profile.ownerName} className="w-full h-full object-cover" loading="lazy" />
                        </motion.div>
                    )}
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-5 pb-28 space-y-4 relative z-10">
                <AnimatePresence>
                    {profile.emergencyMode && (
                        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                            className="p-5 rounded-3xl border-2 border-red-500/60 flex items-center gap-4"
                            style={{ background: 'rgba(239,68,68,0.12)', boxShadow: '0 0 40px rgba(239,68,68,0.2)' }}>
                            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center flex-shrink-0 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                <AlertCircle size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="font-black text-red-400 text-base uppercase tracking-wide">🚨 Emergency Active</p>
                                <p className="text-red-400/60 text-xs font-bold mt-0.5">Please assist this person immediately</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Owner card */}
                <Glass className="p-5" delay={0.15}>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2"
                            style={{ borderColor: brand + '55', boxShadow: `0 4px 20px ${brand}33` }}>
                            {avatarImg
                                ? <img src={avatarImg} alt="Owner" className="w-full h-full object-cover" loading="lazy" />
                                : <div className="w-full h-full flex items-center justify-center bg-white/5"><User size={26} style={{ color: brand }} /></div>
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="font-black text-xl uppercase tracking-tight leading-none truncate">{profile.ownerName || 'Owner'}</h2>
                                {profile.isVerified && (
                                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: brand }}>
                                        <ShieldCheck size={11} className="text-black" />
                                    </div>
                                )}
                            </div>
                            {profile.profession && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Briefcase size={11} style={{ color: brand }} />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide truncate">{profile.profession}</span>
                                </div>
                            )}
                            {profile.city && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <MapPin size={11} className="text-white/20" />
                                    <span className="text-[10px] font-bold text-white/25 truncate">{profile.city}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                        {profile.bloodGroup && <Pill icon={Droplets} text={profile.bloodGroup} color="#ef4444" />}
                        <Pill icon={null} text={profile.isPublic ? 'Public' : 'Private'} color={profile.isPublic ? '#34d399' : '#f87171'} />
                        {profile.emergencyMode && <Pill icon={AlertCircle} text="SOS ON" color="#ef4444" />}
                    </div>

                    <div className="space-y-2.5">
                        {profile.showPhone && profile.phoneNumber && (
                            <motion.a href={`tel:${profile.phoneNumber}`} whileTap={{ scale: 0.97 }}
                                className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 text-black"
                                style={{ backgroundColor: brand, boxShadow: `0 8px 28px ${brand}55` }}>
                                <Phone size={20} className="fill-current" /> CALL OWNER
                            </motion.a>
                        )}
                        {(profile.instagram || profile.linkedin) && (
                            <div className="flex gap-2.5">
                                {profile.instagram && (
                                    <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer"
                                        className="flex-1 py-3 rounded-2xl flex items-center justify-center border border-white/8 bg-white/5 hover:bg-white/10 transition-all">
                                        <Instagram size={22} style={{ color: brand }} />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer"
                                        className="flex-1 py-3 rounded-2xl flex items-center justify-center border border-white/8 bg-white/5 hover:bg-white/10 transition-all">
                                        <Linkedin size={22} style={{ color: brand }} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </Glass>

                {/* Spec sheet */}
                {(profile.specs?.hp || profile.specs?.torque || profile.specs?.engine || profile.specs?.mods) && (
                    <Glass className="p-5" delay={0.25}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: brand + '33' }}>
                                <Gauge size={12} style={{ color: brand }} />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Spec Sheet</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                            {profile.specs?.hp && (
                                <div className="p-3.5 rounded-2xl border border-white/8 bg-white/4">
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: brand }}>Horsepower</p>
                                    <p className="font-black text-xl leading-none">{profile.specs.hp}</p>
                                </div>
                            )}
                            {profile.specs?.torque && (
                                <div className="p-3.5 rounded-2xl border border-white/8 bg-white/4">
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: brand }}>Torque</p>
                                    <p className="font-black text-xl leading-none">{profile.specs.torque}</p>
                                </div>
                            )}
                            {profile.specs?.engine && (
                                <div className="p-3.5 rounded-2xl border border-white/8 bg-white/4 col-span-2">
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: brand }}>Engine</p>
                                    <p className="font-black">{profile.specs.engine}</p>
                                </div>
                            )}
                            {profile.specs?.mods && (
                                <div className="p-3.5 rounded-2xl border border-white/8 bg-white/4 col-span-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Wrench size={10} style={{ color: brand }} />
                                        <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: brand }}>Modifications</p>
                                    </div>
                                    <p className="text-sm font-bold text-white/60 leading-relaxed">{profile.specs.mods}</p>
                                </div>
                            )}
                        </div>
                        {profile.youtubeLink && (
                            <a href={profile.youtubeLink} target="_blank" rel="noreferrer"
                                className="mt-3 w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/15 transition-all">
                                <Youtube size={18} /> Watch Build Video
                            </a>
                        )}
                    </Glass>
                )}

                {/* WhatsApp quick alerts */}
                {phone && (
                    <Glass className="p-5" delay={0.35}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-[#25D366]/20">
                                <MessageCircle size={12} className="text-[#25D366]" />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Quick Alerts · WhatsApp</p>
                        </div>
                        <div className="space-y-2">
                            <ActionRow
                                href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${profile.ownerName || ''}, I scanned your car QR.`)}`}
                                target="_blank" icon={MessageCircle} color="#25D366"
                                label="Send Message" sub="Opens WhatsApp instantly" />
                            <ActionRow
                                href={`https://wa.me/${phone}?text=${encodeURIComponent(`URGENT: Regarding your car ${profile.carName} — please respond.`)}`}
                                target="_blank" icon={AlertCircle} color="#ef4444"
                                label="Emergency Alert" sub="Sends urgent WA message" />
                        </div>
                    </Glass>
                )}

                {/* Emergency + Blood + City */}
                {(profile.city || profile.bloodGroup || profile.emergencyContact) && (
                    <div className="grid grid-cols-2 gap-3">
                        {profile.city && (
                            <Glass className="p-4" delay={0.4}>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <MapPin size={12} style={{ color: brand }} />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/25">Location</p>
                                </div>
                                <p className="font-black text-sm leading-tight uppercase">{profile.city}</p>
                            </Glass>
                        )}
                        {profile.bloodGroup && (
                            <Glass className="p-4" delay={0.4}>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Droplets size={12} className="text-red-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/25">Blood</p>
                                </div>
                                <p className="font-black text-2xl text-red-400 leading-none">{profile.bloodGroup}</p>
                            </Glass>
                        )}
                        {profile.emergencyContact && (
                            <div className="col-span-2">
                                <Glass className="p-4" delay={0.42}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Shield size={12} className="text-orange-400" />
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/25">Emergency Contact</p>
                                    </div>
                                    <a href={`tel:${profile.emergencyContact}`} className="font-black text-base text-orange-400 hover:text-orange-300 transition-colors">
                                        {profile.emergencyContact}
                                    </a>
                                </Glass>
                            </div>
                        )}
                    </div>
                )}

                {/* Guestbook */}
                <GuestbookSection guestbook={guestbook} brand={brand} profile={profile}
                    guestName={guestName} setGuestName={setGuestName}
                    guestMsg={guestMsg} setGuestMsg={setGuestMsg}
                    posting={posting} posted={posted} onSubmit={postGuest} />

                <FreeCTABadge brand={brand} profileType="car" />
            </main>
        </div>
    );
};

/* ─────────────────────────────────────────
   BUSINESS CARD LAYOUT (business)
───────────────────────────────────────── */
const BusinessCard = ({ profile, brand, avatarImg }) => {
    const phone = profile.phoneNumber?.replace(/\D/g, '');
    const [guestName, setGuestName] = useState('');
    const [guestMsg, setGuestMsg] = useState('');
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [guestbook, setGuestbook] = useState(profile.guestbook || []);
    const { uniqueId } = useParams();

    const postGuest = async (e) => {
        e.preventDefault(); setPosting(true);
        try {
            await api.post(`/api/profile/public/${uniqueId}/guestbook`, { name: guestName, message: guestMsg });
            const entry = { name: guestName || 'Anonymous', message: guestMsg, date: new Date().toISOString() };
            setGuestbook(prev => [entry, ...prev]);
            setGuestName(''); setGuestMsg(''); setPosted(true);
            setTimeout(() => setPosted(false), 3500);
        } catch { alert('Could not post.'); }
        setPosting(false);
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden text-white"
            style={{ background: '#0c0c0e', fontFamily: 'Outfit, sans-serif' }}>

            {/* Colored orbs tuned to brand */}
            <Orb className="top-[-10%] left-[-15%] w-80 h-80 opacity-20" style={{ backgroundColor: brand }} />
            <Orb className="top-[20%] right-[-10%] w-64 h-64 opacity-10" style={{ backgroundColor: brand }} />
            <Orb className="bottom-[10%] left-[10%] w-56 h-56 opacity-10" style={{ backgroundColor: brand }} />

            {/* ── HERO — full-bleed photo card ── */}
            <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 h-[420px]"
                    style={{ background: `linear-gradient(135deg, ${brand}22 0%, #0c0c0e 60%)` }} />

                <div className="relative z-10 max-w-lg mx-auto px-4 pt-10">

                    {/* Top badge row */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                            <Megaphone size={11} style={{ color: brand }} />
                            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/60">ScanMyRide</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                            <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: brand }}>📢 Brand</span>
                        </div>
                    </div>

                    {/* ── MAIN CARD (mimics the reference design) ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative rounded-[2rem] overflow-hidden border border-white/12 mb-5"
                        style={{ boxShadow: `0 24px 80px ${brand}30, 0 4px 32px rgba(0,0,0,0.5)` }}>

                        {/* Photo / avatar area */}
                        <div className="relative h-56 sm:h-64 bg-white/5 overflow-hidden">
                            {avatarImg ? (
                                <>
                                    <img src={avatarImg} alt={profile.carName}
                                        className="w-full h-full object-cover object-center"
                                        loading="eager" decoding="async" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111116]" />
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${brand}25, #111116)` }}>
                                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                                        style={{ backgroundColor: brand + '30', border: `2px solid ${brand}40` }}>
                                        <Megaphone size={40} style={{ color: brand }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info section */}
                        <div className="bg-[#111116] px-6 py-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h1 className="font-black text-4xl leading-tight tracking-tight text-white">
                                            {profile.carName || 'Brand Name'}
                                        </h1>
                                        {profile.isVerified && (
                                            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: brand }}>
                                                <Check size={11} className="text-black" />
                                            </div>
                                        )}
                                    </div>
                                    {profile.workDetails && (
                                        <p className="text-white/50 text-sm font-medium leading-relaxed line-clamp-2">
                                            {profile.workDetails}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Quick meta row */}
                            <div className="flex items-center gap-4 mb-5 text-white/50">
                                {profile.ownerName && (
                                    <div className="flex items-center gap-1.5">
                                        <User size={11} />
                                        <span className="text-base font-black text-white/75">{profile.ownerName}</span>
                                    </div>
                                )}
                                {profile.city && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={11} />
                                        <span className="text-sm font-black text-white/70">{profile.city}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons row */}
                            <div className="flex gap-2.5">
                                {phone && profile.showPhone && (
                                    <a href={`tel:${profile.phoneNumber}`}
                                        className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-black transition-all hover:brightness-110 active:scale-95"
                                        style={{ backgroundColor: brand, boxShadow: `0 8px 20px ${brand}40` }}>
                                        <Phone size={16} /> Call
                                    </a>
                                )}
                                {profile.resumeLink && (
                                    <a href={profile.resumeLink} target="_blank" rel="noreferrer"
                                        className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-white/12 bg-white/6 text-white hover:bg-white/10 transition-all active:scale-95">
                                        <Globe size={16} /> Website
                                    </a>
                                )}
                                {phone && (
                                    <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I discovered ${profile.carName} via QR!`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/12 bg-white/6 hover:bg-white/10 transition-all active:scale-95 flex-shrink-0">
                                        <MessageCircle size={18} className="text-[#25D366]" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── BODY ── */}
            <main className="max-w-lg mx-auto px-4 pb-28 space-y-4 relative z-10">

                {/* Social links */}
                {(profile.instagram || profile.linkedin) && (
                    <Glass className="p-5" delay={0.2}>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">Follow Us</p>
                        <div className="flex gap-3">
                            {profile.instagram && (
                                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer"
                                    className="flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 border border-white/8 bg-white/4 hover:bg-white/8 transition-all">
                                    <Instagram size={20} style={{ color: brand }} />
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-wider">Instagram</span>
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer"
                                    className="flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 border border-white/8 bg-white/4 hover:bg-white/8 transition-all">
                                    <Linkedin size={20} style={{ color: brand }} />
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-wider">LinkedIn</span>
                                </a>
                            )}

                        </div>
                    </Glass>
                )}

                {/* About / brand description long form */}
                {profile.workDetails && (
                    <Glass className="p-5" delay={0.25}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: brand }} />
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">About the Brand</p>
                        </div>
                        <p className="text-white/55 text-sm leading-relaxed font-medium">{profile.workDetails}</p>
                    </Glass>
                )}

                {/* YouTube promo */}
                {profile.youtubeLink && (
                    <Glass className="overflow-hidden" delay={0.3}>
                        <a href={profile.youtubeLink} target="_blank" rel="noreferrer"
                            className="flex items-center gap-4 p-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/25 transition-all">
                                <Youtube size={22} className="text-red-400" />
                            </div>
                            <div>
                                <p className="font-black text-sm text-white">Watch Promo Video</p>
                                <p className="text-[10px] text-white/30 font-bold mt-0.5">Opens YouTube</p>
                            </div>
                            <ChevronRight size={18} className="text-white/20 ml-auto" />
                        </a>
                    </Glass>
                )}

                {/* WhatsApp CTA */}
                {phone && (
                    <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi! I found your brand via QR — ${profile.carName}`)}`}
                        target="_blank" rel="noreferrer"
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm border border-[#25D366]/25 bg-[#25D366]/8 text-[#25D366] hover:bg-[#25D366]/15 transition-all">
                        <MessageCircle size={18} />
                        Message on WhatsApp
                    </a>
                )}

                {/* Email if available */}
                {profile.email && (
                    <a href={`mailto:${profile.email}`}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm border border-white/10 bg-white/5 text-white/60 hover:bg-white/8 transition-all">
                        <Mail size={18} />
                        Send Email
                    </a>
                )}

                <GuestbookSection guestbook={guestbook} brand={brand} profile={profile}
                    guestName={guestName} setGuestName={setGuestName}
                    guestMsg={guestMsg} setGuestMsg={setGuestMsg}
                    posting={posting} posted={posted} onSubmit={postGuest} />

                <FreeCTABadge brand={brand} profileType="business" />
            </main>
        </div>
    );
};

/* ─────────────────────────────────────────
   PORTFOLIO LAYOUT (portfolio)
───────────────────────────────────────── */
const PortfolioCard = ({ profile, brand, avatarImg }) => {
    const phone = profile.phoneNumber?.replace(/\D/g, '');
    const [guestName, setGuestName] = useState('');
    const [guestMsg, setGuestMsg] = useState('');
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [guestbook, setGuestbook] = useState(profile.guestbook || []);
    const { uniqueId } = useParams();

    const postGuest = async (e) => {
        e.preventDefault(); setPosting(true);
        try {
            await api.post(`/api/profile/public/${uniqueId}/guestbook`, { name: guestName, message: guestMsg });
            const entry = { name: guestName || 'Anonymous', message: guestMsg, date: new Date().toISOString() };
            setGuestbook(prev => [entry, ...prev]);
            setGuestName(''); setGuestMsg(''); setPosted(true);
            setTimeout(() => setPosted(false), 3500);
        } catch { alert('Could not post.'); }
        setPosting(false);
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden text-white"
            style={{ background: '#0c0c0e', fontFamily: 'Outfit, sans-serif' }}>

            <Orb className="top-[-10%] left-[-15%] w-80 h-80 opacity-20" style={{ backgroundColor: brand }} />
            <Orb className="bottom-[10%] right-[10%] w-64 h-64 opacity-10" style={{ backgroundColor: brand }} />

            <div className="relative max-w-lg mx-auto px-4 pt-10 pb-28 space-y-4">

                {/* Top badge */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <Zap size={11} style={{ color: brand }} />
                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/60">ScanMyRide</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: brand }}>💼 Portfolio</span>
                    </div>
                </div>

                {/* Hero profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-[2rem] overflow-hidden border border-white/12"
                    style={{ boxShadow: `0 24px 60px ${brand}25, 0 4px 32px rgba(0,0,0,0.5)` }}>

                    {/* Avatar full-width */}
                    <div className="relative h-52 bg-white/5">
                        {avatarImg ? (
                            <>
                                <img src={avatarImg} alt={profile.ownerName}
                                    className="w-full h-full object-cover object-top"
                                    loading="eager" decoding="async" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111116]" />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${brand}20, #111116)` }}>
                                <div className="w-20 h-20 rounded-full flex items-center justify-center border-2"
                                    style={{ backgroundColor: brand + '25', borderColor: brand + '50' }}>
                                    <User size={36} style={{ color: brand }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#111116] px-6 py-5">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="font-black text-2xl text-white tracking-tight">{profile.ownerName || profile.carName || 'Name'}</h1>
                            {profile.isVerified && (
                                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: brand }}>
                                    <Check size={11} className="text-black" />
                                </div>
                            )}
                        </div>
                        {profile.profession && (
                            <p className="text-sm font-bold mb-2" style={{ color: brand }}>{profile.profession}</p>
                        )}
                        {profile.workDetails && (
                            <p className="text-white/45 text-sm leading-relaxed font-medium mb-4 line-clamp-2">{profile.workDetails}</p>
                        )}
                        {profile.city && (
                            <div className="flex items-center gap-1.5 mb-4">
                                <MapPin size={12} className="text-white/25" />
                                <span className="text-[10px] font-bold text-white/30">{profile.city}</span>
                            </div>
                        )}

                        <div className="flex gap-2.5">
                            {profile.resumeLink && (
                                <a href={profile.resumeLink} target="_blank" rel="noreferrer"
                                    className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-black transition-all hover:brightness-110"
                                    style={{ backgroundColor: brand }}>
                                    <Briefcase size={15} /> Portfolio
                                </a>
                            )}
                            {phone && profile.showPhone && (
                                <a href={`tel:${profile.phoneNumber}`}
                                    className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-white/12 bg-white/5 text-white hover:bg-white/10 transition-all">
                                    <Phone size={15} /> Call
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Summary */}
                {profile.workDetails && (
                    <Glass className="p-5" delay={0.2}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: brand }} />
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">About</p>
                        </div>
                        <p className="text-white/55 text-sm leading-relaxed font-medium">{profile.workDetails}</p>
                    </Glass>
                )}

                {/* Social links */}
                {(profile.instagram || profile.linkedin) && (
                    <Glass className="p-5" delay={0.25}>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">Connect</p>
                        <div className="flex gap-3">
                            {profile.instagram && (
                                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer"
                                    className="flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 border border-white/8 bg-white/4 hover:bg-white/8 transition-all">
                                    <Instagram size={20} style={{ color: brand }} />
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-wider">@{profile.instagram}</span>
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer"
                                    className="flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 border border-white/8 bg-white/4 hover:bg-white/8 transition-all">
                                    <Linkedin size={20} style={{ color: brand }} />
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-wider">LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </Glass>
                )}

                {phone && (
                    <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${profile.ownerName || ''}, I found your profile via QR code.`)}`}
                        target="_blank" rel="noreferrer"
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm border border-[#25D366]/25 bg-[#25D366]/8 text-[#25D366] hover:bg-[#25D366]/15 transition-all">
                        <MessageCircle size={18} /> Message on WhatsApp
                    </a>
                )}

                <GuestbookSection guestbook={guestbook} brand={brand} profile={profile}
                    guestName={guestName} setGuestName={setGuestName}
                    guestMsg={guestMsg} setGuestMsg={setGuestMsg}
                    posting={posting} posted={posted} onSubmit={postGuest} />

                <FreeCTABadge brand={brand} profileType="portfolio" />
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────── */
const GuestbookSection = ({ guestbook, brand, profile, guestName, setGuestName, guestMsg, setGuestMsg, posting, posted, onSubmit }) => (
    <Glass className="p-5" delay={0.45}>
        <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: brand }} />
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Guestbook</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-2.5 mb-5">
            <input value={guestName} onChange={e => setGuestName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-white/20 outline-none font-medium transition-all" />
            <textarea value={guestMsg} onChange={e => setGuestMsg(e.target.value)}
                placeholder="Leave a message..." rows={3} required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-white/20 outline-none font-medium transition-all resize-none" />
            <motion.button type="submit" disabled={posting} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-black transition-all"
                style={{ backgroundColor: posted ? '#22c55e' : brand, boxShadow: posted ? '0 8px 20px rgba(34,197,94,0.35)' : `0 8px 20px ${brand}40` }}>
                {posting ? 'Posting...' : posted ? <><Check size={16} /> Signed!</> : <>Sign Guestbook <ChevronRight size={15} /></>}
            </motion.button>
        </form>
        <div className="space-y-2.5 max-h-52 overflow-y-auto">
            {guestbook?.length > 0 ? guestbook.map((entry, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white/4 border border-white/6">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="font-black text-sm text-white/80">{entry.name || 'Anonymous'}</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-wider">
                            {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">"{entry.message}"</p>
                </motion.div>
            )) : (
                <div className="py-6 text-center text-white/15 text-xs font-black uppercase tracking-widest">Be the first to sign! ✦</div>
            )}
        </div>
    </Glass>
);

const FreeCTABadge = ({ brand, profileType }) => (
    <>
        <div className="flex justify-center">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/4 border border-white/6">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: brand }} />
                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/20">Protected by ScanMyRide</span>
            </div>
        </div>
        <Glass className="overflow-hidden" delay={0.55}>
            <Link to="/register" className="block p-6 text-center group">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity" style={{ backgroundColor: brand }} />
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: brand, boxShadow: `0 12px 30px ${brand}66` }}>
                        <QrCode size={30} className="text-black group-hover:scale-110 transition-transform duration-300" />
                    </div>
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight mb-2">
                    {profileType === 'car' ? 'Create Your Car Profile' : profileType === 'business' ? 'Promote Your Brand' : 'Build Your Portfolio'}
                </h3>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-5 leading-relaxed max-w-xs mx-auto">
                    {profileType === 'car'
                        ? 'Join 10,000+ vehicle owners — smart QR profile, free forever.'
                        : profileType === 'business'
                            ? 'Turn any surface into a marketing channel — free QR for your brand.'
                            : 'Show your work with a smart QR portfolio — free forever.'}
                </p>
                <div className="w-full py-3.5 rounded-2xl font-black text-black flex items-center justify-center gap-2 text-sm group-hover:brightness-110 transition-all"
                    style={{ backgroundColor: brand, boxShadow: `0 8px 24px ${brand}44` }}>
                    Get Free QR Now <ChevronRight size={16} />
                </div>
            </Link>
        </Glass>
        <p className="text-center text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
            Digital Ecosystem · ScanMyRide Systems
        </p>
    </>
);

/* ─────────────────────────────────────────
   MAIN PAGE — routes to correct layout
───────────────────────────────────────── */
const PublicProfile3 = () => {
    const { uniqueId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let retries = 0;
        const load = async () => {
            try {
                const { data } = await api.get(`/api/profile/public/${uniqueId}`);
                setProfile(data); setLoading(false);
            } catch (err) {
                console.error("Profile load err:", err);
                if (retries++ < 2) setTimeout(load, 500);
                else { setError(true); setLoading(false); }
            }
        };
        load();
    }, [uniqueId]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6"
            style={{ background: '#0c0c0e', fontFamily: 'Outfit, sans-serif' }}>
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand/30 border-t-brand animate-spin" />
                <div className="absolute inset-0 rounded-full blur-xl bg-brand/15" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 animate-pulse">Scanning profile...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
            style={{ background: '#0c0c0e', fontFamily: 'Outfit, sans-serif' }}>
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-5">
                <AlertCircle size={36} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Profile Not Found</h1>
            <p className="text-white/30 text-sm font-bold mb-8">Invalid QR or the profile was removed.</p>
            <Link to="/" className="px-6 py-3 rounded-2xl font-black text-black text-sm bg-brand">← Go Home</Link>
        </div>
    );

    /* Derived values */
    const brand = profile.themeColor || '#f4b00b';
    const carImg = profile.carImage
        ? ((profile.carImage.startsWith('http') || profile.carImage.startsWith('data:')) ? profile.carImage : `${API_URL}/${profile.carImage}`)
        : null;
    const avatarImg = profile.profileImage
        ? ((profile.profileImage.startsWith('http') || profile.profileImage.startsWith('data:')) ? profile.profileImage : `${API_URL}/${profile.profileImage}`)
        : null;

    /* Route to correct layout */
    if (profile.profileType === 'business') {
        return <BusinessCard profile={profile} brand={brand} avatarImg={avatarImg} />;
    }
    if (profile.profileType === 'portfolio') {
        return <PortfolioCard profile={profile} brand={brand} avatarImg={avatarImg} />;
    }
    /* Default: car / undefined → vehicle profile (backward compatible) */
    return <VehicleProfile profile={profile} brand={brand} carImg={carImg} avatarImg={avatarImg} />;
};

export default PublicProfile3;
