import { useState, useEffect, useContext } from 'react';
import Logo from '../components/Logo';
import { AuthContext } from '../context/AuthContext';
import api, { API_URL } from '../api/axios';
import StylishQR from '../components/StylishQR';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    LogOut, ExternalLink, Download, User, Car, Plus,
    QrCode, Settings, ShieldCheck, Eye, EyeOff,
    AlertCircle, Save, Camera, Check, ChevronDown,
    Zap, LayoutDashboard, Palette, Instagram, Linkedin,
    Droplets, MapPin
} from 'lucide-react';

/* ── tiny helpers ── */
const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/5 backdrop-blur-md border border-white/8 rounded-3xl ${className}`}>
        {children}
    </div>
);

const inp = "w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white focus:border-brand/60 focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-sm placeholder:text-white/20";
const lbl = "block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5";

const TABS = [
    { id: 'home', icon: LayoutDashboard, label: 'Home' },
    { id: 'identity', icon: User, label: 'Identity' },
    { id: 'socials', icon: Instagram, label: 'Socials' },
    { id: 'theme', icon: Palette, label: 'Theme' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

/* ─────────── MAIN COMPONENT ─────────── */
const Dashboard3 = () => {
    const { logout, user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('home');
    const [profiles, setProfiles] = useState([]);
    const [activeProfileIndex, setActiveProfileIndex] = useState(0);
    const [showFleet, setShowFleet] = useState(false);
    const [profile, setProfile] = useState({
        carName: '', ownerName: '', phoneNumber: '', profession: '',
        instagram: '', linkedin: '', emergencyContact: '', bloodGroup: '',
        city: '', isPublic: true, showPhone: true, emergencyMode: false,
        uniqueId: '', themeColor: '#f4b00b', selectedTheme: 'carbon',
        uiMode: 'dark', fontStyle: 'font-outfit', profileType: 'car',
        resumeLink: '', workDetails: '', youtubeLink: '',
        specs: { hp: '', torque: '', engine: '', mods: '' }
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedCarFile, setSelectedCarFile] = useState(null);
    const [carPreview, setCarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [success, setSuccess] = useState(false);

    const publicUrl = `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/p/${profile.uniqueId}`;

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/api/profile/me');
                if (res.data.length > 0) {
                    setProfiles(res.data);
                    const lastId = localStorage.getItem('lastProfileId');
                    const idx = Math.max(0, res.data.findIndex(p => p.uniqueId === lastId));
                    setActiveProfileIndex(idx);
                    const p = res.data[idx];
                    setProfile({ ...p, customQrLogo: p.customQrLogo || '' });
                    if (p.profileImage) setPreview((p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`);
                    if (p.carImage) setCarPreview((p.carImage.startsWith('http') || p.carImage.startsWith('data:')) ? p.carImage : `${API_URL}/${p.carImage}`);
                }
                setLoading(false);
            } catch { setLoading(false); }
        };
        fetch();
    }, []);

    const switchProfile = (i) => {
        setActiveProfileIndex(i);
        const p = profiles[i];
        setProfile({ ...p, customQrLogo: p.customQrLogo || '' });
        localStorage.setItem('lastProfileId', p.uniqueId);
        setPreview(p.profileImage ? ((p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`) : null);
        setCarPreview(p.carImage ? ((p.carImage.startsWith('http') || p.carImage.startsWith('data:')) ? p.carImage : `${API_URL}/${p.carImage}`) : null);
        setShowFleet(false);
    };

    const addNewCar = () => {
        setProfile({ carName: '', ownerName: '', phoneNumber: '', profession: '', instagram: '', linkedin: '', emergencyContact: '', bloodGroup: '', city: '', isPublic: true, showPhone: true, emergencyMode: false, themeColor: '#f4b00b', selectedTheme: 'carbon', uiMode: 'dark', fontStyle: 'font-outfit', profileType: 'car', resumeLink: '', workDetails: '', youtubeLink: '', specs: { hp: '', torque: '', engine: '', mods: '' }, uniqueId: '' });
        setActiveProfileIndex(-1); setPreview(null); setCarPreview(null); setSelectedFile(null); setSelectedCarFile(null);
        setShowFleet(false); setActiveTab('identity');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true);
        const fd = new FormData();
        Object.keys(profile).forEach(k => {
            if (['customQrLogo', 'profileImage', 'carImage', '_id', '__v'].includes(k)) return;
            if (k === 'specs') fd.append('specs', JSON.stringify(profile.specs));
            else if (profile[k] !== null) fd.append(k, profile[k]);
        });
        if (profile._id) fd.append('id', profile._id);
        if (selectedFile) fd.append('profileImage', selectedFile);
        if (selectedCarFile) fd.append('carImage', selectedCarFile);
        try {
            const res = await api.post('/api/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const ref = await api.get('/api/profile/me');
            setProfiles(ref.data);
            const ui = ref.data.findIndex(p => p.uniqueId === res.data.uniqueId);
            setActiveProfileIndex(ui); setProfile(ref.data[ui]);
            setSuccess(true); setTimeout(() => setSuccess(false), 3000);
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const downloadQR = () => {
        const node = document.getElementById('d3-sticker-dl');
        if (!node) return; setDownloading(true);
        toPng(node, { quality: 1, pixelRatio: 4, backgroundColor: null })
            .then(url => { const a = document.createElement('a'); a.download = `ScanMyRide-${profile.uniqueId}.png`; a.href = url; a.click(); setDownloading(false); })
            .catch(() => setDownloading(false));
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Loading fleet...</p>
            </div>
        </div>
    );

    /* ── stat cards for home view ── */
    const stats = [
        { label: 'Fleet Size', value: profiles.length || 0, icon: Car, color: '#f4b00b' },
        { label: 'Profile Type', value: profile.profileType?.toUpperCase() || '—', icon: User, color: '#60a5fa' },
        { label: 'Visibility', value: profile.isPublic ? 'PUBLIC' : 'PRIVATE', icon: Eye, color: '#34d399' },
        { label: 'Emergency', value: profile.emergencyMode ? 'ACTIVE' : 'OFF', icon: AlertCircle, color: profile.emergencyMode ? '#f87171' : '#a1a1aa' },
    ];

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-white flex" style={{ fontFamily: 'Outfit, sans-serif' }}>

            {/* ── LEFT SIDEBAR ── */}
            <aside className="hidden lg:flex w-[72px] flex-shrink-0 flex-col items-center py-7 gap-5 border-r border-white/5 bg-black/40 fixed h-full z-50">
                <div className="mb-3">
                    <Logo className="w-9 h-9" iconOnly />
                </div>
                <div className="flex-1 flex flex-col gap-2 w-full px-2">
                    {TABS.map(t => {
                        const Icon = t.icon;
                        const active = activeTab === t.id;
                        return (
                            <button key={t.id} onClick={() => setActiveTab(t.id)} title={t.label}
                                className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-brand text-black shadow-[0_0_20px_rgba(244,176,11,0.4)]' : 'text-white/30 hover:bg-white/5 hover:text-white/70'}`}>
                                <Icon size={20} />
                            </button>
                        );
                    })}
                </div>
                {user?.role === 'admin' && (
                    <Link to="/admin" title="Admin" className="w-10 h-10 rounded-2xl flex items-center justify-center text-purple-400 hover:bg-purple-500/10 transition-all">
                        <ShieldCheck size={20} />
                    </Link>
                )}
                <button onClick={logout} title="Logout" className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut size={20} />
                </button>
            </aside>

            {/* ── MAIN AREA ── */}
            <div className="flex-1 lg:ml-[72px] flex flex-col min-h-screen overflow-y-auto pb-24 lg:pb-0">

                {/* ── TOP BAR ── */}
                <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-white/5">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">ScanMyRide Dashboard</p>
                        <p className="font-black text-lg leading-none mt-0.5">
                            {TABS.find(t => t.id === activeTab)?.label}
                            <span className="text-brand">.</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Profile switcher */}
                        <button onClick={() => setShowFleet(!showFleet)}
                            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/8 hover:border-brand/30 transition-all text-sm">
                            <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center overflow-hidden">
                                {preview ? <img src={preview} className="w-full h-full object-cover" alt="" /> : <Car size={12} className="text-brand" />}
                            </div>
                            <span className="font-black text-xs max-w-[90px] truncate text-white/70">{profile.carName || 'My Profile'}</span>
                            <ChevronDown size={12} className={`text-white/40 transition-transform ${showFleet ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-black text-xs">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* Fleet dropdown */}
                    <AnimatePresence>
                        {showFleet && (
                            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                className="absolute right-5 top-16 w-72 bg-[#18181b] border border-white/10 rounded-3xl p-3 shadow-2xl z-50 space-y-2">
                                {profiles.map((p, i) => (
                                    <button key={p._id} onClick={() => switchProfile(i)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${activeProfileIndex === i ? 'bg-brand/10 border border-brand/30' : 'hover:bg-white/5 border border-transparent'}`}>
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {p.profileImage ? <img src={(p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`} className="w-full h-full object-cover" alt="" /> : <Car size={16} className="text-brand" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-black text-sm truncate">{p.carName || 'Unnamed'}</div>
                                            <div className="text-[9px] text-white/30 font-bold uppercase">{p.uniqueId}</div>
                                        </div>
                                        {activeProfileIndex === i && <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center flex-shrink-0"><Check size={8} className="text-black" /></div>}
                                    </button>
                                ))}
                                <button onClick={addNewCar} className="w-full flex items-center gap-2 p-3 rounded-2xl border border-dashed border-white/10 hover:border-brand/30 text-white/30 hover:text-brand transition-all text-sm font-black">
                                    <Plus size={16} /> Add New Vehicle
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                {/* ── CONTENT PANELS ── */}
                <div className="flex-1 p-4 lg:p-6">
                    <AnimatePresence mode="wait">

                        {/* ══════════ HOME ══════════ */}
                        {activeTab === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                                {/* HERO CARD */}
                                <GlassCard className="relative overflow-hidden min-h-[240px] lg:min-h-[290px]">
                                    {/* Car banner as background */}
                                    {carPreview ? (
                                        <img src={carPreview} alt="Car" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-black/40" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                                    {/* Profile avatar - right side like the reference image */}
                                    {preview && (
                                        <div className="absolute right-0 bottom-0 h-full w-2/5 max-w-[200px]">
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover object-top opacity-70" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)' }} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10 p-6 lg:p-8">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand mb-2">Active Profile</p>
                                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-1">
                                            {profile.carName || 'Your Vehicle'}
                                        </h2>
                                        <p className="text-white/50 font-bold text-sm mb-6">{profile.ownerName || 'Set up your profile'} • {profile.city || 'Location'}</p>

                                        <div className="flex gap-3 flex-wrap">
                                            <a href={publicUrl} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 bg-brand text-black rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-[0_8px_20px_rgba(244,176,11,0.3)]">
                                                <ExternalLink size={16} /> View Profile
                                            </a>
                                            {profile.uniqueId && (
                                                <button onClick={downloadQR} disabled={downloading}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/15 text-white rounded-2xl font-black text-sm hover:bg-white/15 transition-all">
                                                    <Download size={16} className={downloading ? 'animate-bounce' : ''} />
                                                    {downloading ? 'Generating...' : 'QR Sticker'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Inline mini stats */}
                                        <div className="flex gap-6 mt-6 pt-6 border-t border-white/8">
                                            {[
                                                { v: profile.bloodGroup || '—', l: 'Blood Group' },
                                                { v: profile.profileType?.toUpperCase() || '—', l: 'Mode' },
                                                { v: profile.isPublic ? '🟢 On' : '🔴 Off', l: 'Visibility' },
                                                { v: profile.emergencyMode ? '🚨 SOS' : '✅ Safe', l: 'Emergency' },
                                            ].map(s => (
                                                <div key={s.l}>
                                                    <div className="font-black text-sm text-white">{s.v}</div>
                                                    <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider">{s.l}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* STAT CARDS */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map(s => {
                                        const Icon = s.icon;
                                        return (
                                            <GlassCard key={s.label} className="p-5">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.color + '22' }}>
                                                    <Icon size={18} style={{ color: s.color }} />
                                                </div>
                                                <div className="font-black text-xl text-white">{s.value}</div>
                                                <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">{s.label}</div>
                                            </GlassCard>
                                        );
                                    })}
                                </div>

                                {/* BOTTOM ROW: QR + Fleet list */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* QR Card */}
                                    <GlassCard className="p-5 flex flex-col items-center gap-4">
                                        <div className="w-full flex items-center justify-between mb-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Your QR Sticker</p>
                                            <Zap size={14} className="text-brand" />
                                        </div>
                                        {profile.uniqueId ? (
                                            <>
                                                <div className="scale-[0.75] -my-4">
                                                    <StylishQR id="stylish-sticker" value={publicUrl} bgColor={profile.themeColor} />
                                                </div>
                                                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                                                    <StylishQR id="d3-sticker-dl" value={publicUrl} isForDownload bgColor={profile.themeColor} />
                                                </div>
                                                <p className="text-[9px] text-white/20 font-bold text-center tracking-wider">/p/{profile.uniqueId}</p>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 py-8">
                                                <QrCode size={40} className="text-white/10" />
                                                <p className="text-xs text-white/30 font-bold text-center">Fill identity to generate QR</p>
                                                <button onClick={() => setActiveTab('identity')} className="px-4 py-2 bg-brand text-black rounded-xl font-black text-xs">Set Up →</button>
                                            </div>
                                        )}
                                    </GlassCard>

                                    {/* Fleet List */}
                                    <GlassCard className="lg:col-span-2 p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Your Fleet</p>
                                            <button onClick={addNewCar} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-brand font-black text-[10px] hover:bg-brand/20 transition-all">
                                                <Plus size={12} /> Add
                                            </button>
                                        </div>
                                        {profiles.length === 0 ? (
                                            <div className="text-center py-8 text-white/20 text-xs font-bold">No vehicles yet</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {/* table header */}
                                                <div className="grid grid-cols-3 gap-2 px-3 pb-2 border-b border-white/5">
                                                    {['Vehicle', 'Type', 'Status'].map(h => <p key={h} className="text-[8px] font-black uppercase tracking-widest text-white/20">{h}</p>)}
                                                </div>
                                                {profiles.map((p, i) => (
                                                    <button key={p._id} onClick={() => switchProfile(i)}
                                                        className={`w-full grid grid-cols-3 gap-2 items-center p-3 rounded-2xl transition-all text-left ${activeProfileIndex === i ? 'bg-brand/10 border border-brand/20' : 'hover:bg-white/5 border border-transparent'}`}>
                                                        {/* name + avatar */}
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden bg-white/5 flex items-center justify-center">
                                                                {p.profileImage ? <img src={(p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`} className="w-full h-full object-cover" alt="" /> : <Car size={14} className="text-brand/60" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-black text-xs truncate">{p.carName || 'Unnamed'}</div>
                                                                <div className="text-[8px] text-white/25 font-bold truncate">{p.ownerName}</div>
                                                            </div>
                                                        </div>
                                                        {/* type */}
                                                        <div className="text-[9px] font-black uppercase tracking-wider text-white/40">{p.profileType || 'car'}</div>
                                                        {/* status */}
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${p.isPublic ? 'bg-green-400' : 'bg-red-400'}`} />
                                                            <span className="text-[9px] font-bold text-white/40">{p.isPublic ? 'Public' : 'Private'}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </GlassCard>
                                </div>
                            </motion.div>
                        )}

                        {/* ══════════ IDENTITY ══════════ */}
                        {activeTab === 'identity' && (
                            <motion.div key="identity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                                    {/* Left: Images */}
                                    <div className="space-y-4">
                                        {/* Avatar */}
                                        <GlassCard className="p-4 flex flex-col items-center gap-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 self-start">Profile Photo</p>
                                            <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-white/10 bg-white/5 group cursor-pointer">
                                                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center"><Camera size={28} className="text-white/20" /></div>}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-brand" /></div>
                                                <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setSelectedFile(f); setPreview(URL.createObjectURL(f)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </GlassCard>

                                        {/* Car Banner */}
                                        <GlassCard className="p-4 flex flex-col items-center gap-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 self-start">Car / Banner Image</p>
                                            <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 group cursor-pointer">
                                                {carPreview ? <img src={carPreview} className="w-full h-full object-cover" alt="Car" /> : <div className="w-full h-full flex items-center justify-center"><Car size={28} className="text-white/20" /></div>}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-brand" /></div>
                                                <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setSelectedCarFile(f); setCarPreview(URL.createObjectURL(f)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </GlassCard>

                                        {/* Profile Type */}
                                        <GlassCard className="p-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">Profile Mode</p>
                                            <div className="flex flex-col gap-2">
                                                {['car', 'business', 'portfolio'].map(t => (
                                                    <button key={t} type="button" onClick={() => setProfile(p => ({ ...p, profileType: t }))}
                                                        className={`py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${profile.profileType === t ? 'bg-brand text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>

                                    {/* Right: Form fields */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <GlassCard className="p-5 space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Basic Info</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div><label className={lbl}>{profile.profileType === 'car' ? 'Car Name' : 'Brand Name'}</label><input name="carName" value={profile.carName} onChange={handleChange} className={inp} placeholder="Matte Black Mustang" required /></div>
                                                <div><label className={lbl}>Owner Name</label><input name="ownerName" value={profile.ownerName} onChange={handleChange} className={inp} placeholder="John Doe" /></div>
                                                <div><label className={lbl}>Phone</label><input name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} className={inp} placeholder="+91 98765 43210" /></div>
                                                <div><label className={lbl}>Profession</label><input name="profession" value={profile.profession} onChange={handleChange} className={inp} placeholder="Car Enthusiast" /></div>
                                                <div className="sm:col-span-2"><label className={lbl}>City</label><input name="city" value={profile.city} onChange={handleChange} className={inp} placeholder="Mumbai, India" /></div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="p-5 space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-red-400">Emergency Info</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div><label className={lbl}>Emergency Contact</label><input name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} className={inp} placeholder="+91 98765 43210" /></div>
                                                <div><label className={lbl}>Blood Group</label>
                                                    <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className={inp}>
                                                        <option value="">Select</option>
                                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        {profile.profileType === 'car' && (
                                            <GlassCard className="p-5 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand">Spec-Sheet</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[['hp', 'HP'], ['torque', 'Torque'], ['engine', 'Engine'], ['mods', 'Mods']].map(([k, l]) => (
                                                        <div key={k}><label className={lbl}>{l}</label>
                                                            <input value={profile.specs?.[k] || ''} onChange={e => setProfile(p => ({ ...p, specs: { ...p.specs, [k]: e.target.value } }))} className={inp} placeholder={l} />
                                                        </div>
                                                    ))}
                                                    <div className="col-span-2"><label className={lbl}>YouTube Build Link</label><input name="youtubeLink" value={profile.youtubeLink || ''} onChange={handleChange} className={inp} placeholder="https://youtube.com/..." /></div>
                                                </div>
                                            </GlassCard>
                                        )}

                                        {profile.profileType !== 'car' && (
                                            <GlassCard className="p-5 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Professional</p>
                                                <div><label className={lbl}>Summary</label><textarea name="workDetails" value={profile.workDetails} onChange={handleChange} className={inp + ' min-h-[90px] resize-none'} placeholder="Brief professional intro..." /></div>
                                                <div><label className={lbl}>Portfolio / Resume Link</label><input name="resumeLink" value={profile.resumeLink} onChange={handleChange} className={inp} placeholder="https://..." /></div>
                                            </GlassCard>
                                        )}

                                        <button type="submit" disabled={saving}
                                            className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-brand text-black hover:brightness-110 shadow-[0_8px_24px_rgba(244,176,11,0.3)]'}`}>
                                            {saving ? 'Saving...' : success ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Profile</>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ══════════ SOCIALS ══════════ */}
                        {activeTab === 'socials' && (
                            <motion.div key="socials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Social Profiles</p>
                                        <div>
                                            <label className={lbl}>Instagram</label>
                                            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-sm">@</span><input name="instagram" value={profile.instagram} onChange={handleChange} className={inp + ' pl-9'} placeholder="yourhandle" /></div>
                                        </div>
                                        <div>
                                            <label className={lbl}>LinkedIn</label>
                                            <input name="linkedin" value={profile.linkedin} onChange={handleChange} className={inp} placeholder="linkedin-username" />
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Privacy & Visibility</p>
                                        {[
                                            { name: 'isPublic', label: 'Public Profile', sub: 'Anyone with QR can view your page', icon: Eye },
                                            { name: 'showPhone', label: 'Show Phone Number', sub: 'Display phone on public page', icon: Eye },
                                            { name: 'emergencyMode', label: '🚨 Emergency Mode', sub: 'Flash SOS info prominently', icon: AlertCircle },
                                        ].map(item => {
                                            const Icon = item.icon;
                                            return (
                                                <label key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-brand/20 cursor-pointer transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <Icon size={18} className={profile[item.name] ? 'text-brand' : 'text-white/20'} />
                                                        <div>
                                                            <div className="font-black text-sm text-white">{item.label}</div>
                                                            <div className="text-[9px] text-white/30 font-bold">{item.sub}</div>
                                                        </div>
                                                    </div>
                                                    <input type="checkbox" name={item.name} checked={profile[item.name]} onChange={handleChange} className="w-5 h-5 rounded accent-brand cursor-pointer" />
                                                </label>
                                            );
                                        })}
                                    </GlassCard>

                                    <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-brand text-black hover:brightness-110'}`}>
                                        {saving ? 'Saving...' : success ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Changes</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ══════════ THEME ══════════ */}
                        {activeTab === 'theme' && (
                            <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Public Profile Theme</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'carbon', name: 'Carbon', colors: ['#000', '#f4b00b'] },
                                                { id: 'neon', name: 'Neon', colors: ['#050505', '#00f2ff'] },
                                                { id: 'cyber', name: 'Cyber', colors: ['#0a0a0f', '#ff0055'] },
                                                { id: 'minimal', name: 'Minimal', colors: ['#111', '#fff'] },
                                            ].map(t => (
                                                <button key={t.id} type="button" onClick={() => setProfile(p => ({ ...p, selectedTheme: t.id }))}
                                                    className={`relative p-4 rounded-2xl border transition-all ${profile.selectedTheme === t.id ? 'border-brand bg-brand/10' : 'border-white/8 bg-white/3 hover:border-white/20'}`}>
                                                    <div className="w-full h-9 rounded-xl mb-2 flex gap-1 p-1.5" style={{ backgroundColor: t.colors[0] }}>
                                                        <div className="w-1/3 h-full rounded-md" style={{ backgroundColor: t.colors[1] }} />
                                                        <div className="flex-1 h-full rounded-md bg-white/5" />
                                                    </div>
                                                    <div className="text-xs font-black uppercase tracking-widest text-white/50">{t.name}</div>
                                                    {profile.selectedTheme === t.id && <div className="absolute top-2 right-2 w-4 h-4 bg-brand rounded-full flex items-center justify-center"><Check size={8} className="text-black" /></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Accent Color</p>
                                        <div className="flex gap-3 flex-wrap">
                                            {['#f4b00b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316'].map(c => (
                                                <button key={c} type="button" onClick={() => setProfile(p => ({ ...p, themeColor: c }))}
                                                    className={`w-10 h-10 rounded-full border-4 transition-all ${profile.themeColor === c ? 'border-white scale-125 shadow-lg' : 'border-transparent'}`}
                                                    style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <input type="color" name="themeColor" value={profile.themeColor || '#f4b00b'} onChange={handleChange}
                                            className="w-full h-12 rounded-2xl cursor-pointer border border-white/10 p-1 bg-transparent" />
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Typography</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[['font-outfit', 'Outfit', 'Modern'], ['font-inter', 'Inter', 'Clean'], ['font-roboto', 'Roboto', 'Pro'], ['font-mono', 'Mono', 'Tech']].map(([id, name, desc]) => (
                                                <button key={id} type="button" onClick={() => setProfile(p => ({ ...p, fontStyle: id }))}
                                                    className={`p-4 rounded-2xl border transition-all text-left ${profile.fontStyle === id ? 'border-brand bg-brand/10' : 'border-white/8 bg-white/3'}`}>
                                                    <div className={`text-2xl font-black mb-1 ${id}`}>Aa</div>
                                                    <div className="text-xs font-black text-white/50">{name}</div>
                                                    <div className="text-[9px] text-white/25 uppercase font-bold">{desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-brand text-black hover:brightness-110'}`}>
                                        {saving ? 'Saving...' : success ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Theme</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ══════════ SETTINGS ══════════ */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md space-y-4">
                                <GlassCard className="p-5 space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Account</p>
                                    <div className="p-4 rounded-2xl bg-white/5">
                                        <div className="font-black">{user?.name || 'User'}</div>
                                        <div className="text-xs text-white/30 font-bold">{user?.email}</div>
                                    </div>
                                    <button onClick={addNewCar} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-brand/30 transition-all text-left">
                                        <Plus size={18} className="text-brand" />
                                        <div><div className="font-black text-sm">Add New Vehicle</div><div className="text-[9px] text-white/30 font-bold">Create another profile</div></div>
                                    </button>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all text-left">
                                            <ShieldCheck size={18} className="text-purple-400" />
                                            <div><div className="font-black text-sm text-purple-300">Admin Panel</div><div className="text-[9px] text-purple-400/50 font-bold">Manage all users</div></div>
                                        </Link>
                                    )}
                                    <button onClick={logout} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/15 hover:border-red-400/30 transition-all text-left">
                                        <LogOut size={18} className="text-red-400" />
                                        <div><div className="font-black text-sm text-red-400">Log Out</div><div className="text-[9px] text-red-400/40 font-bold">Sign out of ScanMyRide</div></div>
                                    </button>
                                </GlassCard>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* ── MOBILE BOTTOM NAV ── */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around px-2 py-2 bg-[#111]/90 backdrop-blur-xl border-t border-white/5">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl flex-1 transition-all ${active ? 'bg-brand text-black' : 'text-white/25 hover:text-white/60'}`}>
                            <Icon size={active ? 22 : 20} />
                            <span className={`text-[7px] font-black uppercase tracking-widest ${active ? '' : 'hidden sm:block'}`}>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Dashboard3;
