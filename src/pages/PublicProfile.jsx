import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../api/axios';
import { motion } from 'framer-motion';
import { Phone, User, Briefcase, Instagram, Linkedin, MapPin, AlertCircle, Droplets, ChevronRight, QrCode, ShieldCheck, MessageCircle } from 'lucide-react';

const PublicProfile = () => {
    const { uniqueId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 15; // Increased to handle Render waking up
        const retryDelay = 2000; // 2 seconds between retries

        const fetchProfile = async () => {
            try {
                const res = await api.get(`/api/profile/public/${uniqueId}`);
                setProfile(res.data);
                setLoading(false);
            } catch (err) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchProfile, retryDelay);
                } else {
                    setError('The server is taking longer than expected to wake up. Please refresh the page in a few seconds.');
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [uniqueId]);

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-lg space-y-8">
                {/* Image Placeholder */}
                <div className="h-64 w-full bg-zinc-900 rounded-[2rem] animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                {/* Title Placeholder */}
                <div className="space-y-3">
                    <div className="h-10 w-3/4 bg-zinc-900 rounded-xl animate-pulse" />
                    <div className="h-4 w-1/2 bg-zinc-900 rounded-lg animate-pulse" />
                </div>
                {/* Card Placeholder */}
                <div className="h-48 w-full bg-zinc-900 rounded-[2.5rem] animate-pulse" />
                {/* Action Placeholder */}
                <div className="h-16 w-full bg-zinc-900 rounded-2xl animate-pulse" />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
            <p className="text-slate-400 mt-2">The QR code might be invalid or the profile was deleted.</p>
        </div>
    );

    return (
        <div
            className={`min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] ${profile.fontStyle || 'font-outfit'} selection:bg-[var(--theme-brand)] selection:text-black transition-colors duration-500`}
            data-theme={profile.selectedTheme || 'carbon'}
            data-ui-mode={profile.uiMode || 'dark'}
            style={{ '--theme-brand': profile.themeColor || '#f4b00b' }}
        >
            {/* Dynamic Background Element */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full border-x border-white/5 bg-[var(--theme-bg)] z-0" />

            {/* Header / Car Image */}
            <div className="relative h-[45vh] overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-20" />
                <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    src={profile.carImage ? ((profile.carImage.startsWith('http') || profile.carImage.startsWith('data:')) ? profile.carImage : `${API_URL}/${profile.carImage}`) : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'}
                    className="w-full h-full object-cover opacity-60"
                    alt="Banner"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80';
                    }}
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
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                                {profile.carName}
                            </h1>
                            <div className="bg-[var(--theme-brand)] text-black px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                {profile.profileType || 'CAR'}
                            </div>
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

            <main className="px-4 sm:px-6 pb-20 relative z-20 max-w-lg mx-auto">
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
                    className="bg-[var(--theme-card)] backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 mb-8 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
                >
                    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                        <div className="w-20 h-20 rounded-3xl bg-brand p-[2px] shadow-[0_10px_30px_rgba(244,176,11,0.3)] overflow-hidden">
                            {profile.profileImage ? (
                                <img
                                    src={(profile.profileImage.startsWith('http') || profile.profileImage.startsWith('data:')) ? profile.profileImage : `${API_URL}/${profile.profileImage}`}
                                    className="w-full h-full object-cover rounded-[1.4rem]"
                                    alt={profile.ownerName}
                                    onError={(e) => {
                                        e.target.src = 'https://ui-avatars.com/api/?name=' + profile.ownerName + '&background=000&color=f4b00b&bold=true';
                                    }}
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
                                className="w-full py-4 sm:py-5 rounded-2xl bg-[var(--theme-brand)] text-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-lg sm:text-xl shadow-[0_15px_30px_-10px_var(--theme-glow)]"
                            >
                                <Phone size={20} className="fill-current" />
                                CALL OWNER
                            </a>
                        )}

                        {profile.resumeLink && (
                            <a
                                href={profile.resumeLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-4 rounded-2xl bg-zinc-900 border-2 border-dashed border-[var(--theme-brand)]/30 text-[var(--theme-brand)] hover:border-[var(--theme-brand)] transition-all flex items-center justify-center gap-3 font-black text-sm uppercase"
                            >
                                <Briefcase size={18} />
                                VIEW RESUME / PORTFOLIO
                            </a>
                        )}

                        <div className="flex gap-3 sm:gap-4">
                            {profile.instagram && (
                                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer" className="flex-1 py-4 sm:py-5 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all">
                                    <Instagram size={20} className="text-[var(--theme-brand)]" />
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer" className="flex-1 py-4 sm:py-5 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all">
                                    <Linkedin size={20} className="text-[var(--theme-brand)]" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Professional / Work Details */}
                {(profile.profileType === 'business' || profile.profileType === 'portfolio') && profile.workDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-[var(--theme-card)] backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 mb-8 border border-white/5 shadow-2xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-[var(--theme-brand)] rounded-full" />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Professional Summary</h2>
                        </div>
                        <p className="text-[var(--theme-text)] opacity-80 leading-relaxed font-medium">
                            {profile.workDetails}
                        </p>
                    </motion.div>
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

                {/* Quick Actions (WhatsApp) */}
                <div className="bg-[var(--theme-card)] backdrop-blur-lg p-6 rounded-[2rem] border border-white/5 mb-10 space-y-6">
                    {profile.phoneNumber ? (
                        <>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Instant Alerts (WhatsApp)</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {/* Parking Issue */}
                                <a
                                    href={`https://wa.me/${profile.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${profile.ownerName}, I scanned your ${profile.profileType || 'profile'}.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-4 px-6 bg-zinc-900/50 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 border border-white/5 rounded-2xl flex items-center justify-between transition-all group"
                                >
                                    <span className="font-bold text-sm uppercase tracking-wide text-[var(--theme-text)] group-hover:text-[#25D366]">Send Message</span>
                                    <MessageCircle size={20} className="text-zinc-500 group-hover:text-[#25D366] transition-colors" />
                                </a>

                                {/* Emergency / Contact info */}
                                {profile.profileType === 'car' ? (
                                    <a
                                        href={`https://wa.me/${profile.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Urgent: Please contact regarding your car ${profile.carName} (Auto-Alert)`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-4 px-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl flex items-center justify-between transition-all group"
                                    >
                                        <span className="font-bold text-sm uppercase tracking-wide text-red-500">Emergency Alert</span>
                                        <AlertCircle size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                                    </a>
                                ) : (
                                    <a
                                        href={`tel:${profile.phoneNumber}`}
                                        className="w-full py-4 px-6 bg-[var(--theme-brand)]/10 hover:bg-[var(--theme-brand)]/20 border border-[var(--theme-brand)]/20 rounded-2xl flex items-center justify-between transition-all group"
                                    >
                                        <span className="font-bold text-sm uppercase tracking-wide text-[var(--theme-brand)]">Call Now</span>
                                        <Phone size={20} className="text-[var(--theme-brand)]" />
                                    </a>
                                )}

                                {/* General Contact */}
                                <a
                                    href={`https://wa.me/${profile.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I scanned your car.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-4 px-6 bg-zinc-900/50 hover:bg-[var(--theme-brand)] hover:text-black hover:border-[var(--theme-brand)] border border-white/5 rounded-2xl flex items-center justify-between transition-all group"
                                >
                                    <span className="font-bold text-sm uppercase tracking-wide text-[var(--theme-text)] group-hover:text-black">General Contact</span>
                                    <User size={20} className="text-zinc-500 group-hover:text-black transition-colors" />
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center text-zinc-500 text-xs uppercase font-bold tracking-widest border border-dashed border-zinc-800 rounded-xl">
                            Contact Info Private
                        </div>
                    )}
                </div>

                {/* Guestbook Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-[var(--theme-brand)] rounded-full" />
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Guestbook</h2>
                    </div>

                    <div className="bg-[var(--theme-card)] border border-white/5 rounded-[2rem] p-6 mb-4">
                        <h3 className="text-xl font-black italic mb-4">Leave a Note</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const name = formData.get('name');
                            const message = formData.get('message');

                            try {
                                const res = await api.post(`/api/profile/public/${uniqueId}/guestbook`, { name, message });
                                // Optimistically update or re-fetch
                                // For simplicity re-fetch or append
                                const newEntry = { name: name || 'Anonymous Enthusiast', message, date: new Date().toISOString() };
                                setProfile(prev => ({
                                    ...prev,
                                    guestbook: [newEntry, ...(prev.guestbook || [])]
                                }));
                                e.target.reset();
                            } catch (err) {
                                console.error(err);
                                alert('Could not post message.');
                            }
                        }} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name (Optional)"
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-brand)] transition-colors placeholder:text-zinc-600"
                            />
                            <textarea
                                name="message"
                                rows="3"
                                placeholder="Nice ride! Love the wheels..."
                                required
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-brand)] transition-colors placeholder:text-zinc-600 resize-none"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-[var(--theme-brand)] text-black font-black uppercase tracking-widest py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                Sign Guestbook <ChevronRight size={16} />
                            </button>
                        </form>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {profile.guestbook && profile.guestbook.length > 0 ? (
                            profile.guestbook.map((entry, index) => (
                                <div key={index} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-[var(--theme-text)] text-sm">{entry.name}</span>
                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(entry.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-zinc-400 text-xs leading-relaxed">"{entry.message}"</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-zinc-600 text-xs font-bold uppercase tracking-widest italic">
                                Be the first to sign the guestbook!
                            </div>
                        )}
                    </div>
                </motion.div>

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
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">Want a Smart {profile.profileType === 'car' ? 'Car' : 'Brand'} Profile?</h3>
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Join 10,000+ users protecting their {profile.profileType === 'car' ? 'vehicles' : 'identity'} with ScanMyRide.</p>

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
