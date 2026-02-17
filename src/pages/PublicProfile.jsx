import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Phone, User, Briefcase, Instagram, Linkedin, MapPin, AlertCircle, Droplets, ChevronRight, QrCode, ShieldCheck, Gauge, Zap, Cog, Play, Youtube } from 'lucide-react';

const PublicProfile = () => {
    const { uniqueId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.29.115:5000';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/profile/public/${uniqueId}`);
                setProfile(res.data);
                setLoading(false);
            } catch (err) {
                setError('Profile not found');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [uniqueId, API_URL]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-white">Ops! Car Profile Not Found</h1>
            <p className="text-slate-400 mt-2">The QR code might be invalid or the profile was deleted.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans selection:bg-[var(--theme-brand)] selection:text-black" data-theme={profile.selectedTheme || 'carbon'}>
            {/* Dynamic Background Element */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full border-x border-white/5 bg-[var(--theme-bg)] z-0" />

            {/* Header / Car Image */}
            <div className="relative h-[45vh] overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-20" />
                <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    src={profile.carImage ? (profile.carImage.startsWith('http') ? profile.carImage : `${API_URL}/${profile.carImage}`) : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'}
                    className="w-full h-full object-cover opacity-60"
                    alt="Car"
                />

                {/* Brand Overlay */}
                <div className="absolute top-8 left-8 z-30">
                    <Logo className="w-8 h-8" />
                </div>

                <div className="absolute bottom-10 left-8 z-30">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                                {profile.carName}
                            </h1>
                            {profile.isVerified && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-8 h-8 rounded-full bg-[var(--theme-brand)] flex items-center justify-center shadow-[0_0_20px_rgba(244,176,11,0.6)]"
                                >
                                    <ShieldCheck size={18} className="text-black fill-current" />
                                </motion.div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--theme-brand)] font-bold text-sm tracking-widest uppercase">
                            <div className="w-4 h-[2px] bg-[var(--theme-brand)]"></div>
                            {profile.isVerified ? 'VERIFIED BUILD AUTHENTICATED' : 'VIP Profile Verified'}
                        </div>
                    </motion.div>
                </div>
            </div>

            <main className="px-6 pb-20 relative z-20 max-w-lg mx-auto">
                {/* Emergency Mode Alert */}
                {profile.emergencyMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 rounded-[2rem] bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center gap-4 text-black"
                    >
                        <AlertCircle size={32} className="flex-shrink-0 animate-bounce" />
                        <div>
                            <p className="font-black text-xl leading-tight uppercase">EMERGENCY ACTIVE</p>
                            <p className="text-sm font-bold opacity-80 uppercase tracking-tighter">Please help the owner immediately</p>
                        </div>
                    </motion.div>
                )}

                {/* Owner Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-[var(--theme-card)] backdrop-blur-xl rounded-[2.5rem] p-8 mb-8 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
                >
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-3xl bg-brand p-[2px] shadow-[0_10px_30px_rgba(244,176,11,0.3)] overflow-hidden">
                            {profile.profileImage ? (
                                <img
                                    src={`${API_URL}/${profile.profileImage}`}
                                    className="w-full h-full object-cover rounded-[1.4rem]"
                                    alt={profile.ownerName}
                                />
                            ) : (
                                <div className="w-full h-full rounded-[1.4rem] bg-black flex items-center justify-center">
                                    <User size={32} className="text-brand" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">{profile.ownerName}</h2>
                            <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                                <Briefcase size={12} className="text-brand" />
                                <span>{profile.profession || 'Premium Member'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {profile.showPhone && (
                            <a
                                href={`tel:${profile.phoneNumber}`}
                                className="w-full py-5 rounded-2xl bg-[var(--theme-brand)] text-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-xl shadow-[0_15px_30px_-10px_var(--theme-glow)]"
                            >
                                <Phone size={24} className="fill-current" />
                                CALL OWNER
                            </a>
                        )}

                        <div className="flex gap-4">
                            {profile.instagram && (
                                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" className="flex-1 py-5 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all">
                                    <Instagram size={24} className="text-[var(--theme-brand)]" />
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" className="flex-1 py-5 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all">
                                    <Linkedin size={24} className="text-[var(--theme-brand)]" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Spec-Sheet Layout (Performance Metrics) */}
                {(profile.specs?.hp || profile.specs?.torque || profile.specs?.engine) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Gauge size={18} className="text-[var(--theme-brand)]" />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Performance Specs</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[var(--theme-card)] border border-white/5 p-4 rounded-2xl text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--theme-brand)] opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                <Zap size={14} className="mx-auto mb-2 text-[var(--theme-brand)]" />
                                <div className="text-xl font-black text-[var(--theme-text)]">{profile.specs?.hp || '--'}</div>
                                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">BHP</div>
                            </div>
                            <div className="bg-[var(--theme-card)] border border-white/5 p-4 rounded-2xl text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--theme-brand)] opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                <Gauge size={14} className="mx-auto mb-2 text-[var(--theme-brand)]" />
                                <div className="text-xl font-black text-[var(--theme-text)]">{profile.specs?.torque || '--'}</div>
                                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Torque</div>
                            </div>
                            <div className="bg-[var(--theme-card)] border border-white/5 p-4 rounded-2xl text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--theme-brand)] opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                <Cog size={14} className="mx-auto mb-2 text-[var(--theme-brand)]" />
                                <div className="text-[10px] font-black text-[var(--theme-text)] leading-none mt-1 uppercase truncate overflow-hidden block">{profile.specs?.engine || 'Stock'}</div>
                                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Engine</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Build Video / Reels */}
                {profile.youtubeLink && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <a
                            href={profile.youtubeLink}
                            target="_blank"
                            className="flex items-center justify-between p-6 rounded-3xl bg-red-600/10 border border-red-600/20 group hover:bg-red-600/20 transition-all overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-3xl -mr-10 -mt-10" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play size={24} className="text-white fill-current translate-x-0.5" />
                                </div>
                                <div>
                                    <div className="text-white font-black uppercase tracking-tighter text-lg italic">Watch the Build</div>
                                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                        <Youtube size={12} /> Full Cinematic Video
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-red-500 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                )}

                {/* Modifications List */}
                {profile.specs?.mods && (
                    <div className="mb-8 bg-[var(--theme-card)] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-[var(--theme-brand)]/10 flex items-center justify-center">
                                <Cog size={14} className="text-[var(--theme-brand)]" />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">Modifications List</h2>
                        </div>
                        <div className="text-sm font-bold text-zinc-400 leading-relaxed italic whitespace-pre-wrap">
                            {profile.specs.mods}
                        </div>
                    </div>
                )}

                {/* Essential Info Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-8">
                    {profile.city && (
                        <div className="bg-[var(--theme-card)] backdrop-blur-lg p-5 rounded-[1.8rem] border border-white/5">
                            <div className="text-[var(--theme-brand)] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                                <MapPin size={12} /> Registry
                            </div>
                            <div className="font-bold text-lg leading-tight uppercase text-[var(--theme-text)] break-words">{profile.city}</div>
                        </div>
                    )}
                    {profile.bloodGroup && (
                        <div className="bg-[var(--theme-card)] backdrop-blur-lg p-5 rounded-[1.8rem] border border-white/5 text-center xs:text-left">
                            <div className="text-[var(--theme-brand)] text-[10px] font-black uppercase tracking-widest flex items-center justify-center xs:justify-start gap-2 mb-2">
                                <Droplets size={12} /> Blood Type
                            </div>
                            <div className="font-bold text-lg leading-tight uppercase text-red-500">{profile.bloodGroup}</div>
                        </div>
                    )}
                </div>

                {/* Secondary Actions */}
                {profile.emergencyContact && (
                    <div className="bg-[var(--theme-card)] backdrop-blur-lg p-6 rounded-[2rem] border border-white/5 mb-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--theme-brand)]/5 rounded-full blur-3xl -mr-10 -mt-10" />
                        <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Family/SOS Contact</div>
                        <div className="font-black text-xl flex items-center justify-between">
                            <span className="text-[var(--theme-text)]">{profile.emergencyContact}</span>
                            <a href={`tel:${profile.emergencyContact}`} className="bg-[var(--theme-brand)] text-black p-3 rounded-xl hover:scale-110 transition-transform">
                                <Phone size={18} />
                            </a>
                        </div>
                    </div>
                )}

                {/* Secure Badge */}
                <div className="mt-12 flex flex-col items-center">
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-950 border border-white/5 shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-[var(--theme-brand)] animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Secure Scan Protection</span>
                    </div>
                </div>

                {/* Free QR CTA Box */}
                <div className="mt-8 mb-12">
                    <Link to="/register" className="block relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-brand)] to-yellow-500 opacity-10 group-hover:opacity-20 transition-opacity rounded-[2.5rem]"></div>
                        <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-[var(--theme-brand)]/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--theme-brand)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,176,11,0.3)] group-hover:scale-110 transition-transform duration-500">
                                <QrCode size={32} className="text-black" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">Want this for your Car?</h3>
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Join 10,000+ owners protecting their vehicles with ScanMyRide.</p>

                            <div className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-black font-black uppercase tracking-widest rounded-xl group-hover:shadow-[0_0_20px_rgba(244,176,11,0.4)] transition-all">
                                Get Free QR Now <ChevronRight size={18} />
                            </div>
                        </div>
                    </Link>
                    <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.1em] mt-8 text-center">Digital Ecosystem by SCANMYRIDE Systems</p>
                </div>
            </main>
        </div>
    );
};

export default PublicProfile;
