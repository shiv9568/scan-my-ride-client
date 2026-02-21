import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, User, Briefcase, Instagram, Linkedin, MapPin,
    AlertCircle, Droplets, ChevronRight, QrCode, ShieldCheck,
    MessageCircle, Zap, Car, Gauge, Wrench, Youtube, Check,
    Shield, ExternalLink
} from 'lucide-react';

/* ── Orb component – floating blurred gradient spheres ── */
const Orb = ({ className }) => (
    <div className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`} />
);

/* ── Glass card ── */
const Glass = ({ children, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`bg-white/8 backdrop-blur-xl border border-white/12 rounded-[1.75rem] ${className}`}
        style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)' }}
    >
        {children}
    </motion.div>
);

/* ── Pill label ── */
const Pill = ({ icon: Icon, text, color }) => (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest"
        style={{ backgroundColor: color + '18', border: `1px solid ${color}30`, color }}>
        {Icon && <Icon size={10} />} {text}
    </div>
);

/* ── Action row button ── */
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

/* ─────────────── MAIN PAGE ─────────────── */
const PublicProfile3 = () => {
    const { uniqueId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestMsg, setGuestMsg] = useState('');
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);

    useEffect(() => {
        let retries = 0;
        const load = async () => {
            try {
                const { data } = await api.get(`/api/profile/public/${uniqueId}`);
                setProfile(data); setLoading(false);
            } catch {
                if (retries++ < 15) setTimeout(load, 2000);
                else { setError(true); setLoading(false); }
            }
        };
        load();
    }, [uniqueId]);

    const postGuest = async (e) => {
        e.preventDefault(); setPosting(true);
        try {
            await api.post(`/api/profile/public/${uniqueId}/guestbook`, { name: guestName, message: guestMsg });
            const entry = { name: guestName || 'Anonymous', message: guestMsg, date: new Date().toISOString() };
            setProfile(prev => ({ ...prev, guestbook: [entry, ...(prev.guestbook || [])] }));
            setGuestName(''); setGuestMsg(''); setPosted(true);
            setTimeout(() => setPosted(false), 3500);
        } catch { alert('Could not post.'); }
        setPosting(false);
    };

    /* ── Loading ── */
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

    /* ── Derived values ── */
    const brand = profile.themeColor || '#a855f7';
    const phone = profile.phoneNumber?.replace(/\D/g, '');
    const carImg = profile.carImage
        ? ((profile.carImage.startsWith('http') || profile.carImage.startsWith('data:')) ? profile.carImage : `${API_URL}/${profile.carImage}`)
        : null;
    const avatarImg = profile.profileImage
        ? ((profile.profileImage.startsWith('http') || profile.profileImage.startsWith('data:')) ? profile.profileImage : `${API_URL}/${profile.profileImage}`)
        : null;

    return (
        <div className="min-h-screen relative overflow-x-hidden text-white"
            style={{ background: '#0c0c0e', fontFamily: 'Outfit, sans-serif' }}>

            {/* ── FLOATING ORBS ── */}
            <Orb className="top-[-5%]  left-[-10%]  w-72 h-72  bg-amber-400/15" />
            <Orb className="top-[8%]   right-[-8%]  w-56 h-56  bg-yellow-500/12" />
            <Orb className="top-[35%]  left-[-5%]   w-48 h-48  bg-amber-300/10" />
            <Orb className="top-[60%]  right-[-10%] w-64 h-64  bg-yellow-400/8" />
            <Orb className="bottom-[5%] left-[20%]  w-52 h-52  bg-amber-500/10" />

            {/* ── HERO HERO HEADER ── */}
            <div className="relative h-[55vw] max-h-[340px] min-h-[220px] overflow-hidden">
                {/* Car image or purple gradient */}
                {carImg ? (
                    <>
                        <motion.img src={carImg} alt="Banner"
                            initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                            onError={e => e.target.style.display = 'none'}
                            className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618]/50 via-[#0d0618]/20 to-[#0d0618]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0618]/70 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-violet-900/40 to-[#0d0618]" />
                )}

                {/* Top pill */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md z-10">
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: brand }}>
                        <Zap size={8} className="text-black" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/60">ScanMyRide</span>
                </div>

                {/* Profile type badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md z-10">
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: brand }}>
                        {profile.profileType || 'CAR'}
                    </span>
                </div>

                {/* Car name + avatar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 flex items-end justify-between z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1 opacity-70" style={{ color: brand }}>
                            {profile.isVerified ? '✦ Verified Build' : '⦿ Live Profile'}
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none uppercase drop-shadow-2xl">
                            {profile.carName || 'Profile'}
                        </h1>
                    </motion.div>

                    {avatarImg && (
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                            className="w-16 h-16 rounded-[1.25rem] overflow-hidden flex-shrink-0 border-2"
                            style={{ borderColor: brand + '88', boxShadow: `0 8px 24px ${brand}44` }}>
                            <img src={avatarImg} alt={profile.ownerName} className="w-full h-full object-cover" />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ── BODY ── */}
            <main className="max-w-lg mx-auto px-4 pt-5 pb-28 space-y-4 relative z-10">

                {/* ── EMERGENCY SOS ── */}
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

                {/* ── OWNER CARD ── */}
                <Glass className="p-5" delay={0.15}>
                    <div className="flex items-center gap-4 mb-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2"
                            style={{ borderColor: brand + '55', boxShadow: `0 4px 20px ${brand}33` }}>
                            {avatarImg
                                ? <img src={avatarImg} alt="Owner" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center bg-white/5"><User size={26} style={{ color: brand }} /></div>
                            }
                        </div>
                        {/* Name & info */}
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

                    {/* Pill row */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {profile.bloodGroup && <Pill icon={Droplets} text={profile.bloodGroup} color="#ef4444" />}
                        <Pill icon={null} text={profile.isPublic ? 'Public' : 'Private'} color={profile.isPublic ? '#34d399' : '#f87171'} />
                        {profile.emergencyMode && <Pill icon={AlertCircle} text="SOS ON" color="#ef4444" />}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2.5">
                        {profile.showPhone && profile.phoneNumber && (
                            <motion.a href={`tel:${profile.phoneNumber}`}
                                whileTap={{ scale: 0.97 }}
                                className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 text-black"
                                style={{ backgroundColor: brand, boxShadow: `0 8px 28px ${brand}55` }}>
                                <Phone size={20} className="fill-current" /> CALL OWNER
                            </motion.a>
                        )}
                        {profile.resumeLink && (
                            <a href={profile.resumeLink} target="_blank" rel="noreferrer"
                                className="w-full py-3 rounded-2xl font-black flex items-center justify-center gap-2 text-white/60 border border-white/10 bg-white/5 hover:bg-white/8 transition-all text-sm">
                                <Briefcase size={16} /> Portfolio / Resume
                            </a>
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

                {/* ── SPEC SHEET (cars) ── */}
                {profile.profileType === 'car' && (profile.specs?.hp || profile.specs?.torque || profile.specs?.engine || profile.specs?.mods) && (
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

                {/* ── PROFESSIONAL SUMMARY ── */}
                {(profile.profileType === 'business' || profile.profileType === 'portfolio') && profile.workDetails && (
                    <Glass className="p-5" delay={0.25}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: brand }} />
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Professional Summary</p>
                        </div>
                        <p className="text-white/55 text-sm leading-relaxed font-medium">{profile.workDetails}</p>
                    </Glass>
                )}

                {/* ── QUICK ACTIONS via WhatsApp ── */}
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
                                href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${profile.ownerName || ''}, I scanned your ${profile.profileType || 'profile'}.`)}`}
                                target="_blank" icon={MessageCircle} color="#25D366"
                                label="Send Message" sub="Opens WhatsApp instantly" />
                            {profile.profileType === 'car' ? (
                                <ActionRow
                                    href={`https://wa.me/${phone}?text=${encodeURIComponent(`URGENT: Regarding your car ${profile.carName} — please respond.`)}`}
                                    target="_blank" icon={AlertCircle} color="#ef4444"
                                    label="Emergency Alert" sub="Sends urgent WA message" />
                            ) : (
                                <ActionRow href={`tel:${profile.phoneNumber}`} icon={Phone} color={brand}
                                    label="Call Now" sub={profile.phoneNumber} />
                            )}
                            <ActionRow
                                href={`https://wa.me/${phone}?text=${encodeURIComponent('Hi, I scanned your QR code.')}`}
                                target="_blank" icon={User} color="rgba(255,255,255,0.4)"
                                label="General Contact" sub="Say hello" />
                        </div>
                    </Glass>
                )}

                {/* ── LOCATION & BLOOD INFO MINI CARDS ── */}
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

                {/* ── GUESTBOOK ── */}
                <Glass className="p-5" delay={0.45}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: brand }} />
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Guestbook</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={postGuest} className="space-y-2.5 mb-5">
                        <input value={guestName} onChange={e => setGuestName(e.target.value)}
                            placeholder="Your name (optional)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-white/20 outline-none font-medium transition-all" />
                        <textarea value={guestMsg} onChange={e => setGuestMsg(e.target.value)}
                            placeholder="Nice ride! Love the specs..." rows={3} required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-white/20 outline-none font-medium transition-all resize-none" />
                        <motion.button type="submit" disabled={posting} whileTap={{ scale: 0.97 }}
                            className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-black transition-all"
                            style={{ backgroundColor: posted ? '#22c55e' : brand, boxShadow: posted ? '0 8px 20px rgba(34,197,94,0.35)' : `0 8px 20px ${brand}40` }}>
                            {posting ? 'Posting...' : posted ? <><Check size={16} /> Signed!</> : <>Sign Guestbook <ChevronRight size={15} /></>}
                        </motion.button>
                    </form>

                    {/* Entries */}
                    <div className="space-y-2.5 max-h-52 overflow-y-auto">
                        {profile.guestbook?.length > 0 ? (
                            profile.guestbook.map((entry, i) => (
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
                            ))
                        ) : (
                            <div className="py-6 text-center text-white/15 text-xs font-black uppercase tracking-widest">
                                Be the first to sign! ✦
                            </div>
                        )}
                    </div>
                </Glass>

                {/* ── SECURE BADGE ── */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/4 border border-white/6">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: brand }} />
                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/20">Protected by ScanMyRide</span>
                    </div>
                </div>

                {/* ── FREE QR CTA ── */}
                <Glass className="overflow-hidden" delay={0.55}>
                    <Link to="/register" className="block p-6 text-center group">
                        {/* Glow orb inside card */}
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: brand }} />
                            <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: brand, boxShadow: `0 12px 30px ${brand}66` }}>
                                <QrCode size={30} className="text-black group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </div>
                        <h3 className="font-black text-xl uppercase tracking-tight mb-2">
                            Want Your Own{'\n'}{profile.profileType === 'car' ? 'Car Profile' : 'Smart Profile'}?
                        </h3>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-5 leading-relaxed max-w-xs mx-auto">
                            Join 10,000+ users protecting their {profile.profileType === 'car' ? 'vehicles' : 'identity'} with ScanMyRide — free forever.
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
            </main>
        </div>
    );
};

export default PublicProfile3;
