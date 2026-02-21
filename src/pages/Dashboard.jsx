import { useState, useEffect, useContext } from 'react';
import Logo from '../components/Logo';
import { AuthContext } from '../context/AuthContext';
import api, { API_URL } from '../api/axios';
import StylishQR from '../components/StylishQR';
import ThemeToggle from '../components/ThemeToggle';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Save, LogOut, ExternalLink, Download,
    Smartphone, User, Briefcase, MapPin,
    Droplets, AlertCircle, Eye, EyeOff, LayoutDashboard,
    Instagram, Linkedin, Camera, Car, Plus, Trash2, Palette,
    ShieldCheck
} from 'lucide-react';



const Dashboard = () => {
    const { logout, user } = useContext(AuthContext);




    const [profiles, setProfiles] = useState([]);
    const [activeProfileIndex, setActiveProfileIndex] = useState(0);
    const [profile, setProfile] = useState({
        carName: '',
        ownerName: '',
        phoneNumber: '',
        profession: '',
        instagram: '',
        linkedin: '',
        emergencyContact: '',
        bloodGroup: '',
        city: '',
        isPublic: true,
        showPhone: true,
        emergencyMode: false,
        uniqueId: '',
        customQrLogo: '',
        themeColor: '#f4b00b',
        uiMode: 'dark',
        fontStyle: 'font-outfit',
        profileType: 'car',
        resumeLink: '',
        workDetails: '',
        youtubeLink: '',
        specs: {
            hp: '',
            torque: '',
            engine: '',
            mods: ''
        }
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedCarFile, setSelectedCarFile] = useState(null);
    const [carPreview, setCarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await api.get('/api/profile/me');
                if (res.data.length > 0) {
                    setProfiles(res.data);

                    // Try to restore last active profile
                    const lastUniqueId = localStorage.getItem('lastProfileId');
                    const lastIndex = res.data.findIndex(p => p.uniqueId === lastUniqueId);

                    const targetIndex = lastIndex !== -1 ? lastIndex : 0;
                    setActiveProfileIndex(targetIndex);
                    const p = res.data[targetIndex];
                    setProfile({
                        ...p,
                        customQrLogo: p.customQrLogo || ''
                    });

                    if (p.profileImage) {
                        const imgUrl = (p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`;
                        setPreview(imgUrl);
                    }
                    if (p.carImage) {
                        const imgUrl = (p.carImage.startsWith('http') || p.carImage.startsWith('data:')) ? p.carImage : `${API_URL}/${p.carImage}`;
                        setCarPreview(imgUrl);
                    }
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, [API_URL]);

    const switchProfile = (index) => {
        setActiveProfileIndex(index);
        const p = profiles[index];
        setProfile({
            ...p,
            customQrLogo: p.customQrLogo || ''
        });
        localStorage.setItem('lastProfileId', p.uniqueId);
        setPreview(p.profileImage ? ((p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`) : null);
        setCarPreview(p.carImage ? ((p.carImage.startsWith('http') || p.carImage.startsWith('data:')) ? p.carImage : `${API_URL}/${p.carImage}`) : null);
    };

    const addNewCar = () => {
        const newProfile = {
            carName: '',
            ownerName: '',
            phoneNumber: '',
            profession: '',
            instagram: '',
            linkedin: '',
            emergencyContact: '',
            bloodGroup: '',
            city: '',
            isPublic: true,
            showPhone: true,
            emergencyMode: false,
            themeColor: '#f4b00b',
            selectedTheme: 'carbon',
            uiMode: 'dark',
            fontStyle: 'font-outfit',
            profileType: 'car',
            resumeLink: '',
            workDetails: '',
            youtubeLink: '',
            specs: {
                hp: '',
                torque: '',
                engine: '',
                mods: ''
            },
            uniqueId: ''
        };
        setProfile(newProfile);
        setActiveProfileIndex(-1); // Indicator for new car
        setPreview(null);
        setCarPreview(null);
        setSelectedFile(null);
        setSelectedCarFile(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };



    const handleCarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedCarFile(file);
            setCarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            // Skip file objects or specific image fields here, handle explicitly
            if (['customQrLogo', 'profileImage', 'carImage', '_id', '__v'].includes(key)) return;

            if (key === 'specs') {
                formData.append('specs', JSON.stringify(profile.specs));
            } else if (profile[key] !== null) {
                formData.append(key, profile[key]);
            }
        });

        if (profile._id) {
            formData.append('id', profile._id);
        }

        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        }
        if (selectedCarFile) {
            formData.append('carImage', selectedCarFile);
        }
        if (profile.customQrLogo && profile.customQrLogo instanceof File) {
            formData.append('customQrLogo', profile.customQrLogo);
        }

        try {
            const res = await api.post('/api/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Refresh profiles list
            const refreshRes = await api.get('/api/profile/me');
            setProfiles(refreshRes.data);

            // Find the updated profile in the new list
            const updatedIndex = refreshRes.data.findIndex(p => p.uniqueId === res.data.uniqueId);
            setActiveProfileIndex(updatedIndex);
            setProfile(refreshRes.data[updatedIndex]);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    const downloadQR = () => {
        const node = document.getElementById('sticker-download-hub');
        if (!node) return;
        setDownloading(true);

        toPng(node, {
            quality: 1,
            pixelRatio: 4,
            backgroundColor: null // Keep transparency
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `ScanMyRide-Sticker-${profile.uniqueId}.png`;
                link.href = dataUrl;
                link.click();
                setDownloading(false);
            })
            .catch((err) => {
                console.error('oops, something went wrong!', err);
                setDownloading(false);
            });
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
        </div>
    );

    const publicUrl = `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/p/${profile.uniqueId}`;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] pb-12 transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass border-b border-[var(--card-border)] px-4 sm:px-6 py-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10" />
                    <div className="hidden xs:block">
                        <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Control Center</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeToggle />
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all border border-purple-600/30 font-bold text-sm"
                            title="Admin Panel"
                        >
                            <ShieldCheck size={16} /> <span className="hidden sm:inline">Admin Panel</span>
                        </Link>
                    )}
                    <button
                        onClick={addNewCar}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-brand text-black hover:scale-105 transition-all font-black text-sm shadow-[0_0_20px_rgba(244,176,11,0.3)]"
                        title="Add Vehicle"
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Add Vehicle</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--card-bg)] text-[var(--text-color)] opacity-70 hover:opacity-100 transition-all border border-[var(--card-border)] font-bold text-sm"
                        title="Logout"
                    >
                        <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: QR & Preview */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_rgba(244,176,11,0.5)]"></div>
                            <h3 className="text-xl font-black mb-8 tracking-tight">YOUR SMART <span className="text-brand">IDENTITY</span></h3>

                            <div className="mb-10 scale-90 sm:scale-100 transition-transform hover:rotate-1">
                                {profile.uniqueId ? (
                                    <>
                                        <StylishQR
                                            id="stylish-sticker"
                                            value={publicUrl}
                                            bgColor={profile.themeColor}
                                        />
                                        {/* Hidden high-res version for export only */}
                                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                                            <StylishQR
                                                id="sticker-download-hub"
                                                value={publicUrl}
                                                isForDownload={true}
                                                bgColor={profile.themeColor}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-[300px] h-[380px] bg-[var(--input-bg)] border-2 border-dashed border-[var(--card-border)] rounded-[3rem] flex items-center justify-center text-[var(--text-color)] opacity-50 text-sm font-black px-12 text-center uppercase tracking-widest mx-auto">
                                        Fill identity to<br />Generate Sticker
                                    </div>
                                )}
                            </div>

                            {profile.uniqueId && (
                                <div className="space-y-4">
                                    <button
                                        onClick={downloadQR}
                                        disabled={downloading}
                                        className="w-full py-4 rounded-2xl bg-brand text-black font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_-10px_rgba(244,176,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download size={20} className={downloading ? 'animate-bounce' : ''} />
                                        {downloading ? 'GENERATING PRINT-READY IMAGE...' : 'DOWNLOAD PREMIUM STICKER'}
                                    </button>
                                    <a
                                        href={publicUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-4 rounded-2xl bg-[var(--input-bg)] text-[var(--text-color)] hover:bg-[var(--card-bg)] font-black flex items-center justify-center gap-2 transition-all border border-[var(--card-border)]"
                                    >
                                        <ExternalLink size={20} /> PREVIEW PAGE
                                    </a>
                                </div>
                            )}
                        </motion.div>

                        <div className="glass-card rounded-[2.5rem] p-8 border-l-4 border-l-brand">
                            <h3 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Car size={14} /> My Fleet ({profiles.length})
                            </h3>
                            <div className="space-y-3">
                                {profiles.map((p, idx) => (
                                    <button
                                        key={p._id}
                                        onClick={() => switchProfile(idx)}
                                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${activeProfileIndex === idx ? 'bg-brand/10 border-brand/50 text-brand' : 'bg-[var(--input-bg)] border-[var(--card-border)] text-[var(--text-color)] opacity-60 hover:opacity-100 hover:bg-[var(--card-bg)]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center overflow-hidden">
                                                {p.carImage ? (
                                                    <img src={p.carImage.startsWith('http') ? p.carImage : `${API_URL}/${p.carImage}`} className="w-full h-full object-cover" alt="" />
                                                ) : <Car size={18} />}
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="font-black text-xs uppercase truncate w-24 sm:w-32">{p.carName || 'Unamed Car'}</div>
                                                    {p.isVerified && <ShieldCheck size={12} className="text-brand fill-current" />}
                                                </div>
                                                <div className="text-[10px] font-bold opacity-60 uppercase">{p.uniqueId}</div>
                                            </div>
                                        </div>
                                        {activeProfileIndex === idx && <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>}
                                    </button>
                                ))}
                                {profiles.length === 0 && (
                                    <div className="text-center py-6 text-[var(--text-color)] opacity-50 text-[10px] font-black uppercase italic">
                                        No vehicles in fleet
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-8">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 space-y-8 sm:space-y-12"
                        >
                            {/* Images Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center relative">
                                    <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--card-border)] bg-[var(--input-bg)] shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:border-brand">
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--text-color)] opacity-50 bg-[var(--input-bg)]">
                                                <Camera size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera className="text-brand" size={32} />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-sm font-black text-brand uppercase tracking-widest">Avatar</span>
                                        <span className="text-[10px] text-[var(--text-color)] opacity-60 font-bold uppercase mt-1 italic">Public Profile Photo</span>
                                    </div>
                                </div>

                                {/* Car Banner Image */}
                                <div className="flex flex-col items-center relative">
                                    <div className="relative group w-full h-40 rounded-3xl overflow-hidden border-4 border-[var(--card-border)] bg-[var(--input-bg)] shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:border-brand">
                                        {carPreview ? (
                                            <img src={carPreview} alt="Car Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--text-color)] opacity-50 bg-[var(--input-bg)]">
                                                <Car size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera className="text-brand" size={32} />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCarFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-sm font-black text-brand uppercase tracking-widest">Car Banner</span>
                                        <span className="text-[10px] text-[var(--text-color)] opacity-60 font-bold uppercase mt-1 italic">Background Image</span>
                                    </div>
                                </div>
                            </div>

                            {/* Identity Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                                        <User size={18} className="text-brand" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-widest text-[var(--text-color)]">Profile Mode & Identity</h2>
                                </div>

                                {/* Profile Type Selector */}
                                <div className="mb-10 flex bg-[var(--input-bg)] p-1 rounded-2xl border border-[var(--card-border)] max-w-md mx-auto">
                                    {['car', 'business', 'portfolio'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setProfile(prev => ({ ...prev, profileType: type }))}
                                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${profile.profileType === type ? 'bg-brand text-black shadow-lg scale-105' : 'text-zinc-500 opacity-60'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">
                                            {profile.profileType === 'car' ? 'Car Identification' : 'Business/Portfolio Name'}
                                        </label>
                                        <input
                                            name="carName"
                                            value={profile.carName}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder={profile.profileType === 'car' ? "e.g. Matte Black Mustang" : "e.g. Creative Studio / Personal Brand"}
                                            required
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Owner Name</label>
                                        <input
                                            name="ownerName"
                                            value={profile.ownerName}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Emergency Contact</label>
                                        <input
                                            name="phoneNumber"
                                            value={profile.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Profession / Title</label>
                                        <input
                                            name="profession"
                                            value={profile.profession}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="Business Owner / Software Engineer"
                                        />
                                    </div>

                                    {profile.profileType !== 'car' && (
                                        <>
                                            <div className="group space-y-3 md:col-span-2">
                                                <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Professional Summary / Work Details</label>
                                                <textarea
                                                    name="workDetails"
                                                    value={profile.workDetails}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] outline-none transition-all font-medium resize-none"
                                                    placeholder="Briefly describe your services, projects or work experience..."
                                                />
                                            </div>
                                            <div className="group space-y-3 md:col-span-2">
                                                <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Resume / Portfolio PDF Link</label>
                                                <input
                                                    name="resumeLink"
                                                    value={profile.resumeLink}
                                                    onChange={handleChange}
                                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] outline-none transition-all font-medium"
                                                    placeholder="https://drive.google.com/... (Link to your resume)"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {profile.profileType === 'car' && (
                                        <>
                                            <div className="group space-y-3 md:col-span-2">
                                                <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">YouTube Build Video</label>
                                                <input
                                                    name="youtubeLink"
                                                    value={profile.youtubeLink || ''}
                                                    onChange={handleChange}
                                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] outline-none transition-all font-medium"
                                                    placeholder="youtube.com/watch?v=..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:col-span-2 pt-4 border-t border-white/5">
                                                <div className="group space-y-3">
                                                    <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1">Horsepower</label>
                                                    <input
                                                        value={profile.specs?.hp || ''}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, specs: { ...prev.specs, hp: e.target.value } }))}
                                                        className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium"
                                                        placeholder="450 HP"
                                                    />
                                                </div>
                                                <div className="group space-y-3">
                                                    <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1">Torque</label>
                                                    <input
                                                        value={profile.specs?.torque || ''}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, specs: { ...prev.specs, torque: e.target.value } }))}
                                                        className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium"
                                                        placeholder="500 NM"
                                                    />
                                                </div>
                                                <div className="group space-y-3">
                                                    <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1">Engine</label>
                                                    <input
                                                        value={profile.specs?.engine || ''}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, specs: { ...prev.specs, engine: e.target.value } }))}
                                                        className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium"
                                                        placeholder="5.0L V8"
                                                    />
                                                </div>
                                                <div className="group space-y-3 md:col-span-3">
                                                    <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1">Performance Modifications</label>
                                                    <textarea
                                                        value={profile.specs?.mods || ''}
                                                        onChange={(e) => setProfile(prev => ({ ...prev, specs: { ...prev.specs, mods: e.target.value } }))}
                                                        className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium resize-none"
                                                        rows="2"
                                                        placeholder="Stage 2 Tune, Full Exhaust, Air Intake..."
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>

                            {/* Additional Info */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--input-bg)] flex items-center justify-center">
                                        <MapPin size={18} className="text-[var(--text-color)] opacity-50" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-widest text-[var(--text-color)]">Socials & Health</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Instagram Profile</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-60 font-bold">@</div>
                                            <input
                                                name="instagram"
                                                value={profile.instagram}
                                                onChange={handleChange}
                                                className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 pl-10 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium"
                                                placeholder="handle"
                                            />
                                        </div>
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">LinkedIn ID</label>
                                        <input
                                            name="linkedin"
                                            value={profile.linkedin}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={profile.bloodGroup}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-black uppercase appearance-none"
                                        >
                                            <option value="">Select Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Home City</label>
                                        <input
                                            name="city"
                                            value={profile.city}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-color)] focus:border-brand/50 focus:bg-[var(--card-bg)] transition-all font-medium"
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                            </section>





                            {/* Pro Theme Engine */}
                            <section className="bg-[var(--input-bg)] p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-brand/20 shadow-[0_0_40px_rgba(244,176,11,0.05)]">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                                            <Palette size={20} className="text-brand" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black uppercase tracking-widest text-[var(--text-color)]">PRO THEME <span className="text-brand">ENGINE</span></h2>
                                            <p className="text-[10px] text-[var(--text-color)] opacity-60 font-bold uppercase">Personalize your public profile aesthetic</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-widest">PRO UNLOCKED</div>
                                </div>

                                <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                                    {[
                                        { id: 'carbon', name: 'CARBON', colors: ['#000', '#f4b00b'] },
                                        { id: 'neon', name: 'NEON', colors: ['#050505', '#00f2ff'] },
                                        { id: 'cyber', name: 'CYBER', colors: ['#0a0a0f', '#ff0055'] },
                                        { id: 'minimal', name: 'MINIMAL', colors: ['#0f0f0f', '#fff'] }
                                    ].map(theme => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setProfile(prev => ({ ...prev, selectedTheme: theme.id }))}
                                            className={`relative group p-4 rounded-2xl border transition-all ${profile.selectedTheme === theme.id ? 'border-brand bg-brand/10' : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--input-bg)]'}`}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-full h-12 rounded-lg flex gap-1 p-1" style={{ backgroundColor: theme.colors[0] }}>
                                                    <div className="w-1/3 h-full rounded-sm" style={{ backgroundColor: theme.colors[1] }}></div>
                                                    <div className="flex-1 h-full rounded-sm bg-white/5"></div>
                                                </div>
                                                <span className={`text-[10px] font-black tracking-widest ${profile.selectedTheme === theme.id ? 'text-brand' : 'text-[var(--text-color)] opacity-60'}`}>{theme.name}</span>
                                            </div>
                                            {profile.selectedTheme === theme.id && <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Color & UI Mode */}
                                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em]">Brand Accent Color</label>
                                            <div className="flex gap-2">
                                                {['#f4b00b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7'].map(color => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setProfile(prev => ({ ...prev, themeColor: color }))}
                                                        className={`w-6 h-6 rounded-full border-2 transition-all ${profile.themeColor === color ? 'border-white scale-125' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <input
                                            type="color"
                                            name="themeColor"
                                            value={profile.themeColor || '#f4b00b'}
                                            onChange={handleChange}
                                            className="w-full h-12 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] p-1 cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em]">Public UI Mode</label>
                                        <div className="flex bg-[var(--input-bg)] p-1 rounded-2xl border border-[var(--card-border)]">
                                            <button
                                                type="button"
                                                onClick={() => setProfile(prev => ({ ...prev, uiMode: 'dark' }))}
                                                className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${profile.uiMode === 'dark' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}
                                            >
                                                DARK
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setProfile(prev => ({ ...prev, uiMode: 'light' }))}
                                                className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${profile.uiMode === 'light' ? 'bg-white text-black shadow-lg' : 'text-zinc-500'}`}
                                            >
                                                LIGHT
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Font Selection */}
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <label className="text-[10px] font-black text-[var(--text-color)] opacity-60 uppercase tracking-[0.2em] mb-4 block">Typography Style</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { id: 'font-outfit', name: 'Outfit (Modern)', class: 'font-outfit' },
                                            { id: 'font-inter', name: 'Inter (Clean)', class: 'font-inter' },
                                            { id: 'font-roboto', name: 'Roboto (Pro)', class: 'font-roboto' },
                                            { id: 'font-mono', name: 'Mono (Tech)', class: 'font-mono' }
                                        ].map(f => (
                                            <button
                                                key={f.id}
                                                type="button"
                                                onClick={() => setProfile(prev => ({ ...prev, fontStyle: f.id }))}
                                                className={`p-4 rounded-2xl border transition-all text-left ${profile.fontStyle === f.id ? 'border-brand bg-brand/10' : 'border-[var(--card-border)] bg-[var(--card-bg)]'}`}
                                            >
                                                <div className={`text-xl mb-1 ${f.class}`}>Aa</div>
                                                <div className="text-[10px] font-black opacity-60 truncate">{f.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Visibility Toggles */}
                            <section className="bg-[var(--input-bg)] p-6 sm:p-8 rounded-[2rem] border border-[var(--card-border)]">
                                <h3 className="text-[10px] font-black text-[var(--text-color)] opacity-50 uppercase tracking-[0.3em] mb-8 text-center italic">Privacy & Security Guard</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex items-center justify-between p-6 rounded-2xl bg-[var(--card-bg)] hover:bg-[var(--input-bg)] border border-[var(--card-border)] cursor-pointer transition-all group overflow-hidden relative">
                                        {profile.isPublic && <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.isPublic ? 'bg-green-500/10 text-green-500' : 'bg-[var(--input-bg)] text-[var(--text-color)] opacity-50'}`}>
                                                {profile.isPublic ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </div>
                                            <div>
                                                <span className="font-black text-sm block uppercase tracking-wider text-[var(--text-color)]">Public Accessibility</span>
                                                <span className="text-[10px] text-[var(--text-color)] opacity-60 font-bold uppercase">{profile.isPublic ? 'Everyone can see' : 'QR Is Disabled'}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="isPublic"
                                            checked={profile.isPublic}
                                            onChange={handleChange}
                                            className="w-6 h-6 rounded-lg accent-brand"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-6 rounded-2xl bg-[var(--card-bg)] hover:bg-[var(--input-bg)] border border-[var(--card-border)] cursor-pointer transition-all group overflow-hidden relative">
                                        {profile.emergencyMode && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.emergencyMode ? 'bg-red-500/10 text-red-500' : 'bg-[var(--input-bg)] text-[var(--text-color)] opacity-50'}`}>
                                                <AlertCircle size={20} className={profile.emergencyMode ? "animate-pulse" : ""} />
                                            </div>
                                            <div>
                                                <span className="font-black text-sm block uppercase tracking-wider text-red-400">SOS Mode</span>
                                                <span className="text-[10px] text-[var(--text-color)] opacity-60 font-bold uppercase">{profile.emergencyMode ? 'High Alert Active' : 'Normal Standby'}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="emergencyMode"
                                            checked={profile.emergencyMode}
                                            onChange={handleChange}
                                            className="w-6 h-6 rounded-lg accent-red-500"
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* Sticky Footer for Actions */}
                            <div className="flex items-center justify-between pt-10 border-t border-[var(--card-border)] mt-4">
                                <div className="hidden sm:block">
                                    <div className="text-[10px] text-[var(--text-color)] opacity-50 font-black uppercase tracking-widest">Last Modified</div>
                                    <div className="text-sm font-bold text-[var(--text-color)] opacity-80">{profile.lastScanned ? new Date(profile.lastScanned).toLocaleDateString() : 'New Device'}</div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-12 py-5 rounded-[1.5rem] font-black text-xl flex items-center gap-3 transition-all active:scale-95 shadow-2xl ${success ? 'bg-green-500 text-white translate-y-[-2px]' : 'bg-brand text-black hover:scale-[1.02] hover:shadow-brand/20'}`}
                                >
                                    {saving ? 'UPDATING...' : success ? 'ALL SAVED!' : 'UPDATE PROFILE'}
                                    {!saving && !success && <Save size={24} />}
                                </button>
                            </div>

                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
